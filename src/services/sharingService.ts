import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig';

export interface KhatmSlot {
  reservedBy: string; // Username of person who claimed it
  completed: boolean;
  timestamp: number;
}

export interface KhatmRoom {
  roomId: string;
  name: string;
  createdAt: number;
  mode: 'fixed' | 'dynamic';
  memberCount: number; // Number of members in group (2-30) for fixed mode
  slots: Record<number, KhatmSlot>; // 1 to 30 Juz slots
}

export interface DhikrCircleMember {
  username: string;
  count: number;
  lastActive: number;
}

export interface DhikrCircle {
  circleId: string;
  name: string;
  createdAt: number;
  targetCount: number;
  totalCount: number;
  members: Record<string, DhikrCircleMember>;
  arabic?: string;
  translation?: string;
}

async function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Connection timed out. Please check your internet connectivity.'));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

async function executeFirestore<T>(op: () => Promise<T>, timeoutMs = 6000): Promise<T> {
  try {
    return await withTimeout(op(), timeoutMs);
  } catch (error: any) {
    console.warn('[Firestore Service Error]', error);
    const msg = (error?.message || '').toLowerCase();
    if (msg.includes('timeout') || msg.includes('deadline')) {
      throw new Error('Connection timed out. Please check your internet connectivity.');
    }
    if (msg.includes('offline') || msg.includes('network') || msg.includes('unavailable') || msg.includes('failed-precondition')) {
      throw new Error('Database is currently offline. Please verify your connection.');
    }
    throw error;
  }
}

/**
 * Calculates the Juz division ranges for a member in a group Khatm
 */
export function getJuzDivisionForMember(memberIndex: number, totalMembers: number): number[] {
  const juzList: number[] = [];
  const juzPerMember = Math.floor(30 / totalMembers);
  const remainder = 30 % totalMembers;
  
  let startJuz = 1;
  for (let i = 0; i < totalMembers; i++) {
    const count = juzPerMember + (i < remainder ? 1 : 0);
    if (i === memberIndex) {
      for (let j = 0; j < count; j++) {
        juzList.push(startJuz + j);
      }
      break;
    }
    startJuz += count;
  }
  return juzList;
}

class SharingService {
  private localKhatmRooms: Record<string, KhatmRoom> = {};
  private localDhikrCircles: Record<string, DhikrCircle> = {};
  private khatmListeners: Record<string, ((room: KhatmRoom | null) => void)[]> = {};
  private circleListeners: Record<string, ((circle: DhikrCircle | null) => void)[]> = {};

  private isOffline(): boolean {
    return !firestoreDb;
  }

  private notifyKhatmListeners(roomId: string) {
    const key = roomId.toLowerCase();
    const room = this.localKhatmRooms[key] || null;
    const listeners = this.khatmListeners[key];
    if (listeners) {
      listeners.forEach((listener) => listener(room ? { ...room, slots: { ...room.slots } } : null));
    }
  }

  private notifyCircleListeners(circleId: string) {
    const key = circleId.toLowerCase();
    const circle = this.localDhikrCircles[key] || null;
    const listeners = this.circleListeners[key];
    if (listeners) {
      listeners.forEach((listener) => listener(circle ? { ...circle, members: { ...circle.members } } : null));
    }
  }

  // --- 1. GROUP KHATM ROOMS ---

  /**
   * Create a new Khatm Room with specific member division
   */
  async createKhatmRoom(roomId: string, name: string, mode: 'fixed' | 'dynamic', memberCount: number): Promise<KhatmRoom> {
    const defaultSlots: Record<number, KhatmSlot> = {};
    for (let i = 1; i <= 30; i += 1) {
      defaultSlots[i] = { reservedBy: '', completed: false, timestamp: 0 };
    }

    const room: KhatmRoom = {
      roomId: roomId.trim().toLowerCase(),
      name: name.trim(),
      createdAt: Date.now(),
      mode,
      memberCount: Math.max(2, Math.min(30, memberCount)),
      slots: defaultSlots,
    };

    if (this.isOffline()) {
      this.localKhatmRooms[room.roomId] = room;
      this.notifyKhatmListeners(room.roomId);
      return room;
    }

    const docRef = doc(firestoreDb!, 'khatm_rooms', room.roomId);
    await executeFirestore(() => setDoc(docRef, room));
    return room;
  }

  /**
   * Reserves all Juz slots assigned to a member division
   */
  async claimMemberDivision(
    roomId: string,
    memberIndex: number,
    totalMembers: number,
    username: string
  ): Promise<void> {
    if (this.isOffline()) {
      const room = this.localKhatmRooms[roomId.toLowerCase()];
      if (!room) throw new Error('Khatm room not found');
      const slots = { ...room.slots };
      const division = getJuzDivisionForMember(memberIndex, totalMembers);

      for (const juzNum of division) {
        const activeClaim = slots[juzNum]?.reservedBy;
        if (activeClaim && activeClaim !== username) {
          throw new Error(`Juz ${juzNum} in this division is already claimed by ${activeClaim}`);
        }
      }

      for (const juzNum of division) {
        slots[juzNum] = {
          reservedBy: username,
          completed: slots[juzNum]?.completed || false,
          timestamp: Date.now(),
        };
      }
      room.slots = slots;
      this.notifyKhatmListeners(roomId);
      return;
    }

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    const snap = await executeFirestore(() => getDoc(docRef));
    if (!snap.exists()) throw new Error('Khatm room not found');

    const data = snap.data() as KhatmRoom;
    const slots = { ...data.slots };
    const division = getJuzDivisionForMember(memberIndex, totalMembers);

    // Verify slots are not claimed by someone else
    for (const juzNum of division) {
      const activeClaim = slots[juzNum]?.reservedBy;
      if (activeClaim && activeClaim !== username) {
        throw new Error(`Juz ${juzNum} in this division is already claimed by ${activeClaim}`);
      }
    }

    // Apply claims
    for (const juzNum of division) {
      slots[juzNum] = {
        reservedBy: username,
        completed: slots[juzNum]?.completed || false,
        timestamp: Date.now(),
      };
    }

    await executeFirestore(() => updateDoc(docRef, { slots }));
  }

  /**
   * Reserve a specific Juz slot manually
   */
  async reserveJuzSlot(
    roomId: string,
    juzNum: number,
    username: string
  ): Promise<void> {
    if (this.isOffline()) {
      const room = this.localKhatmRooms[roomId.toLowerCase()];
      if (!room) throw new Error('Khatm room not found');
      const slots = { ...room.slots };

      if (slots[juzNum]?.reservedBy && slots[juzNum].reservedBy !== username) {
        throw new Error(`Juz ${juzNum} is already reserved by ${slots[juzNum].reservedBy}`);
      }

      slots[juzNum] = {
        reservedBy: username,
        completed: slots[juzNum]?.completed || false,
        timestamp: Date.now(),
      };
      room.slots = slots;
      this.notifyKhatmListeners(roomId);
      return;
    }

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    const snap = await executeFirestore(() => getDoc(docRef));
    if (!snap.exists()) throw new Error('Khatm room not found');

    const data = snap.data() as KhatmRoom;
    const slots = { ...data.slots };
    
    if (slots[juzNum]?.reservedBy && slots[juzNum].reservedBy !== username) {
      throw new Error(`Juz ${juzNum} is already reserved by ${slots[juzNum].reservedBy}`);
    }

    slots[juzNum] = {
      reservedBy: username,
      completed: slots[juzNum]?.completed || false,
      timestamp: Date.now(),
    };

    await executeFirestore(() => updateDoc(docRef, { slots }));
  }

  /**
   * Mark a Juz slot as completed
   */
  async updateJuzCompletion(
    roomId: string,
    juzNum: number,
    completed: boolean,
    username: string
  ): Promise<void> {
    if (this.isOffline()) {
      const room = this.localKhatmRooms[roomId.toLowerCase()];
      if (!room) throw new Error('Khatm room not found');
      const slots = { ...room.slots };

      if (!slots[juzNum] || slots[juzNum].reservedBy !== username) {
        throw new Error(`You must reserve Juz ${juzNum} before updating its completion status.`);
      }

      slots[juzNum].completed = completed;
      slots[juzNum].timestamp = Date.now();
      room.slots = slots;
      this.notifyKhatmListeners(roomId);
      return;
    }

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    const snap = await executeFirestore(() => getDoc(docRef));
    if (!snap.exists()) throw new Error('Khatm room not found');

    const data = snap.data() as KhatmRoom;
    const slots = { ...data.slots };

    if (!slots[juzNum] || slots[juzNum].reservedBy !== username) {
      throw new Error(`You must reserve Juz ${juzNum} before updating its completion status.`);
    }

    slots[juzNum].completed = completed;
    slots[juzNum].timestamp = Date.now();

    await executeFirestore(() => updateDoc(docRef, { slots }));
  }

  /**
   * Real-time subscription to a Khatm Room
   */
  subscribeToKhatmRoom(
    roomId: string,
    onUpdate: (room: KhatmRoom | null) => void
  ): () => void {
    if (this.isOffline()) {
      const room = this.localKhatmRooms[roomId.toLowerCase()] || null;
      onUpdate(room);
      
      const key = roomId.toLowerCase();
      if (!this.khatmListeners[key]) {
        this.khatmListeners[key] = [];
      }
      this.khatmListeners[key].push(onUpdate);

      return () => {
        this.khatmListeners[key] = this.khatmListeners[key].filter((l) => l !== onUpdate);
      };
    }

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as KhatmRoom);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        console.warn('KhatmRoom subscribe error:', err);
        onUpdate(null);
      }
    );
  }

  // --- 2. COOPERATIVE DHIKR CIRCLES ---

  /**
   * Create a new Dhikr Circle
   */
  async createDhikrCircle(
    circleId: string,
    name: string,
    targetCount: number,
    arabic?: string,
    translation?: string
  ): Promise<DhikrCircle> {
    const circle: DhikrCircle = {
      circleId: circleId.trim().toLowerCase(),
      name: name.trim(),
      createdAt: Date.now(),
      targetCount,
      totalCount: 0,
      members: {},
      arabic: arabic?.trim(),
      translation: translation?.trim(),
    };

    if (this.isOffline()) {
      this.localDhikrCircles[circle.circleId] = circle;
      this.notifyCircleListeners(circle.circleId);
      return circle;
    }

    const docRef = doc(firestoreDb!, 'dhikr_circles', circle.circleId);
    await executeFirestore(() => setDoc(docRef, circle));
    return circle;
  }

  /**
   * Update personal count in a Dhikr Circle
   */
  async updateCircleCount(
    circleId: string,
    username: string,
    personalCount: number
  ): Promise<void> {
    if (this.isOffline()) {
      const circle = this.localDhikrCircles[circleId.toLowerCase()];
      if (!circle) throw new Error('Dhikr Circle not found');
      const members = { ...circle.members };

      members[username] = {
        username,
        count: personalCount,
        lastActive: Date.now(),
      };

      const newTotal = Object.values(members).reduce((acc, m) => acc + m.count, 0);
      circle.members = members;
      circle.totalCount = newTotal;
      this.notifyCircleListeners(circleId);
      return;
    }

    const docRef = doc(firestoreDb!, 'dhikr_circles', circleId.toLowerCase());
    const snap = await executeFirestore(() => getDoc(docRef));
    if (!snap.exists()) throw new Error('Dhikr Circle not found');

    const data = snap.data() as DhikrCircle;
    const members = { ...data.members };
    
    members[username] = {
      username,
      count: personalCount,
      lastActive: Date.now(),
    };

    const newTotal = Object.values(members).reduce((acc, m) => acc + m.count, 0);

    await executeFirestore(() => updateDoc(docRef, {
      members,
      totalCount: newTotal,
    }));
  }

  /**
   * Real-time subscription to a Dhikr Circle
   */
  subscribeToDhikrCircle(
    circleId: string,
    onUpdate: (circle: DhikrCircle | null) => void
  ): () => void {
    if (this.isOffline()) {
      const circle = this.localDhikrCircles[circleId.toLowerCase()] || null;
      onUpdate(circle);

      const key = circleId.toLowerCase();
      if (!this.circleListeners[key]) {
        this.circleListeners[key] = [];
      }
      this.circleListeners[key].push(onUpdate);

      return () => {
        this.circleListeners[key] = this.circleListeners[key].filter((l) => l !== onUpdate);
      };
    }

    const docRef = doc(firestoreDb!, 'dhikr_circles', circleId.toLowerCase());
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as DhikrCircle);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        console.warn('DhikrCircle subscribe error:', err);
        onUpdate(null);
      }
    );
  }
}

export const sharingService = new SharingService();
