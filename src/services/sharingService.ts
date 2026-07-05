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
  memberCount: number; // Number of members in group (2-30)
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
  private isOffline(): boolean {
    return !firestoreDb;
  }

  // --- 1. GROUP KHATM ROOMS ---

  /**
   * Create a new Khatm Room with specific member division
   */
  async createKhatmRoom(roomId: string, name: string, memberCount: number): Promise<KhatmRoom> {
    const defaultSlots: Record<number, KhatmSlot> = {};
    for (let i = 1; i <= 30; i += 1) {
      defaultSlots[i] = { reservedBy: '', completed: false, timestamp: 0 };
    }

    const room: KhatmRoom = {
      roomId: roomId.trim().toLowerCase(),
      name: name.trim(),
      createdAt: Date.now(),
      memberCount: Math.max(2, Math.min(30, memberCount)),
      slots: defaultSlots,
    };

    if (this.isOffline()) {
      return room;
    }

    const docRef = doc(firestoreDb!, 'khatm_rooms', room.roomId);
    await setDoc(docRef, room);
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
    if (this.isOffline()) return;

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    const snap = await getDoc(docRef);
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

    await updateDoc(docRef, { slots });
  }

  /**
   * Reserve a specific Juz slot manually
   */
  async reserveJuzSlot(
    roomId: string,
    juzNum: number,
    username: string
  ): Promise<void> {
    if (this.isOffline()) return;

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    const snap = await getDoc(docRef);
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

    await updateDoc(docRef, { slots });
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
    if (this.isOffline()) return;

    const docRef = doc(firestoreDb!, 'khatm_rooms', roomId.toLowerCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Khatm room not found');

    const data = snap.data() as KhatmRoom;
    const slots = { ...data.slots };

    if (!slots[juzNum] || slots[juzNum].reservedBy !== username) {
      throw new Error(`You must reserve Juz ${juzNum} before updating its completion status.`);
    }

    slots[juzNum].completed = completed;
    slots[juzNum].timestamp = Date.now();

    await updateDoc(docRef, { slots });
  }

  /**
   * Real-time subscription to a Khatm Room
   */
  subscribeToKhatmRoom(
    roomId: string,
    onUpdate: (room: KhatmRoom | null) => void
  ): () => void {
    if (this.isOffline()) {
      onUpdate(null);
      return () => undefined;
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
    targetCount: number
  ): Promise<DhikrCircle> {
    const circle: DhikrCircle = {
      circleId: circleId.trim().toLowerCase(),
      name: name.trim(),
      createdAt: Date.now(),
      targetCount,
      totalCount: 0,
      members: {},
    };

    if (this.isOffline()) {
      return circle;
    }

    const docRef = doc(firestoreDb!, 'dhikr_circles', circle.circleId);
    await setDoc(docRef, circle);
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
    if (this.isOffline()) return;

    const docRef = doc(firestoreDb!, 'dhikr_circles', circleId.toLowerCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Dhikr Circle not found');

    const data = snap.data() as DhikrCircle;
    const members = { ...data.members };
    
    members[username] = {
      username,
      count: personalCount,
      lastActive: Date.now(),
    };

    const newTotal = Object.values(members).reduce((acc, m) => acc + m.count, 0);

    await updateDoc(docRef, {
      members,
      totalCount: newTotal,
    });
  }

  /**
   * Real-time subscription to a Dhikr Circle
   */
  subscribeToDhikrCircle(
    circleId: string,
    onUpdate: (circle: DhikrCircle | null) => void
  ): () => void {
    if (this.isOffline()) {
      onUpdate(null);
      return () => undefined;
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
