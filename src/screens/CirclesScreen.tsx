import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Modal } from 'react-native';
import { isFirebaseEnabled, firestoreDb } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { googleAuthService, AuthState } from '../services/googleAuthService';
import {
  sharingService,
  KhatmRoom,
  DhikrCircle,
  getJuzDivisionForMember,
} from '../services/sharingService';
import { bookmarkService } from '../services/bookmarkService';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS } from '../utils/constants';
import { QRScannerModal } from '../components/QRScannerModal';
import { getQRCodeUrl, buildCircleUri, buildKhatmUri } from '../utils/qrHelper';

const CIRCLE_DHIKR_KEY = '@dhikr_circle_items';
const KHATM_ROOMS_KEY = '@khatm_rooms_registry';

export const PREDEFINED_DHIKR_OPTIONS = [
  { name: 'Subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', translation: 'Glory be to Allah' },
  { name: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', translation: 'Praise be to Allah' },
  { name: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', translation: 'Allah is the Greatest' },
  { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', translation: 'I seek forgiveness from Allah' },
  { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', translation: 'There is no deity but Allah' },
  { name: 'Custom Dhikr', arabic: '', translation: '' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  authCard: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 28,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  authIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: FONTS.english,
    marginBottom: 6,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  inputGroup: {
    width: '100%',
    gap: 6,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    width: '100%',
  },
  btn: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1.2,
  },
  dividerText: {
    fontSize: 11,
    marginHorizontal: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  googleBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '900',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '800',
  },
  profileSub: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    padding: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 4,
    borderWidth: 1.2,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  activeHeaderCard: {
    padding: 16,
    borderBottomWidth: 1,
  },
  activeTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  activeSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  leaveBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  juzRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  juzNumText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  juzClaimedText: {
    fontSize: 11,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  giantCircleBtn: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  modeToggleBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export const CirclesScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  // Auth State
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Tab State
  const [activeTab, setActiveTab] = useState<'quran' | 'dhikr'>('quran');

  // Quran Circle State
  const [activeKhatmId, setActiveKhatmId] = useState<string | null>(null);
  const [activeKhatmRoom, setActiveKhatmRoom] = useState<KhatmRoom | null>(null);
  const [khatmRoomNameInput, setKhatmRoomNameInput] = useState('');
  const [khatmMode, setKhatmMode] = useState<'fixed' | 'dynamic'>('dynamic');
  const [khatmMemberCountInput, setKhatmMemberCountInput] = useState('5');
  const [joinKhatmIdInput, setJoinKhatmIdInput] = useState('');

  // Dhikr Circle State
  const [activeCircleId, setActiveCircleId] = useState<string | null>(null);
  const [activeCircle, setActiveCircle] = useState<DhikrCircle | null>(null);
  const [circleNameInput, setCircleNameInput] = useState('');
  const [circleTargetInput, setCircleTargetInput] = useState('1000');
  const [joinCircleIdInput, setJoinCircleIdInput] = useState('');
  const [selectedDhikrIndex, setSelectedDhikrIndex] = useState<number>(0);
  const [customArabicInput, setCustomArabicInput] = useState('');
  const [customTranslationInput, setCustomTranslationInput] = useState('');

  // History/Registry State
  const [savedKhatmRooms, setSavedKhatmRooms] = useState<any[]>([]);
  const [savedDhikrCircles, setSavedDhikrCircles] = useState<any[]>([]);
  const [showCreateJoinForm, setShowCreateJoinForm] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track user's session counts locally before syncing
  const [circleIncrementPending, setCircleIncrementPending] = useState(0);

  // Load saved history on mount/focus
  const loadSavedCirclesAndRooms = async () => {
    try {
      const khatmRaw = await AsyncStorage.getItem(KHATM_ROOMS_KEY);
      setSavedKhatmRooms(khatmRaw ? JSON.parse(khatmRaw) : []);
      
      const dhikrRaw = await AsyncStorage.getItem(CIRCLE_DHIKR_KEY);
      setSavedDhikrCircles(dhikrRaw ? JSON.parse(dhikrRaw) : []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadSavedCirclesAndRooms();
    const unsubFocus = navigation.addListener('focus', () => {
      loadSavedCirclesAndRooms();
    });
    return unsubFocus;
  }, [navigation]);

  // Subscribe to auth state on mount
  useEffect(() => {
    const unsub = googleAuthService.subscribe((state) => {
      setAuthState(state);
    });
    return unsub;
  }, []);

  // Subscribe to Khatm Room real-time changes
  useEffect(() => {
    if (!activeKhatmId) {
      setActiveKhatmRoom(null);
      return;
    }
    const unsub = sharingService.subscribeToKhatmRoom(activeKhatmId, (room) => {
      setActiveKhatmRoom(room);
    });
    return unsub;
  }, [activeKhatmId]);

  // Subscribe to Dhikr Circle real-time changes
  useEffect(() => {
    if (!activeCircleId) {
      setActiveCircle(null);
      return;
    }
    const unsub = sharingService.subscribeToDhikrCircle(activeCircleId, (circle) => {
      setActiveCircle(circle);
    });
    return unsub;
  }, [activeCircleId]);

  // Handle Login via Google
  const handleGoogleLogin = async () => {
    try {
      await googleAuthService.loginNatively();
    } catch (err: any) {
      Alert.alert('Sign In', err?.message || 'Google sign-in failed');
    }
  };
  // Handle Logout
  const handleLogout = async () => {
    await googleAuthService.logout();
    setActiveKhatmId(null);
    setActiveCircleId(null);
  };

  // Khatm Handlers
  const handleCreateKhatmRoom = async () => {
    const name = khatmRoomNameInput.trim();
    const members = parseInt(khatmMemberCountInput, 10);
    if (!name) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }
    if (khatmMode === 'fixed' && (isNaN(members) || members < 2 || members > 30)) {
      Alert.alert('Error', 'Member count must be between 2 and 30');
      return;
    }

    const generatedId = `khatm_${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const room = await sharingService.createKhatmRoom(
        generatedId,
        name,
        khatmMode,
        khatmMode === 'fixed' ? members : 0,
        authState.user?.name || undefined
      );
      setActiveKhatmId(room.roomId);
      setKhatmRoomNameInput('');
      await saveKhatmRoomItem(room.roomId, room.name);
      Alert.alert('Success', `Khatm Room Created!\nRoom Code: ${room.roomId.toUpperCase()}`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create room');
    }
  };

  const saveKhatmRoomItem = async (roomId: string, name: string) => {
    try {
      const raw = await AsyncStorage.getItem(KHATM_ROOMS_KEY);
      const existing: any[] = raw ? JSON.parse(raw) : [];
      const alreadyExists = existing.some((r) => r.roomId === roomId);
      if (!alreadyExists) {
        existing.push({
          roomId,
          name,
          createdAt: Date.now(),
        });
        await AsyncStorage.setItem(KHATM_ROOMS_KEY, JSON.stringify(existing));
      }
      await loadSavedCirclesAndRooms();
    } catch (e) {
      console.warn('Failed to save Khatm room:', e);
    }
  };

  const handleRemoveSavedKhatm = async (roomId: string) => {
    try {
      setLoading(true);
      let isAdmin = false;
      
      if (isFirebaseEnabled && firestoreDb) {
        try {
          const docRef = doc(firestoreDb, 'khatm_rooms', roomId.toLowerCase());
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.createdBy === authState.user?.name) {
              isAdmin = true;
            }
          }
        } catch (e) {
          console.warn('Failed to check room admin status:', e);
        }
      }
      
      setLoading(false);
      
      const confirmMsg = isAdmin
        ? 'Are you sure you want to delete this Quran circle? As the admin, this will delete the circle for all members and remove it from the cloud.'
        : 'Are you sure you want to leave this Quran circle?';
        
      Alert.alert(
        isAdmin ? 'Delete Circle (Admin)' : 'Leave Circle',
        confirmMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: isAdmin ? 'Delete for Everyone' : 'Leave',
            style: 'destructive',
            onPress: async () => {
              try {
                if (isFirebaseEnabled) {
                  if (isAdmin) {
                    await sharingService.deleteKhatmRoom(roomId);
                  } else if (authState.user?.name) {
                    await sharingService.leaveKhatmRoom(roomId, authState.user.name);
                  }
                }
              } catch (err) {
                console.warn('Cloud sync leave/delete error:', err);
              }
              
              // Remove locally
              const raw = await AsyncStorage.getItem(KHATM_ROOMS_KEY);
              if (raw) {
                const existing: any[] = JSON.parse(raw);
                const updated = existing.filter((r) => r.roomId !== roomId);
                await AsyncStorage.setItem(KHATM_ROOMS_KEY, JSON.stringify(updated));
              }
              await loadSavedCirclesAndRooms();
            }
          }
        ]
      );
    } catch (e) {
      setLoading(false);
      console.warn(e);
    }
  };

  const handleRemoveSavedCircle = async (circleId: string) => {
    try {
      setLoading(true);
      let isAdmin = false;
      
      if (isFirebaseEnabled && firestoreDb) {
        try {
          const docRef = doc(firestoreDb, 'dhikr_circles', circleId.toLowerCase());
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.createdBy === authState.user?.name) {
              isAdmin = true;
            }
          }
        } catch (e) {
          console.warn('Failed to check circle admin status:', e);
        }
      }
      
      setLoading(false);
      
      const confirmMsg = isAdmin
        ? 'Are you sure you want to delete this Dhikr circle? As the admin, this will delete the circle for all members and remove it from the cloud.'
        : 'Are you sure you want to leave this Dhikr circle?';
        
      Alert.alert(
        isAdmin ? 'Delete Circle (Admin)' : 'Leave Circle',
        confirmMsg,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: isAdmin ? 'Delete for Everyone' : 'Leave',
            style: 'destructive',
            onPress: async () => {
              try {
                if (isFirebaseEnabled) {
                  if (isAdmin) {
                    await sharingService.deleteDhikrCircle(circleId);
                  } else if (authState.user?.name) {
                    await sharingService.leaveDhikrCircle(circleId, authState.user.name);
                  }
                }
              } catch (err) {
                console.warn('Cloud sync leave/delete error:', err);
              }
              
              // Remove locally
              const raw = await AsyncStorage.getItem(CIRCLE_DHIKR_KEY);
              if (raw) {
                const existing: any[] = JSON.parse(raw);
                const updated = existing.filter((c) => c.circleId !== circleId);
                await AsyncStorage.setItem(CIRCLE_DHIKR_KEY, JSON.stringify(updated));
              }
              await loadSavedCirclesAndRooms();
            }
          }
        ]
      );
    } catch (e) {
      setLoading(false);
      console.warn(e);
    }
  };

  const handleJoinKhatmRoom = (forcedId?: string) => {
    const id = (forcedId || joinKhatmIdInput).trim().toLowerCase();
    if (!id) {
      Alert.alert('Error', 'Please enter a room code');
      return;
    }
    setActiveKhatmId(id);
    setJoinKhatmIdInput('');
    const unsub = sharingService.subscribeToKhatmRoom(id, async (room) => {
      if (room) {
        await saveKhatmRoomItem(room.roomId, room.name);
        unsub();
      }
    });
  };

  const handleClaimJuz = async (juzNum: number) => {
    if (!activeKhatmRoom || !authState.user?.name) return;
    try {
      await sharingService.reserveJuzSlot(activeKhatmRoom.roomId, juzNum, authState.user.name);
      // Auto-create bookmark folder for this Juz
      await bookmarkService.load();
      const folderName = `${activeKhatmRoom.name} – Juz ${juzNum}`;
      await bookmarkService.createCircleFolder(activeKhatmRoom.roomId + `_juz${juzNum}`, folderName, [juzNum]);
      Alert.alert('Juz Claimed! 📖', `Bookmark folder "${folderName}" created. Read from there!`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to claim Juz');
    }
  };

  // Navigate to the first ayah of a given Juz
  const handleReadJuz = (juzNum: number) => {
    navigation.navigate('Surah', { juzNumber: juzNum });
  };

  // Create circle bookmark folder for a full division (fixed mode)
  const handleAutoFolderForDivision = async (roomId: string, roomName: string, juzList: number[]) => {
    try {
      await bookmarkService.load();
      const firstJuz = juzList[0];
      const lastJuz = juzList[juzList.length - 1];
      const folderName = `${roomName} – Juz ${firstJuz}-${lastJuz}`;
      await bookmarkService.createCircleFolder(roomId, folderName, juzList);
    } catch (e) {
      console.warn('Failed to create circle bookmark folder:', e);
    }
  };

  const handleToggleJuzCompletion = async (juzNum: number, currentCompleted: boolean) => {
    if (!activeKhatmRoom || !authState.user?.name) return;
    try {
      await sharingService.updateJuzCompletion(
        activeKhatmRoom.roomId,
        juzNum,
        !currentCompleted,
        authState.user.name
      );
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update completion');
    }
  };

  // Dhikr Circle Handlers
  const handleCreateDhikrCircle = async () => {
    const name = circleNameInput.trim();
    const target = parseInt(circleTargetInput, 10);
    if (!name) {
      Alert.alert('Error', 'Please enter a circle name');
      return;
    }
    if (isNaN(target) || target <= 0) {
      Alert.alert('Error', 'Please enter a valid target count');
      return;
    }

    const selectedOption = PREDEFINED_DHIKR_OPTIONS[selectedDhikrIndex];
    let arabic = '';
    let translation = '';
    if (selectedOption.name === 'Custom Dhikr') {
      arabic = customArabicInput.trim();
      translation = customTranslationInput.trim();
      if (!arabic) {
        Alert.alert('Error', 'Please enter the Arabic text for your custom Dhikr');
        return;
      }
    } else {
      arabic = selectedOption.arabic;
      translation = selectedOption.translation;
    }

    const generatedId = `circle_${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const circle = await sharingService.createDhikrCircle(
        generatedId,
        name,
        target,
        arabic,
        translation,
        authState.user?.name || undefined
      );
      setActiveCircleId(circle.circleId);
      setCircleNameInput('');
      setCustomArabicInput('');
      setCustomTranslationInput('');
      // Save to DhikrScreen list
      await saveDhikrCircleItem(circle);
      Alert.alert('Success', `Dhikr Circle Created!\nCircle Code: ${circle.circleId.toUpperCase()}\n\nThe dhikr has been added to your Dhikr list in ∞ infinity mode.`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create circle');
    }
  };

  // Save circle dhikr to DhikrScreen's AsyncStorage list
  const saveDhikrCircleItem = async (circle: DhikrCircle) => {
    try {
      const raw = await AsyncStorage.getItem(CIRCLE_DHIKR_KEY);
      const existing: any[] = raw ? JSON.parse(raw) : [];
      // Avoid duplicates
      const alreadyExists = existing.some((c) => c.circleId === circle.circleId);
      if (!alreadyExists) {
        existing.push({
          circleId: circle.circleId,
          name: circle.name,
          createdAt: circle.createdAt,
          arabic: circle.arabic,
          translation: circle.translation,
        });
        await AsyncStorage.setItem(CIRCLE_DHIKR_KEY, JSON.stringify(existing));
      }
      await loadSavedCirclesAndRooms();
    } catch (e) {
      console.warn('Failed to save circle dhikr item:', e);
    }
  };

  const handleJoinDhikrCircle = async (forcedId?: string) => {
    const id = (forcedId || joinCircleIdInput).trim().toLowerCase();
    if (!id) {
      Alert.alert('Error', 'Please enter a circle code');
      return;
    }
    setActiveCircleId(id);
    setJoinCircleIdInput('');
    // Subscribe and save after we get the circle data
    const unsub = sharingService.subscribeToDhikrCircle(id, async (circle) => {
      if (circle) {
        await saveDhikrCircleItem(circle);
        unsub();
      }
    });
    Alert.alert('Joined Circle', 'The dhikr has been added to your Dhikr list in ∞ infinity mode.');
  };

  const handleCircleIncrement = async () => {
    if (!activeCircle || !authState.user?.name) return;
    const currentMemberCount = activeCircle.members[authState.user.name]?.count || 0;
    const newCount = currentMemberCount + 1;
    try {
      await sharingService.updateCircleCount(activeCircle.circleId, authState.user.name, newCount);
    } catch (err: any) {
      console.warn('Failed to update circle count:', err);
    }
  };

  // Auth Loading View
  if (authState.loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Not Authenticated View
  if (!authState.isAuthenticated) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: colors.background, paddingTop: insets.top + 30 },
        ]}
      >
        <View style={styles.authCard}>
          <View style={[styles.authIconCircle, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="people" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.authTitle, { color: colors.textPrimary }]}>Community Circles 🕌</Text>
          <Text style={[styles.authSubtitle, { color: colors.textSecondary }]}>
            Join fellow believers in real-time cooperative Khatms (Quran recitations) and communal Dhikr goals.
          </Text>

          <Pressable
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              styles.googleBtn,
              { borderColor: colors.border, opacity: pressed ? 0.8 : 1, marginTop: 12, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons name="logo-google" size={20} color={colors.primary} />
            <Text style={[styles.googleBtnText, { color: colors.textPrimary }]}>
              Sign In with Google
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // Calculate stats for Active Khatm
  const getKhatmProgress = () => {
    if (!activeKhatmRoom) return 0;
    const completedCount = Object.values(activeKhatmRoom.slots).filter((s) => s.completed).length;
    return Math.round((completedCount / 30) * 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {!isFirebaseEnabled && (
        <View style={{ backgroundColor: colors.error + '20', padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.error + '40' }}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.error} style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 13, color: colors.error, fontWeight: '600', fontFamily: FONTS.english }}>
            Offline Mode: Cloud Sync is disabled.
          </Text>
        </View>
      )}
      {/* Mini Profile Header */}
      <View style={[styles.profileHeader, { borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {authState.user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              {authState.user?.name}
            </Text>
            <Text style={[styles.profileSub, { color: colors.textMuted }]}>Circle Lounge</Text>
          </View>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface + '60', borderColor: colors.border }]}>
        <Pressable
          onPress={() => {
            setActiveTab('quran');
            setShowCreateJoinForm(false);
          }}
          style={[
            styles.tabItem,
            activeTab === 'quran' && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
          ]}
        >
          <Ionicons
            name="book"
            size={18}
            color={activeTab === 'quran' ? colors.primary : colors.textMuted}
          />
          <Text style={[styles.tabText, { color: activeTab === 'quran' ? colors.primary : colors.textMuted }]}>
            Quran Circle
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab('dhikr');
            setShowCreateJoinForm(false);
          }}
          style={[
            styles.tabItem,
            activeTab === 'dhikr' && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }
          ]}
        >
          <Ionicons
            name="heart"
            size={18}
            color={activeTab === 'dhikr' ? colors.primary : colors.textMuted}
          />
          <Text style={[styles.tabText, { color: activeTab === 'dhikr' ? colors.primary : colors.textMuted }]}>
            Dhikr Circle
          </Text>
        </Pressable>
      </View>

      {/* Quran Tab Content */}
      {activeTab === 'quran' ? (
        !activeKhatmRoom ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Saved Khatm Rooms List */}
            {savedKhatmRooms.length > 0 && (
              <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 16 }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Quran Circles 📖</Text>
                {savedKhatmRooms.map((room) => (
                  <View key={room.roomId} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border + '40' }}>
                    <Pressable style={{ flex: 1 }} onPress={() => setActiveKhatmId(room.roomId)}>
                      <Text style={{ fontWeight: 'bold', color: colors.textPrimary, fontSize: 14 }}>{room.name}</Text>
                      <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>Code: {room.roomId.toUpperCase()}</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemoveSavedKhatm(room.roomId)} style={{ padding: 6 }}>
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Toggle Button to Create/Join */}
            <Pressable 
              onPress={() => setShowCreateJoinForm(!showCreateJoinForm)} 
              style={[styles.btn, { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, marginBottom: 16 }]}
            >
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>
                {showCreateJoinForm ? 'Hide Create/Join Forms' : '+ Create or Join New Room'}
              </Text>
            </Pressable>

            {(showCreateJoinForm || savedKhatmRooms.length === 0) && (
              <>
                {/* Create Room */}
                <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Create Khatm Room 📖</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Choose between dynamic claiming or fixed member divisions to complete the Quran Khatm.
                  </Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="Room name (e.g. Ramadan Khatm)"
                    placeholderTextColor={colors.textMuted}
                    value={khatmRoomNameInput}
                    onChangeText={setKhatmRoomNameInput}
                  />

                  {/* Mode Select Buttons */}
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <Pressable
                      onPress={() => setKhatmMode('dynamic')}
                      style={[
                        styles.modeToggleBtn,
                        { borderColor: colors.border, backgroundColor: colors.background },
                        khatmMode === 'dynamic' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                      ]}
                    >
                      <Ionicons name="sparkles-outline" size={16} color={khatmMode === 'dynamic' ? colors.primary : colors.textSecondary} />
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: khatmMode === 'dynamic' ? colors.primary : colors.textSecondary }}>Dynamic Claim</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setKhatmMode('fixed')}
                      style={[
                        styles.modeToggleBtn,
                        { borderColor: colors.border, backgroundColor: colors.background },
                        khatmMode === 'fixed' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                      ]}
                    >
                      <Ionicons name="grid-outline" size={16} color={khatmMode === 'fixed' ? colors.primary : colors.textSecondary} />
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: khatmMode === 'fixed' ? colors.primary : colors.textSecondary }}>Fixed Division</Text>
                    </Pressable>
                  </View>

                  {khatmMode === 'fixed' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
                      <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>Number of members:</Text>
                      <TextInput
                        style={[styles.textInput, { width: 70, backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, textAlign: 'center' }]}
                        keyboardType="numeric"
                        value={khatmMemberCountInput}
                        onChangeText={setKhatmMemberCountInput}
                      />
                    </View>
                  ) : (
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8, fontStyle: 'italic' }}>
                      Dynamic Mode: Any circle member can claim any Juz slot individually. No member limit!
                    </Text>
                  )}

                  <Pressable
                    onPress={handleCreateKhatmRoom}
                    style={({ pressed }) => [
                      styles.btn,
                      { backgroundColor: colors.primary, marginTop: 12, opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <Text style={[styles.btnText, { color: colors.background }]}>Create Room</Text>
                  </Pressable>
                </View>

                {/* Join Room */}
                <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Join Khatm Circle 🚀</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Enter the room code or scan a QR code shared by your friend to claim your Juz slots.
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={[styles.textInput, { flex: 1, backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, marginBottom: 0 }]}
                      placeholder="e.g. khatm_123456"
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="none"
                      value={joinKhatmIdInput}
                      onChangeText={setJoinKhatmIdInput}
                    />
                    <Pressable
                      onPress={() => setQrScannerVisible(true)}
                      style={({ pressed }) => [
                        {
                          marginLeft: 8,
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: colors.surfaceLight,
                          borderColor: colors.border,
                          borderWidth: 1,
                          opacity: pressed ? 0.8 : 1,
                          height: 46,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }
                      ]}
                    >
                      <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleJoinKhatmRoom()}
                    style={({ pressed }) => [
                      styles.btn,
                      { backgroundColor: colors.primary, marginTop: 12, opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <Text style={[styles.btnText, { color: colors.background }]}>Join Room</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        ) : (
          /* Active Room View */
          <View style={{ flex: 1 }}>
            <View style={[styles.activeHeaderCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.activeTitle, { color: colors.textPrimary }]}>{activeKhatmRoom?.name}</Text>
                  <Text style={[styles.activeSubtitle, { color: colors.textMuted }]}>
                    Code: <Text style={{ fontWeight: 'bold', color: colors.primary }}>{activeKhatmRoom?.roomId?.toUpperCase()}</Text>
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable
                    onPress={() => setShowQrModal(true)}
                    style={({ pressed }) => [
                      {
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: colors.surfaceLight,
                        marginRight: 8,
                        opacity: pressed ? 0.8 : 1,
                      }
                    ]}
                  >
                    <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
                  </Pressable>
                  {activeKhatmRoom && (
                    <Pressable
                      onPress={async () => {
                        const roomId = activeKhatmRoom.roomId;
                        setActiveKhatmId(null);
                        await handleRemoveSavedKhatm(roomId);
                      }}
                      style={({ pressed }) => [
                        {
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: colors.error + '15',
                          marginRight: 8,
                          opacity: pressed ? 0.8 : 1,
                        }
                      ]}
                    >
                      <Ionicons
                        name={activeKhatmRoom.createdBy === authState.user?.name ? "trash-outline" : "log-out-outline"}
                        size={20}
                        color={colors.error}
                      />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => setActiveKhatmId(null)}
                    style={[styles.leaveBtn, { borderColor: colors.border }]}
                  >
                    <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>Leave View</Text>
                  </Pressable>
                </View>
              </View>

              {/* Progress Indicator */}
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 'bold' }}>Overall Khatm Progress</Text>
                  <Text style={{ fontSize: 12, color: colors.primary, fontWeight: 'bold' }}>{getKhatmProgress()}%</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${getKhatmProgress()}%` }]} />
                </View>
              </View>
            </View>

            {/* Slots List / Position Claims */}
            {(() => {
              if (!activeKhatmRoom) return null;
              const isFixed = activeKhatmRoom.mode === 'fixed';
              const hasClaimedDivision = Object.values(activeKhatmRoom.slots).some(
                (s) => s.reservedBy === authState.user?.name
              );

              if (isFixed && !hasClaimedDivision) {
                const divisionsList = Array.from({ length: activeKhatmRoom.memberCount }, (_, i) => {
                  const divisionJuz = getJuzDivisionForMember(i, activeKhatmRoom.memberCount);
                  const firstJuz = divisionJuz[0];
                  const lastJuz = divisionJuz[divisionJuz.length - 1];
                  const claimedBy = divisionJuz.map(j => activeKhatmRoom.slots[j]?.reservedBy).find(r => !!r);
                  return {
                    index: i,
                    label: `Position ${i + 1}`,
                    range: `Juz ${firstJuz} - Juz ${lastJuz}`,
                    claimedBy: claimedBy || null,
                  };
                });

                return (
                  <View style={{ flex: 1, padding: 16 }}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12, fontStyle: 'italic', fontFamily: FONTS.english }}>
                      Choose your reading position. All 30 Juz are pre-divided among the {activeKhatmRoom.memberCount} member slots:
                    </Text>
                    <FlatList
                      data={divisionsList}
                      keyExtractor={(item) => String(item.index)}
                      renderItem={({ item }) => {
                        const isClaimed = !!item.claimedBy;
                        const divisionJuz = getJuzDivisionForMember(item.index, activeKhatmRoom.memberCount);
                        return (
                          <View style={[styles.juzRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.juzNumText, { color: colors.textPrimary }]}>{item.label}</Text>
                              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{item.range}</Text>
                              {isClaimed && (
                                <Text style={{ fontSize: 11, color: colors.primary, fontWeight: 'bold', marginTop: 2 }}>
                                  Claimed by: {item.claimedBy}
                                </Text>
                              )}
                            </View>
                            <View style={{ gap: 6 }}>
                              {!isClaimed ? (
                                <Pressable
                                  onPress={async () => {
                                    if (!activeKhatmRoom || !authState.user?.name) return;
                                    try {
                                      await sharingService.claimMemberDivision(
                                        activeKhatmRoom.roomId,
                                        item.index,
                                        activeKhatmRoom.memberCount,
                                        authState.user.name
                                      );
                                      await handleAutoFolderForDivision(
                                        activeKhatmRoom.roomId,
                                        activeKhatmRoom.name,
                                        divisionJuz
                                      );
                                      Alert.alert('Position Claimed! 📖', `You claimed ${item.label}!\nA bookmark folder was created for your Juz range.`);
                                    } catch (err: any) {
                                      Alert.alert('Error', err?.message || 'Failed to claim position');
                                    }
                                  }}
                                  style={[styles.actionBtn, { borderColor: colors.primary, borderWidth: 1 }]}
                                >
                                  <Text style={[styles.actionBtnText, { color: colors.primary }]}>Claim</Text>
                                </Pressable>
                              ) : (
                                <>
                                  <Pressable
                                    onPress={() => handleReadJuz(divisionJuz[0])}
                                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                                  >
                                    <Ionicons name="book-outline" size={14} color={colors.background} />
                                    <Text style={[styles.actionBtnText, { color: colors.background }]}>Read</Text>
                                  </Pressable>
                                  <View style={[styles.badge, { backgroundColor: colors.border }]}>
                                    <Text style={[styles.badgeText, { color: colors.textMuted }]}>Reserved</Text>
                                  </View>
                                </>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />
                  </View>
                );
              }

              return (
                <FlatList
                  data={Array.from({ length: 30 }, (_, i) => i + 1)}
                  keyExtractor={(item) => String(item)}
                  contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                  renderItem={({ item: juzNum }) => {
                    const slot = activeKhatmRoom.slots[juzNum];
                    const isClaimedByMe = slot?.reservedBy === authState.user?.name;
                    const isClaimed = !!slot?.reservedBy;

                    return (
                      <View style={[styles.juzRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.juzNumText, { color: colors.textPrimary }]}>Juz {juzNum}</Text>
                          {isClaimed ? (
                            <Text style={[styles.juzClaimedText, { color: colors.textSecondary }]}>
                              Reserved by: <Text style={{ fontWeight: 'bold', color: isClaimedByMe ? colors.primary : colors.textPrimary }}>{slot.reservedBy}</Text>
                            </Text>
                          ) : (
                            <Text style={[styles.juzClaimedText, { color: colors.textMuted }]}>Available for reading</Text>
                          )}
                        </View>

                        {/* Claim/Read/Complete Buttons */}
                        <View style={{ gap: 6, alignItems: 'flex-end' }}>
                          {isClaimedByMe ? (
                            <>
                              {/* Read button: navigate to Juz */}
                              {!slot.completed && (
                                <Pressable
                                  onPress={() => handleReadJuz(juzNum)}
                                  style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                                >
                                  <Ionicons name="book-outline" size={14} color={colors.background} />
                                  <Text style={[styles.actionBtnText, { color: colors.background }]}>Read</Text>
                                </Pressable>
                              )}
                              {/* Mark Done button */}
                              <Pressable
                                onPress={() => handleToggleJuzCompletion(juzNum, slot.completed)}
                                style={[
                                  styles.actionBtn,
                                  { backgroundColor: slot.completed ? '#10B981' : 'transparent', borderColor: slot.completed ? '#10B981' : colors.primary, borderWidth: 1 },
                                ]}
                              >
                                <Ionicons
                                  name={slot.completed ? 'checkmark-circle' : 'ellipse-outline'}
                                  size={16}
                                  color={slot.completed ? colors.background : colors.primary}
                                />
                                <Text style={[styles.actionBtnText, { color: slot.completed ? colors.background : colors.primary }]}>
                                  {slot.completed ? 'Done ✓' : 'Mark Done'}
                                </Text>
                              </Pressable>
                            </>
                          ) : isClaimed ? (
                            <View style={[styles.badge, { backgroundColor: colors.border }]}>
                              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                                {slot.completed ? 'Completed' : 'Reading'}
                              </Text>
                            </View>
                          ) : (
                            <Pressable
                              onPress={() => handleClaimJuz(juzNum)}
                              style={[styles.actionBtn, { borderColor: colors.primary, borderWidth: 1 }]}
                            >
                              <Text style={[styles.actionBtnText, { color: colors.primary }]}>Claim</Text>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    );
                  }}
                />
              );
            })()}
          </View>
        )
      ) : (
        /* Dhikr Tab Content */
        !activeCircle ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Saved Dhikr Circles List */}
            {savedDhikrCircles.length > 0 && (
              <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 16 }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Dhikr Circles 📿</Text>
                {savedDhikrCircles.map((circle) => (
                  <View key={circle.circleId} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border + '40' }}>
                    <Pressable style={{ flex: 1 }} onPress={() => setActiveCircleId(circle.circleId)}>
                      <Text style={{ fontWeight: 'bold', color: colors.textPrimary, fontSize: 14 }}>{circle.name}</Text>
                      <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>Code: {circle.circleId.toUpperCase()}</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRemoveSavedCircle(circle.circleId)} style={{ padding: 6 }}>
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Toggle Button to Create/Join */}
            <Pressable 
              onPress={() => setShowCreateJoinForm(!showCreateJoinForm)} 
              style={[styles.btn, { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, marginBottom: 16 }]}
            >
              <Text style={[styles.btnText, { color: colors.textPrimary }]}>
                {showCreateJoinForm ? 'Hide Create/Join Forms' : '+ Create or Join New Circle'}
              </Text>
            </Pressable>

            {(showCreateJoinForm || savedDhikrCircles.length === 0) && (
              <>
                {/* Create Dhikr Circle */}
                <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Create Dhikr Circle 📿</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Start a communal target counter. All members contribute to the total sum in real-time.
                  </Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                    placeholder="Circle Name (e.g. Istighfar 10K)"
                    placeholderTextColor={colors.textMuted}
                    value={circleNameInput}
                    onChangeText={setCircleNameInput}
                  />

                  {/* Predefined Dhikr Selector */}
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginTop: 12, marginBottom: 6 }}>Select Dhikr to recite:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {PREDEFINED_DHIKR_OPTIONS.map((opt, idx) => (
                      <Pressable
                        key={opt.name}
                        onPress={() => setSelectedDhikrIndex(idx)}
                        style={[
                          styles.modeToggleBtn,
                          { flex: 0, paddingHorizontal: 12, height: 32, borderColor: colors.border, backgroundColor: colors.background },
                          selectedDhikrIndex === idx && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                        ]}
                      >
                        <Text style={{ fontSize: 11, fontWeight: 'bold', color: selectedDhikrIndex === idx ? colors.primary : colors.textSecondary }}>
                          {opt.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {PREDEFINED_DHIKR_OPTIONS[selectedDhikrIndex].name === 'Custom Dhikr' && (
                    <View style={{ gap: 8, marginBottom: 12 }}>
                      <TextInput
                        style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="Arabic (e.g. سُبْحَانَ ٱللَّٰهِ)"
                        placeholderTextColor={colors.textMuted}
                        value={customArabicInput}
                        onChangeText={setCustomArabicInput}
                      />
                      <TextInput
                        style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                        placeholder="Translation (e.g. Glory be to Allah)"
                        placeholderTextColor={colors.textMuted}
                        value={customTranslationInput}
                        onChangeText={setCustomTranslationInput}
                      />
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>communal target count:</Text>
                    <TextInput
                      style={[styles.textInput, { width: 100, backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, textAlign: 'center' }]}
                      keyboardType="numeric"
                      value={circleTargetInput}
                      onChangeText={setCircleTargetInput}
                    />
                  </View>
                  <Pressable
                    onPress={handleCreateDhikrCircle}
                    style={({ pressed }) => [
                      styles.btn,
                      { backgroundColor: colors.primary, marginTop: 12, opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <Text style={[styles.btnText, { color: colors.background }]}>Create Circle</Text>
                  </Pressable>
                </View>

                {/* Join Dhikr Circle */}
                <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Join Dhikr Circle 🚀</Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Enter the circle code or scan a QR code to connect and count together.
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={[styles.textInput, { flex: 1, backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, marginBottom: 0 }]}
                      placeholder="e.g. circle_123456"
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="none"
                      value={joinCircleIdInput}
                      onChangeText={setJoinCircleIdInput}
                    />
                    <Pressable
                      onPress={() => setQrScannerVisible(true)}
                      style={({ pressed }) => [
                        {
                          marginLeft: 8,
                          padding: 12,
                          borderRadius: 8,
                          backgroundColor: colors.surfaceLight,
                          borderColor: colors.border,
                          borderWidth: 1,
                          opacity: pressed ? 0.8 : 1,
                          height: 46,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }
                      ]}
                    >
                      <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleJoinDhikrCircle()}
                    style={({ pressed }) => [
                      styles.btn,
                      { backgroundColor: colors.primary, marginTop: 12, opacity: pressed ? 0.9 : 1 },
                    ]}
                  >
                    <Text style={[styles.btnText, { color: colors.background }]}>Join Circle</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        ) : (
          /* Active Dhikr Circle View */
          <View style={{ flex: 1 }}>
            <View style={[styles.activeHeaderCard, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.activeTitle, { color: colors.textPrimary }]}>{activeCircle?.name}</Text>
                  <Text style={[styles.activeSubtitle, { color: colors.textMuted }]}>
                    Circle Code: <Text style={{ fontWeight: 'bold', color: colors.primary }}>{activeCircle?.circleId?.toUpperCase()}</Text>
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Pressable
                    onPress={() => setShowQrModal(true)}
                    style={({ pressed }) => [
                      {
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: colors.surfaceLight,
                        marginRight: 8,
                        opacity: pressed ? 0.8 : 1,
                      }
                    ]}
                  >
                    <Ionicons name="qr-code-outline" size={20} color={colors.primary} />
                  </Pressable>
                  {activeCircle && (
                    <Pressable
                      onPress={async () => {
                        const circleId = activeCircle.circleId;
                        setActiveCircleId(null);
                        await handleRemoveSavedCircle(circleId);
                      }}
                      style={({ pressed }) => [
                        {
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: colors.error + '15',
                          marginRight: 8,
                          opacity: pressed ? 0.8 : 1,
                        }
                      ]}
                    >
                      <Ionicons
                        name={activeCircle.createdBy === authState.user?.name ? "trash-outline" : "log-out-outline"}
                        size={20}
                        color={colors.error}
                      />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => setActiveCircleId(null)}
                    style={[styles.leaveBtn, { borderColor: colors.border }]}
                  >
                    <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' }}>Leave View</Text>
                  </Pressable>
                </View>
              </View>

              {/* Progress Tracker */}
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ fontSize: 42, fontWeight: '900', color: colors.primary }}>
                  {activeCircle?.totalCount}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 'bold' }}>
                  {activeCircle?.targetCount === 0 ? 'Unlimited Target' : `Total of ${activeCircle?.targetCount} Target`}
                </Text>
              </View>
            </View>

            {/* Guide to participation */}
            <View style={{ padding: 16, alignItems: 'center', backgroundColor: colors.surface + '80', borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={{ marginBottom: 4 }} />
              <Text style={{ fontSize: 13, textAlign: 'center', color: colors.textSecondary, lineHeight: 18, fontFamily: FONTS.english }}>
                To count and contribute, go back to the main <Text style={{ fontWeight: 'bold', color: colors.primary }}>Dhikr</Text> screen and select <Text style={{ fontWeight: 'bold' }}>{activeCircle?.name}</Text> from your list.
              </Text>
              {activeCircle?.arabic ? (
                <View style={{ marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: colors.background, alignItems: 'center', width: '100%' }}>
                  <Text style={{ fontSize: 18, color: colors.textPrimary, fontFamily: FONTS.arabic }}>{activeCircle.arabic}</Text>
                  {activeCircle.translation ? (
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>{activeCircle.translation}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            {/* Leaderboard/Member List - Expanded */}
            <View style={{ flex: 1, backgroundColor: colors.surface }}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.textSecondary }}>Circle Members Leaderboard</Text>
              </View>
              <FlatList
                data={Object.values(activeCircle?.members || {}).sort((a, b) => b.count - a.count)}
                keyExtractor={(item) => item.username}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border + '30' }}>
                    <Text style={{ fontSize: 14, color: colors.textPrimary }}>
                      {index + 1}. <Text style={{ fontWeight: 'bold' }}>{item.username}</Text> {item.username === authState.user?.name && '(You)'}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary }}>{item.count} reps</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )
      )}

      {/* QR scanner for Circles & Rooms */}
      <QRScannerModal
        visible={qrScannerVisible}
        onClose={() => setQrScannerVisible(false)}
        expectedType={activeTab === 'quran' ? 'khatm' : 'circle'}
        onScanSuccess={async (id, type) => {
          setQrScannerVisible(false);
          if (type === 'circle') {
            await handleJoinDhikrCircle(id);
          } else if (type === 'khatm') {
            handleJoinKhatmRoom(id);
          } else {
            Alert.alert('Invalid QR Code', 'This QR Code is not valid for the current tab.');
          }
        }}
      />

      {/* Share QR Code Modal */}
      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.surface, padding: 24, borderRadius: 16, width: '100%', maxWidth: 340, alignItems: 'center', borderColor: colors.border, borderWidth: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4, textAlign: 'center', fontFamily: FONTS.english }}>
              {activeTab === 'quran' ? 'Share Khatm QR' : 'Share Circle QR'}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 20, textAlign: 'center', fontFamily: FONTS.english }}>
              Scan this code to join "{activeTab === 'quran' ? activeKhatmRoom?.name : activeCircle?.name}"
            </Text>
            
            {activeTab === 'quran' ? (
              activeKhatmRoom?.roomId && (
                <View style={{ padding: 12, backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 20 }}>
                  <Image
                    source={{ uri: getQRCodeUrl(buildKhatmUri(activeKhatmRoom.roomId)) }}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                  />
                </View>
              )
            ) : (
              activeCircle?.circleId && (
                <View style={{ padding: 12, backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 20 }}>
                  <Image
                    source={{ uri: getQRCodeUrl(buildCircleUri(activeCircle.circleId)) }}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                  />
                </View>
              )
            )}

            <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 20, textAlign: 'center', fontFamily: FONTS.english }}>
              Code: {activeTab === 'quran' ? activeKhatmRoom?.roomId?.toUpperCase() : activeCircle?.circleId?.toUpperCase()}
            </Text>

            <Pressable
              onPress={() => setShowQrModal(false)}
              style={{ backgroundColor: colors.primary, width: '100%', padding: 12, borderRadius: 8, alignItems: 'center' }}
            >
              <Text style={{ color: colors.background, fontWeight: 'bold', fontSize: 15, fontFamily: FONTS.english }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
