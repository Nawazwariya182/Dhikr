import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Vibration,
  FlatList,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleAuthService } from '../services/googleAuthService';
import { sharingService, DhikrCircle } from '../services/sharingService';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { TasbihCounterWidget } from '../widgets/components/TasbihCounterWidget';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { useSpiritualTimeTracker } from '../utils/useSpiritualTimeTracker';
import { FONTS } from '../utils/constants';

interface DhikrItem {
  id: string;
  arabic: string;
  translation: string;
  count: number;
  target: number; // 33, 99, 100, 0 (unlimited/infinity)
  isCustom?: boolean;
  isCircle?: boolean;   // Circle dhikr – always infinity mode
  circleId?: string;    // Links to a DhikrCircle session
}

const PREDEFINED_DHIKR: DhikrItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    translation: 'Glory be to Allah',
    count: 0,
    target: 33,
  },
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    translation: 'Praise be to Allah',
    count: 0,
    target: 33,
  },
  {
    id: 'allahuakbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    count: 0,
    target: 34,
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    translation: 'I seek forgiveness from Allah',
    count: 0,
    target: 100,
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    translation: 'There is no deity but Allah',
    count: 0,
    target: 100,
  },
  {
    id: 'subhanallah_bihamdihi',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    translation: 'Glory be to Allah and Praise is due to Him',
    count: 0,
    target: 100,
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ',
    translation: 'There is no power or strength except with Allah',
    count: 0,
    target: 100,
  },
  {
    id: 'hasbunallah',
    arabic: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ',
    translation: 'Allah is sufficient for us, and He is the best Disposer of affairs',
    count: 0,
    target: 100,
  },
  {
    id: 'salawat',
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    translation: 'O Allah, send blessings upon Muhammad',
    count: 0,
    target: 100,
  },
];

interface DuroodPreset {
  id: string;
  arabic: string;
  translation: string;
}

const DUROOD_PRESETS: DuroodPreset[] = [
  {
    id: 'default',
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ',
    translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad',
  },
  {
    id: 'short',
    arabic: 'صَلَّىٰ ٱللَّٰهُ عَلَيْهِ وَسَلَّمَ',
    translation: 'May Allah send blessings and peace upon him',
  },
  {
    id: 'ibrahim',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim...',
  },
  {
    id: 'shafii',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ كُلَّمَا ذَكَرَهُ الذَّاكِرُونَ وَكُلَّمَا غَفَلَ عَنْ ذِكْرِهِ الْغَافِلُونَ',
    translation: 'O Allah, send blessings upon Muhammad whenever those who remember him mention him, and whenever those who are heedless forget...',
  },
];

interface MoodDhikrOption {
  arabic: string;
  translation: string;
  target: number;
}

interface MoodItem {
  id: string;
  emoji: string;
  label: string;
  description: string;
  dhikrs: MoodDhikrOption[];
}

const MOODS: MoodItem[] = [
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Anxious',
    description: 'Find calmness and absolute trust in Allah\'s divine plan.',
    dhikrs: [
      { arabic: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ', translation: 'Allah is sufficient for us, and He is the best Disposer of affairs', target: 100 },
      { arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', target: 100 },
      { arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', translation: 'O Living, O Sustainer, by Your mercy I seek aid', target: 33 },
      { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', translation: 'There is no power or strength except with Allah', target: 33 },
      { arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', translation: 'I seek forgiveness from Allah', target: 100 },
    ],
  },
  {
    id: 'grateful',
    emoji: '🤲',
    label: 'Grateful',
    description: 'Express abundance of gratitude for Allah\'s countless blessings.',
    dhikrs: [
      { arabic: 'ٱلْحَمْدُ لِلَّٰهِ', translation: 'Praise be to Allah', target: 33 },
      { arabic: 'شُكْرًا لِلَّٰهِ', translation: 'Thanks be to Allah', target: 33 },
      { arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ', translation: 'Glory be to Allah and Praise is due to Him', target: 100 },
      { arabic: 'سُبْحَانَ ٱللَّٰهِ ٱلْعَظِيمِ', translation: 'Glory be to Allah, the Magnificent', target: 100 },
      { arabic: 'ٱللَّٰهُمَّ لَكَ ٱلْحَمْدُ وَلَكَ ٱلشُّكْرُ', translation: 'O Allah, to You belongs praise and thanks', target: 33 },
    ],
  },
  {
    id: 'grieving',
    emoji: '😢',
    label: 'Grieving',
    description: 'Seek comfort and patience in times of loss and sorrow.',
    dhikrs: [
      { arabic: 'إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', translation: 'Indeed, to Allah we belong and to Him we return', target: 33 },
      { arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّهُ', translation: 'There is no deity but Allah', target: 100 },
      { arabic: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ', translation: 'Allah is sufficient for us, and He is the best Disposer of affairs', target: 100 },
      { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', translation: 'There is no power or strength except with Allah', target: 33 },
      { arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', translation: 'O Allah, send blessings upon Muhammad', target: 100 },
    ],
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Tired',
    description: 'Reinvigorate your energy and seek divine support.',
    dhikrs: [
      { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', translation: 'There is no power or strength except with Allah', target: 33 },
      { arabic: 'سُبْحَانَ ٱللَّٰهِ', translation: 'Glory be to Allah', target: 33 },
      { arabic: 'ٱلْحَمْدُ لِلَّٰهِ', translation: 'Praise be to Allah', target: 33 },
      { arabic: 'ٱللَّٰهُ أَكْبَرُ', translation: 'Allah is the Greatest', target: 34 },
      { arabic: 'يَا قَوِيُّ قَوِّنِي', translation: 'O Mighty, strengthen me', target: 33 },
    ],
  },
  {
    id: 'stressed',
    emoji: '🤯',
    label: 'Stressed',
    description: 'Relieve pressure and find inner peace in remembrance.',
    dhikrs: [
      { arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: 'Verily, in the remembrance of Allah do hearts find rest', target: 33 },
      { arabic: 'يَا صَبُورُ', translation: 'O Patient One', target: 100 },
      { arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', target: 100 },
      { arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ', translation: 'I seek forgiveness from Allah the Magnificent', target: 100 },
      { arabic: 'يَا لَطِيفُ', translation: 'O Gentle / Subtly Kind One', target: 129 },
    ],
  },
  {
    id: 'lonely',
    emoji: '😔',
    label: 'Lonely',
    description: 'Connect with the divine friend who is closer than your jugular vein.',
    dhikrs: [
      { arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ', translation: 'And He is with you wherever you are', target: 33 },
      { arabic: 'إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ', translation: 'Indeed, my Lord is near and responsive', target: 33 },
      { arabic: 'يَا وَدُودُ', translation: 'O Loving One', target: 100 },
      { arabic: 'يَا مُؤْنِسَ كُلِّ وَحِيدٍ', translation: 'O Companion of every lonely one', target: 33 },
      { arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', translation: 'There is no deity but Allah', target: 100 },
    ],
  },
  {
    id: 'angry',
    emoji: '😡',
    label: 'Angry',
    description: 'Cool down your emotions and seek refuge from whisperings.',
    dhikrs: [
      { arabic: 'أَعُوذُ بِٱللَّٰهِ مِنَ ٱلشَّيْطَانِ ٱلرَّجِيمِ', translation: 'I seek refuge in Allah from Satan the rejected', target: 10 },
      { arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', translation: 'I seek forgiveness from Allah', target: 100 },
      { arabic: 'يَا حَلِيمُ', translation: 'O Forbearing One', target: 100 },
      { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ', translation: 'There is no power or strength except with Allah', target: 33 },
      { arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', translation: 'O Allah, send blessings upon Muhammad', target: 33 },
    ],
  },
  {
    id: 'ill',
    emoji: '🤒',
    label: 'Weak or Ill',
    description: 'Ask the healer of all creation for complete health and strength.',
    dhikrs: [
      { arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ', translation: 'Indeed, adversity has touched me, and You are the most merciful of the merciful', target: 33 },
      { arabic: 'يَا شَافِي', translation: 'O Healer', target: 100 },
      { arabic: 'بِسْمِ ٱللَّٰهِ ٱلْكَافِي', translation: 'In the name of Allah the Sufficient', target: 33 },
      { arabic: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ ٱللَّٰهُ', translation: 'No harm, a purification if Allah wills', target: 7 },
      { arabic: 'يَا قَوِيُّ', translation: 'O Strong One', target: 100 },
    ],
  },
  {
    id: 'hopeful',
    emoji: '🌱',
    label: 'Hopeful',
    description: 'Ask for guidance, consistency, and a blessed future.',
    dhikrs: [
      { arabic: 'رَبِّ زِدْنِي عِلْمًا', translation: 'My Lord, increase me in knowledge', target: 33 },
      { arabic: 'يَا مُقَلِّبَ ٱلْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ', translation: 'O Turner of hearts, keep my heart firm on Your religion', target: 33 },
      { arabic: 'ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَالَمِينَ', translation: 'Praise be to Allah, Lord of the Worlds', target: 33 },
      { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease', target: 33 },
      { arabic: 'يَا فَتَّاحُ', translation: 'O Opener / Giver of victory', target: 100 },
    ],
  },
];

export const DhikrScreen: React.FC = () => {
  useSpiritualTimeTracker('Remembrance');
  const navigation = useNavigation<any>();
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const [dhikrList, setDhikrList] = useState<DhikrItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('subhanallah');
  
  // Modals visibility state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [targetSheetVisible, setTargetSheetVisible] = useState(false);

  // Edit count states
  const [editCountModalVisible, setEditCountModalVisible] = useState(false);
  const [editCountTargetId, setEditCountTargetId] = useState<string>('');
  const [editCountInput, setEditCountInput] = useState('');

  // Mood selector states
  const [moodSheetVisible, setMoodSheetVisible] = useState(false);
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [activeMoodQueue, setActiveMoodQueue] = useState<DhikrItem[] | null>(null);
  const [preMoodSelectedId, setPreMoodSelectedId] = useState<string>('subhanallah');

  // Salawat counter states
  const [salawatModalVisible, setSalawatModalVisible] = useState(false);
  const [salawatCount, setSalawatCount] = useState(0);
  const [salawatTarget, setSalawatTarget] = useState(100);
  const [showSalawatTargetInput, setShowSalawatTargetInput] = useState(false);
  const [customSalawatTargetInput, setCustomSalawatTargetInput] = useState('');

  // Durood custom list and selection states
  const [duroodList, setDuroodList] = useState<DuroodPreset[]>([]);
  const [selectedDuroodId, setSelectedDuroodId] = useState<string>('default');
  const [duroodSelectorVisible, setDuroodSelectorVisible] = useState(false);
  const [customDuroodArabic, setCustomDuroodArabic] = useState('');
  const [customDuroodTranslation, setCustomDuroodTranslation] = useState('');

  // Speed tracker states
  const lastTapTime = useRef<number>(0);
  const [speedWarning, setSpeedWarning] = useState(false);
  const speedWarningTimeout = useRef<any>(null);
  
  // Custom dialog confirmations state
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [targetId, setTargetId] = useState<string>('');

  // Custom toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Custom Dhikr creation fields
  const [newArabic, setNewArabic] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newTarget, setNewTarget] = useState('33');
  const [validationError, setValidationError] = useState('');
  
  // Custom Target fields
  const [customTargetInput, setCustomTargetInput] = useState('');
  const [showCustomTargetInput, setShowCustomTargetInput] = useState(false);
  const [targetSheetError, setTargetSheetError] = useState('');
  
  // Preferences
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Animated values for active tap ripple
  const tapScale = useRef(new Animated.Value(1)).current;
  const tapOpacity = useRef(new Animated.Value(0)).current;

  // Animated values for continuous idle breathing ripple
  const idleScale = useRef(new Animated.Value(1)).current;
  const idleOpacity = useRef(new Animated.Value(0.12)).current;

  // Active Dhikr Item
  const activeDhikr = activeMoodQueue
    ? (activeMoodQueue.find((item) => item.id === selectedId) || activeMoodQueue[0])
    : (dhikrList.find((item) => item.id === selectedId) || dhikrList[0]);

  const isCircleTargetCompleted = !!(activeDhikr && activeDhikr.isCircle && activeDhikr.target > 0 && activeDhikr.count >= activeDhikr.target);

  // Active Durood Item
  const activeDurood = duroodList.find((item) => item.id === selectedDuroodId) || duroodList[0] || DUROOD_PRESETS[0];

  // Start continuous idle breathing ripple animation loop
  useEffect(() => {
    const startIdleLoop = () => {
      idleScale.setValue(1);
      idleOpacity.setValue(0.12);

      Animated.loop(
        Animated.parallel([
          Animated.timing(idleScale, {
            toValue: 1.65,
            duration: 2600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(idleOpacity, {
            toValue: 0,
            duration: 2600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startIdleLoop();
  }, []);

  // Real-time subscription to selected Dhikr Circle
  const [activeCircleData, setActiveCircleData] = useState<DhikrCircle | null>(null);

  useEffect(() => {
    if (!activeDhikr || !activeDhikr.isCircle || !activeDhikr.circleId) {
      setActiveCircleData(null);
      return;
    }
    const unsub = sharingService.subscribeToDhikrCircle(activeDhikr.circleId, (circle) => {
      setActiveCircleData(circle);
      if (circle) {
        // Sync the total count and target to the active dhikr count state so it is visible in the giant bubble
        setDhikrList((prevList) =>
          prevList.map((item) => {
            if (item.id === activeDhikr.id) {
              return { ...item, count: circle.totalCount, target: circle.targetCount };
            }
            return item;
          })
        );
      }
    });
    return unsub;
  }, [activeDhikr?.id]);

  // Load list on focus
  useFocusEffect(
    useCallback(() => {
      // Cleanly reset guided mood session when returning/loading to prevent state glitches
      setActiveMoodQueue(null);

      const loadDhikrData = async () => {
        try {
          const storedList = await AsyncStorage.getItem('@dhikr_app_list_v1');
          const storedVibration = await AsyncStorage.getItem('@dhikr_vibration_enabled');
          const storedIndex = await AsyncStorage.getItem('@dhikr_widget_tasbih_index');
          
          if (storedVibration !== null) {
            setVibrationEnabled(storedVibration === 'true');
          }

          let currentList: DhikrItem[] = PREDEFINED_DHIKR;
          if (storedList !== null) {
            currentList = JSON.parse(storedList);
          }

          // Load circle dhikr items and merge at the top
          const circleRaw = await AsyncStorage.getItem('@dhikr_circle_items');
          if (circleRaw) {
            const circles: { circleId: string; name: string; createdAt: number; arabic?: string; translation?: string }[] = JSON.parse(circleRaw);
            for (const circle of circles) {
              const circleItemId = `circle_dhikr_${circle.circleId}`;
              // Only add if not already in the list
              const alreadyInList = currentList.some((item) => item.id === circleItemId);
              if (!alreadyInList) {
                currentList = [{
                  id: circleItemId,
                  arabic: circle.arabic ? circle.arabic : '📿 ' + circle.name,
                  translation: circle.translation ? circle.translation : `Community Circle: ${circle.name}`,
                  count: 0,
                  target: 0, // infinity
                  isCircle: true,
                  circleId: circle.circleId,
                }, ...currentList];
              }
            }
          }

          setDhikrList(currentList);

          if (storedIndex !== null && currentList.length > 0) {
            const idx = Number(storedIndex) % currentList.length;
            if (idx >= 0 && idx < currentList.length) {
              setSelectedId(currentList[idx].id);
            }
          }

          // Load Salawat sub-tracker state
          const storedSalawatCount = await AsyncStorage.getItem('@dhikr_salawat_count');
          const storedSalawatTarget = await AsyncStorage.getItem('@dhikr_salawat_target');
          if (storedSalawatCount !== null) {
            setSalawatCount(Number(storedSalawatCount));
          } else {
            setSalawatCount(0);
          }
          if (storedSalawatTarget !== null) {
            setSalawatTarget(Number(storedSalawatTarget));
          } else {
            const isFriday = new Date().getDay() === 5;
            setSalawatTarget(isFriday ? 1000 : 100);
          }

          // Load Durood presets / custom list
          const storedDuroodList = await AsyncStorage.getItem('@dhikr_durood_list');
          const storedSelectedDuroodId = await AsyncStorage.getItem('@dhikr_selected_durood_id');
          if (storedDuroodList !== null) {
            setDuroodList(JSON.parse(storedDuroodList));
          } else {
            setDuroodList(DUROOD_PRESETS);
          }
          if (storedSelectedDuroodId !== null) {
            setSelectedDuroodId(storedSelectedDuroodId);
          } else {
            setSelectedDuroodId('default');
          }
        } catch (error) {
          console.error('Failed to load Dhikr list:', error);
          setDhikrList(PREDEFINED_DHIKR);
        }
      };
      loadDhikrData();
    }, [])
  );

  // Auto-dismiss toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Synchronize active item and count changes to Android Widget
  useEffect(() => {
    if (dhikrList.length === 0) return;
    const index = dhikrList.findIndex(item => item.id === selectedId);
    if (index >= 0) {
      const active = dhikrList[index];
      if (active.isCircle) return; // Do not update the Android Tasbih Counter Widget for circle dhikrs
      AsyncStorage.setItem('@dhikr_widget_tasbih_index', String(index)).then(() => {
        try {
          requestWidgetUpdate({
            widgetName: 'TasbihCounter',
            renderWidget: () => (
              <TasbihCounterWidget
                phrase={active.arabic || ''}
                phraseTranslation={active.translation || ''}
                count={active.count || 0}
                target={active.target || 100}
              />
            ),
          });
        } catch (err) {
          console.warn('Error updating Tasbih widget:', err);
        }
      });
    }
  }, [selectedId, dhikrList]);

  const saveDhikrList = async (updatedList: DhikrItem[]) => {
    try {
      // Don't persist circle items to @dhikr_app_list_v1 — they're loaded fresh each time
      const persistList = updatedList.filter((item) => !item.isCircle);
      await AsyncStorage.setItem('@dhikr_app_list_v1', JSON.stringify(persistList));
      setDhikrList(updatedList);
    } catch (error) {
      console.error('Failed to save Dhikr list:', error);
      setDhikrList(updatedList);
    }
  };

  const removeCircleDhikr = async (circleId: string) => {
    try {
      // Remove from the circle items registry
      const raw = await AsyncStorage.getItem('@dhikr_circle_items');
      if (raw) {
        const circles: any[] = JSON.parse(raw);
        const updated = circles.filter((c) => c.circleId !== circleId);
        await AsyncStorage.setItem('@dhikr_circle_items', JSON.stringify(updated));
      }
      // Remove from current dhikr list
      const updatedList = dhikrList.filter((item) => item.circleId !== circleId);
      setDhikrList(updatedList);
      setToastMessage('Circle dhikr removed. Blessings completed! 🎉');
      setShowToast(true);
    } catch (e) {
      console.warn('Failed to remove circle dhikr:', e);
    }
  };

  const toggleVibration = async () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    try {
      await AsyncStorage.setItem('@dhikr_vibration_enabled', String(newValue));
    } catch (e) {
      console.warn(e);
    }
  };

  // Save Count Handler (Direct Count Modifier)
  const handleSaveCount = () => {
    const newVal = parseInt(editCountInput, 10);
    if (isNaN(newVal) || newVal < 0) return;
    const updatedList = dhikrList.map((item) => {
      if (item.id === editCountTargetId) {
        return { ...item, count: newVal };
      }
      return item;
    });
    saveDhikrList(updatedList);
    setEditCountModalVisible(false);
    setToastMessage("Dhikr counter set successfully! 🌟");
    setShowToast(true);
  };

  // Salawat Tracker Handlers
  const handleIncrementSalawat = async () => {
    if (salawatTarget > 0 && salawatCount >= salawatTarget) {
      setToastMessage(`Salawat Target Completed! 🎉`);
      setShowToast(true);
      return;
    }

    const nextCount = salawatCount + 1;
    setSalawatCount(nextCount);
    await AsyncStorage.setItem('@dhikr_salawat_count', String(nextCount));

    if (vibrationEnabled) {
      if (nextCount === salawatTarget) {
        Vibration.vibrate([0, 120, 80, 180]);
      } else {
        Vibration.vibrate(60);
      }
    }

    if (nextCount === salawatTarget) {
      setToastMessage(`Salawat Target Completed! 🎉 Sent ${salawatTarget} blessings.`);
      setShowToast(true);
    }
  };

  const handleResetSalawat = async () => {
    setSalawatCount(0);
    await AsyncStorage.setItem('@dhikr_salawat_count', '0');
  };

  const handleSetSalawatTarget = async (newVal: number) => {
    setSalawatTarget(newVal);
    await AsyncStorage.setItem('@dhikr_salawat_target', String(newVal));
  };

  // Mood Selector Suggestion Handler
  const handleSelectSuggestedDhikr = (suggested: MoodDhikrOption) => {
    const existing = dhikrList.find(
      (item) => item.arabic.trim() === suggested.arabic.trim()
    );

    setActiveMoodQueue(null); // Cancel/Exit any active mood queue journey
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const newItem: DhikrItem = {
        id: `suggested_${Date.now()}`,
        arabic: suggested.arabic,
        translation: suggested.translation,
        count: 0,
        target: suggested.target,
        isCustom: true,
      };
      const updatedList = [...dhikrList, newItem];
      saveDhikrList(updatedList);
      setSelectedId(newItem.id);
    }

    setMoodSheetVisible(false);
    setSelectedMoodId(null);
    setToastMessage("Recommended Supplication Selected! 🌟");
    setShowToast(true);
  };

  const handleStartMoodJourney = (mood: MoodItem) => {
    // Save current selection to restore later
    setPreMoodSelectedId(selectedId);
    
    // Build the queue
    const queue: DhikrItem[] = mood.dhikrs.map((d, index) => ({
      id: `mood_queue_${index}_${Date.now()}`,
      arabic: d.arabic,
      translation: d.translation,
      count: 0,
      target: d.target,
      isCustom: false,
    }));
    
    setActiveMoodQueue(queue);
    setSelectedId(queue[0].id);
    setMoodSheetVisible(false);
    setSelectedMoodId(null);
    
    setToastMessage(`Starting Guided Remembrance for ${mood.label}! 🌟`);
    setShowToast(true);
  };

  // Increment handler triggering fast tap ripple
  const handleIncrement = () => {
    if (!activeDhikr) return;

    // Turn off counting if circle target is completed
    if (activeDhikr.isCircle && activeDhikr.target > 0 && activeDhikr.count >= activeDhikr.target) {
      setToastMessage(`Communal target completed! 🎉`);
      setShowToast(true);
      return;
    }

    // Hard stop/Auto-next checks:
    if (activeMoodQueue) {
      const activeIndex = activeMoodQueue.findIndex(item => item.id === selectedId);
      if (activeIndex !== -1) {
        const currentItem = activeMoodQueue[activeIndex];
        if (currentItem.target > 0 && currentItem.count >= currentItem.target) {
          // Switch to next or exit
          if (activeIndex + 1 < activeMoodQueue.length) {
            const nextItem = activeMoodQueue[activeIndex + 1];
            setSelectedId(nextItem.id);
            setToastMessage(`Switching to next: ${nextItem.translation} 🌟`);
            setShowToast(true);
          } else {
            // Finished!
            setActiveMoodQueue(null);
            setSelectedId(preMoodSelectedId);
            setToastMessage(`Mood Remembrance Journey Completed! 🎉`);
            setShowToast(true);
          }
          return; // hard stop on that click
        }
      }
    } else {
      // Normal mode hard stop / auto-next
      if (activeDhikr.target > 0 && activeDhikr.count >= activeDhikr.target) {
        const activeIdx = dhikrList.findIndex(d => d.id === activeDhikr.id);
        if (activeIdx !== -1 && activeIdx + 1 < dhikrList.length) {
          const nextDhikr = dhikrList[activeIdx + 1];
          setSelectedId(nextDhikr.id);
          setToastMessage(`Switching to next: ${nextDhikr.translation} 🌟`);
          setShowToast(true);
        } else {
          setToastMessage(`Target Completed! 🎉`);
          setShowToast(true);
        }
        return; // hard stop on that click
      }
    }

    // Dhikr Speed Tracker: Analyze pacing
    const now = Date.now();
    const diff = now - lastTapTime.current;
    lastTapTime.current = now;

    if (diff > 0 && diff < 1200) {
      setSpeedWarning(true);
      if (speedWarningTimeout.current) {
        clearTimeout(speedWarningTimeout.current);
      }
      speedWarningTimeout.current = setTimeout(() => {
        setSpeedWarning(false);
      }, 2000);
    }

    // Reset tap animation values
    tapScale.setValue(1);
    tapOpacity.setValue(0.35); // faded tap ripple

    // Animate tap ripple
    Animated.parallel([
      Animated.timing(tapScale, {
        toValue: 1.75,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(tapOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Increment count inside the correct state
    if (activeMoodQueue) {
      const activeIndex = activeMoodQueue.findIndex(item => item.id === selectedId);
      if (activeIndex !== -1) {
        const currentItem = activeMoodQueue[activeIndex];
        const nextCount = currentItem.count + 1;

        if (vibrationEnabled) {
          if (currentItem.target > 0 && nextCount === currentItem.target) {
            Vibration.vibrate([0, 120, 80, 180]);
          } else {
            Vibration.vibrate(60);
          }
        }

        const updatedQueue = activeMoodQueue.map((item) => {
          if (item.id === currentItem.id) {
            return { ...item, count: nextCount };
          }
          return item;
        });
        setActiveMoodQueue(updatedQueue);

        if (currentItem.target > 0 && nextCount === currentItem.target) {
          if (activeIndex + 1 < activeMoodQueue.length) {
            setToastMessage(`Completed! Tap again to switch to next supplication.`);
          } else {
            setToastMessage(`Journey Completed! Tap again to return.`);
          }
          setShowToast(true);
        }
      }
    } else {
      if (activeDhikr.isCircle) {
        const auth = googleAuthService.getCurrentState();
        if (!auth.isAuthenticated || !auth.user?.name) {
          Alert.alert('Authentication Required', 'Please sign in via the Community Circles tab to contribute to communal dhikr.');
          return;
        }
        const currentMemberCount = activeCircleData?.members?.[auth.user.name]?.count || 0;
        const newCount = currentMemberCount + 1;
        sharingService.updateCircleCount(activeDhikr.circleId!, auth.user.name, newCount).catch((err) => {
          console.warn('Failed to update circle count:', err);
        });

        if (vibrationEnabled) {
          Vibration.vibrate(60);
        }
        return;
      }

      const updatedList = dhikrList.map((item) => {
        if (item.id === activeDhikr.id) {
          const nextCount = item.count + 1;
          
          if (vibrationEnabled) {
            if (item.target > 0 && nextCount === item.target) {
              Vibration.vibrate([0, 120, 80, 180]);
            } else {
              Vibration.vibrate(60);
            }
          }

          if (item.target > 0 && nextCount === item.target) {
            setToastMessage(`Target Completed! 🎉 You have completed ${item.target} repetitions.`);
            setShowToast(true);
          }

          return { ...item, count: nextCount };
        }
        return item;
      });

      saveDhikrList(updatedList);
    }
  };

  // Trigger reset confirmation modal
  const promptReset = (id: string) => {
    setTargetId(id);
    setConfirmResetVisible(true);
  };

  const confirmReset = () => {
    const updatedList = dhikrList.map((item) => {
      if (item.id === targetId) {
        return { ...item, count: 0 };
      }
      return item;
    });
    saveDhikrList(updatedList);
    setConfirmResetVisible(false);
  };

  // Trigger delete confirmation modal
  const promptDelete = (id: string) => {
    setTargetId(id);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    const updatedList = dhikrList.filter((item) => item.id !== targetId);
    if (selectedId === targetId) {
      setActiveMoodQueue(null); // Cancel/Exit any active mood queue journey
      setSelectedId(PREDEFINED_DHIKR[0].id);
    }
    saveDhikrList(updatedList);
    setConfirmDeleteVisible(false);
  };

  const handleAddCustom = () => {
    setValidationError('');
    if (!newArabic.trim()) {
      setValidationError('Please enter the Arabic phrase.');
      return;
    }

    const targetVal = parseInt(newTarget, 10);
    if (isNaN(targetVal) || targetVal < 0) {
      setValidationError('Please enter a valid count target.');
      return;
    }

    const newItem: DhikrItem = {
      id: `custom_${Date.now()}`,
      arabic: newArabic.trim(),
      translation: newTranslation.trim() || 'Custom Supplication',
      count: 0,
      target: targetVal,
      isCustom: true,
    };

    const updatedList = [...dhikrList, newItem];
    saveDhikrList(updatedList);
    setActiveMoodQueue(null); // Cancel/Exit any active mood queue journey
    setSelectedId(newItem.id);
    setNewArabic('');
    setNewTranslation('');
    setNewTarget('33');
    setCustomModalVisible(false);
    setDropdownVisible(false);
  };

  const setQuickLimit = (limit: number) => {
    if (!activeDhikr) return;
    const updatedList = dhikrList.map((item) => {
      if (item.id === activeDhikr.id) {
        return { ...item, target: limit };
      }
      return item;
    });
    saveDhikrList(updatedList);
    setTargetSheetVisible(false);
  };

  const handleSetCustomTarget = () => {
    setTargetSheetError('');
    const targetVal = parseInt(customTargetInput, 10);
    if (isNaN(targetVal) || targetVal < 0) {
      setTargetSheetError('Please enter a valid target count.');
      return;
    }
    setQuickLimit(targetVal);
    setCustomTargetInput('');
    setShowCustomTargetInput(false);
    setTargetSheetVisible(false);
  };

  if (!activeDhikr) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  return (
    <Pressable 
      onPress={handleIncrement} 
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}
      android_ripple={{ color: colors.primary + '10', borderless: false }}
    >
      {/* Top Header Bar */}
      <View style={styles.topHeaderBar}>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Community Circles Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('Circles');
            }}
            style={[styles.headerIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="people-outline" size={22} color={colors.primary} />
          </Pressable>

          {/* Salawat Tracker Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setSalawatModalVisible(true);
            }}
            style={[styles.headerIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="rose-outline" size={22} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Slide-Down Completion Toast */}
      {showToast && (
        <View style={[styles.toastContainer, { backgroundColor: colors.primary }]} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={20} color={colors.background} />
          <Text style={[styles.toastText, { color: colors.background }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      {/* Main Display Area (Atmospheric glassmorphic design) */}
      <View style={styles.displayArea} pointerEvents="none">
        
        {activeMoodQueue && (
          <View style={[styles.moodJourneyHeader, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={[styles.moodJourneyText, { color: colors.textPrimary }]}>
              Guided Journey: {activeMoodQueue.findIndex(item => item.id === selectedId) + 1} of {activeMoodQueue.length}
            </Text>
          </View>
        )}

        {/* Floating Calligraphy Card */}
        <View style={[styles.calligraphyCard, { backgroundColor: colors.surface , borderColor: colors.border }]}>
          <Text 
            style={[styles.arabicDisplay, { color: colors.textPrimary, fontFamily: FONTS.arabic }]}
            adjustsFontSizeToFit={true}
            numberOfLines={2}
            minimumFontScale={0.4}
          >
            {activeDhikr.arabic}
          </Text>
          <Text 
            style={[styles.translationDisplay, { color: colors.textSecondary }]}
            adjustsFontSizeToFit={true}
            numberOfLines={2}
            minimumFontScale={0.6}
          >
            {activeDhikr.translation}
          </Text>
        </View>

        {speedWarning && (
          <View style={[styles.speedWarningContainer, { backgroundColor: '#10B981' + '15', borderColor: '#10B981' }]}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
            <Text style={[styles.speedWarningText, { color: '#10B981' }]}>
              Paced Recitation. Keep a steady, mindful count.
            </Text>
          </View>
        )}

        {/* Bouncing / Rippling Circle Counter Section */}
        <View style={styles.circleContainer}>
          
          {/* Subtle Ambient Golden Glow (Pulse effect behind) */}
          <View style={[styles.ambientGlow, { backgroundColor: colors.primary + '05' }]} />

          {/* Continuous Idle breathing ripple (Faded background pulse) */}
          {!isCircleTargetCompleted && (
            <Animated.View
              style={[
                styles.idleRipple,
                {
                  borderColor: colors.primary,
                  transform: [{ scale: idleScale }],
                  opacity: idleOpacity,
                },
              ]}
            />
          )}

          {/* Fast Tap concentric ripple (Expanding circle border on tap) */}
          <Animated.View
            style={[
              styles.tapRipple,
              {
                borderColor: colors.primary,
                transform: [{ scale: tapScale }],
                opacity: tapOpacity,
              },
            ]}
          />

          {/* Main Static glassmorphic circle */}
          <View
            style={[
              styles.mainCircle,
              {
                backgroundColor: isCircleTargetCompleted ? colors.border + '15' : colors.surface,
                borderColor: isCircleTargetCompleted ? colors.textMuted + '50' : colors.border,
                opacity: isCircleTargetCompleted ? 0.75 : 1.0,
              },
            ]}
          >
            <Text style={[styles.countDigit, { color: isCircleTargetCompleted ? colors.textMuted : colors.primary }]}>
              {activeDhikr.count}
            </Text>
            
            {activeDhikr.target > 0 ? (
              <Text style={[styles.targetLabel, { color: colors.textMuted }]}>
                / {activeDhikr.target}
              </Text>
            ) : (
              <Text style={[styles.targetLabel, { color: colors.textMuted }]}>
                ∞ Mode
              </Text>
            )}

            {/* {activeDhikr.target > 0 && (
              <Text style={[styles.percentLabel, { color: colors.primary }]}>
                {progressPercent}%
              </Text>
            )} */}
          </View>
        </View>

        <Text style={[styles.tapInstructions, { color: isCircleTargetCompleted ? colors.error : colors.textMuted }]}>
          {isCircleTargetCompleted ? 'Target Completed! Counting Disabled.' : 'Tap anywhere to count'}
        </Text>
      </View>

      {/* iOS-Style Translucent Bottom Control Dock */}
      <View style={styles.bottomDockContainer} pointerEvents="box-none">
        <View style={[styles.controlDock, { backgroundColor: colors.surface + '75', borderColor: colors.border }]} pointerEvents="box-none">
          
          {/* Active Dhikr Selector Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setDropdownVisible(true);
            }}
            style={[styles.dockBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.primary} />
            <Text numberOfLines={1} style={[styles.dockBtnText, { color: colors.textPrimary }]}>
              Dhikr List
            </Text>
          </Pressable>

          {/* Mood Selector Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setSelectedMoodId(null);
              setMoodSheetVisible(true);
            }}
            style={[styles.dockBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="happy-outline" size={18} color={colors.primary} />
            <Text numberOfLines={1} style={[styles.dockBtnText, { color: colors.textPrimary }]}>
              Moods
            </Text>
          </Pressable>

          {/* Target Limit Selector Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              setTargetSheetError('');
              setShowCustomTargetInput(false);
              setTargetSheetVisible(true);
            }}
            style={[styles.dockBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="flag-outline" size={18} color={colors.primary} />
            <Text style={[styles.dockBtnText, { color: colors.textPrimary }]}>
              {activeDhikr.target > 0 ? `${activeDhikr.target}` : '∞'}
            </Text>
          </Pressable>

          {/* Reset Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              promptReset(activeDhikr.id);
            }}
            style={[styles.dockActionBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons name="refresh-outline" size={20} color={colors.error} />
          </Pressable>

          {/* Sound/Vibration Toggle */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleVibration();
            }}
            style={[styles.dockActionBtn, { backgroundColor: colors.background + '80' }]}
          >
            <Ionicons
              name={vibrationEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
              size={20}
              color={vibrationEnabled ? colors.primary : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>

      {/* Supplication Dropdown Selector (Modal Sheet) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setDropdownVisible(false)} />
          
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>Choose Supplication</Text>
              <Pressable onPress={() => setDropdownVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <FlatList
              data={dhikrList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.bottomSheetList}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedId;
                return (
                  <View style={[styles.itemRowWrapper, { borderBottomColor: colors.border }]}>
                    <Pressable
                      onPress={() => {
                        setActiveMoodQueue(null); // Cancel/Exit any active mood queue journey
                        setSelectedId(item.id);
                        setDropdownVisible(false);
                      }}
                      style={[
                        styles.bottomSheetItemBtn,
                        isSelected && { backgroundColor: colors.primary + '10' }
                      ]}
                    >
                      <View style={styles.itemTextLeft}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.itemArabic, { color: colors.textPrimary, fontFamily: item.isCircle ? FONTS.english : FONTS.arabic }]}>
                            {item.arabic}
                          </Text>
                          {item.isCircle && (
                            <View style={{ backgroundColor: colors.primary + '20', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                              <Text style={{ fontSize: 9, color: colors.primary, fontWeight: 'bold' }}>CIRCLE</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.itemTranslation, { color: colors.textSecondary }]}>
                          {item.translation}
                        </Text>
                      </View>
                      
                      <View style={styles.itemProgressRight}>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            setEditCountTargetId(item.id);
                            setEditCountInput(String(item.count));
                            setEditCountModalVisible(true);
                          }}
                          style={styles.editMiniBtn}
                        >
                          <Ionicons name="create-outline" size={16} color={colors.primary} />
                        </Pressable>

                        <Text style={[styles.itemProgressText, { color: colors.primary }]}>
                          {item.count}{item.target > 0 ? `/${item.target}` : ' (∞)'}
                        </Text>
                        
                        {item.isCircle ? (
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              Alert.alert(
                                'Remove Circle Dhikr?',
                                `Remove "${item.arabic.replace('📿 ', '')}" from your list? You can re-join the circle to add it back.`,
                                [
                                  { text: 'Cancel', style: 'cancel' },
                                  {
                                    text: 'Remove',
                                    style: 'destructive',
                                    onPress: () => removeCircleDhikr(item.circleId!),
                                  },
                                ]
                              );
                            }}
                            style={styles.deleteMiniBtn}
                          >
                            <Ionicons name="close-circle-outline" size={16} color={colors.error} />
                          </Pressable>
                        ) : item.isCustom ? (
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              promptDelete(item.id);
                            }}
                            style={styles.deleteMiniBtn}
                          >
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                          </Pressable>
                        ) : (
                          <View style={{ width: 24 }} />
                        )}
                      </View>
                    </Pressable>
                  </View>
                );
              }}
              ListFooterComponent={
                <Pressable
                  onPress={() => {
                    setValidationError('');
                    setCustomModalVisible(true);
                  }}
                  style={[styles.addCustomTriggerBtn, { borderColor: colors.primary }]}
                >
                  <Ionicons name="add" size={20} color={colors.primary} />
                  <Text style={[styles.addCustomTriggerText, { color: colors.primary }]}>
                    Add Custom Supplication
                  </Text>
                </Pressable>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Target Count Dropdown Selector (Bottom Sheet Modal) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={targetSheetVisible}
        onRequestClose={() => setTargetSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setTargetSheetVisible(false)} />
          
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>Select Target Limit</Text>
              <Pressable onPress={() => setTargetSheetVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            {targetSheetError ? (
              <View style={[styles.validationBox, { backgroundColor: colors.error + '15', borderColor: colors.error, marginBottom: 12 }]}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={[styles.validationText, { color: colors.error }]}>{targetSheetError}</Text>
              </View>
            ) : null}

            <View style={styles.targetSheetBody}>
              <View style={styles.targetGrid}>
                <Pressable
                  onPress={() => setQuickLimit(33)}
                  style={[styles.targetGridItem, activeDhikr.target === 33 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>33 Reps</Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuickLimit(99)}
                  style={[styles.targetGridItem, activeDhikr.target === 99 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>99 Reps</Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuickLimit(100)}
                  style={[styles.targetGridItem, activeDhikr.target === 100 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>100 Reps</Text>
                </Pressable>

                <Pressable
                  onPress={() => setQuickLimit(0)}
                  style={[styles.targetGridItem, activeDhikr.target === 0 && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <Text style={[styles.targetGridText, { color: colors.textPrimary }]}>Unlimited (∞)</Text>
                </Pressable>
              </View>

              {!showCustomTargetInput ? (
                <Pressable
                  onPress={() => setShowCustomTargetInput(true)}
                  style={[styles.customTargetTrigger, { borderColor: colors.primary }]}
                >
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                  <Text style={[styles.customTargetTriggerText, { color: colors.primary }]}>
                    Set Custom Target
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.customTargetInputRow}>
                  <TextInput
                    style={[
                      styles.customTargetTextInput,
                      {
                        backgroundColor: colors.background,
                        color: colors.textPrimary,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="e.g. 500, 1000"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={customTargetInput}
                    onChangeText={setCustomTargetInput}
                    autoFocus
                  />
                  <Pressable
                    onPress={handleSetCustomTarget}
                    style={[styles.customTargetSetBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.customTargetSetBtnText, { color: colors.background }]}>Set</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Supplication Creation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={customModalVisible}
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setCustomModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Custom Dhikr</Text>
              <Pressable onPress={() => setCustomModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              {validationError ? (
                <View style={[styles.validationBox, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
                  <Ionicons name="alert-circle" size={16} color={colors.error} />
                  <Text style={[styles.validationText, { color: colors.error }]}>{validationError}</Text>
                </View>
              ) : null}

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Arabic Text</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                    fontFamily: FONTS.arabic,
                    fontSize: 20,
                    textAlign: 'right',
                  },
                ]}
                placeholder="مثال: سُبْحَانَ ٱللَّٰهِ"
                placeholderTextColor={colors.textMuted}
                value={newArabic}
                onChangeText={setNewArabic}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Translation / Name</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g. Glory be to Allah"
                placeholderTextColor={colors.textMuted}
                value={newTranslation}
                onChangeText={setNewTranslation}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Target Repetitions (0 for unlimited)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="e.g. 33, 100"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={newTarget}
                onChangeText={setNewTarget}
              />

              <Pressable
                onPress={handleAddCustom}
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.saveBtnText, { color: colors.background }]}>Add Supplication</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Confirmation Alert Modal: Reset */}
      <Modal
        transparent
        visible={confirmResetVisible}
        animationType="fade"
        onRequestClose={() => setConfirmResetVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.confirmIconContainer, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="refresh-outline" size={28} color={colors.error} />
            </View>
            
            <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Reset Counter?</Text>
            <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
              Are you sure you want to reset this supplication counter back to 0?
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                onPress={() => setConfirmResetVisible(false)}
                style={[styles.confirmBtn, styles.confirmBtnCancel, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.textPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmReset}
                style={[styles.confirmBtn, { backgroundColor: colors.error }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.white }]}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Confirmation Alert Modal: Delete */}
      <Modal
        transparent
        visible={confirmDeleteVisible}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.confirmIconContainer, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="trash-outline" size={28} color={colors.error} />
            </View>

            <Text style={[styles.confirmTitle, { color: colors.textPrimary }]}>Delete Supplication?</Text>
            <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>
              This custom supplication and all its progress will be permanently deleted.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                onPress={() => setConfirmDeleteVisible(false)}
                style={[styles.confirmBtn, styles.confirmBtnCancel, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.textPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={confirmDelete}
                style={[styles.confirmBtn, { backgroundColor: colors.error }]}
              >
                <Text style={[styles.confirmBtnText, { color: colors.white }]}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Count Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editCountModalVisible}
        onRequestClose={() => setEditCountModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setEditCountModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Count</Text>
              <Pressable onPress={() => setEditCountModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Current Count</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="numeric"
                value={editCountInput}
                onChangeText={setEditCountInput}
                autoFocus
              />

              <Pressable
                onPress={handleSaveCount}
                style={[styles.saveBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
              >
                <Text style={[styles.saveBtnText, { color: colors.background }]}>Save Count</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Durood Selector Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={duroodSelectorVisible}
        onRequestClose={() => setDuroodSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setDuroodSelectorVisible(false)} />
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface, height: '80%' }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>Choose Durood</Text>
              <Pressable onPress={() => setDuroodSelectorVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <FlatList
              data={duroodList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.bottomSheetList}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedDuroodId;
                return (
                  <Pressable
                    onPress={async () => {
                      setSelectedDuroodId(item.id);
                      await AsyncStorage.setItem('@dhikr_selected_durood_id', item.id);
                      setDuroodSelectorVisible(false);
                    }}
                    style={[styles.moodSheetRow, { borderBottomColor: colors.border }, isSelected && { backgroundColor: colors.primary + '10' }]}
                  >
                    <View style={{ flex: 1, paddingHorizontal: 12 }}>
                      <Text style={[styles.moodDhikrArabic, { color: colors.textPrimary, fontFamily: FONTS.arabic }]}>
                        {item.arabic}
                      </Text>
                      <Text style={[styles.moodDhikrTranslation, { color: colors.textSecondary, marginTop: 4 }]}>
                        {item.translation}
                      </Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginRight: 10 }} />}
                  </Pressable>
                );
              }}
              ListFooterComponent={
                <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 }}>Add Custom Durood</Text>
                  
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, marginBottom: 10 }]}
                    placeholder="Arabic Text (e.g. صل الله عليه وسلم)"
                    placeholderTextColor={colors.textMuted}
                    value={customDuroodArabic}
                    onChangeText={setCustomDuroodArabic}
                  />
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, marginBottom: 10 }]}
                    placeholder="Translation"
                    placeholderTextColor={colors.textMuted}
                    value={customDuroodTranslation}
                    onChangeText={setCustomDuroodTranslation}
                  />
                  
                  <Pressable
                    onPress={async () => {
                      if (!customDuroodArabic.trim()) return;
                      const newItem = {
                        id: `custom_durood_${Date.now()}`,
                        arabic: customDuroodArabic.trim(),
                        translation: customDuroodTranslation.trim() || 'Custom Durood',
                      };
                      const updatedList = [...duroodList, newItem];
                      setDuroodList(updatedList);
                      await AsyncStorage.setItem('@dhikr_durood_list', JSON.stringify(updatedList));
                      setSelectedDuroodId(newItem.id);
                      await AsyncStorage.setItem('@dhikr_selected_durood_id', newItem.id);
                      setCustomDuroodArabic('');
                      setCustomDuroodTranslation('');
                      setDuroodSelectorVisible(false);
                      setToastMessage("Custom Durood Added! 🌹");
                      setShowToast(true);
                    }}
                    style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.saveBtnText, { color: colors.background }]}>Add Durood</Text>
                  </Pressable>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Mood Selector Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={moodSheetVisible}
        onRequestClose={() => setMoodSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setMoodSheetVisible(false)} />
          
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface }]}>
            <View style={styles.bottomSheetHeader}>
              <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>
                {selectedMoodId ? 'Recommended Supplications' : 'How are you feeling?'}
              </Text>
              <Pressable onPress={() => {
                if (selectedMoodId) {
                  setSelectedMoodId(null);
                } else {
                  setMoodSheetVisible(false);
                }
              }}>
                <Ionicons name={selectedMoodId ? "arrow-back" : "close"} size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            {!selectedMoodId ? (
              <FlatList
                data={MOODS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.bottomSheetList}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setSelectedMoodId(item.id)}
                    style={[styles.moodSheetRow, { borderBottomColor: colors.border }]}
                  >
                    <Text style={styles.moodSheetEmoji}>{item.emoji}</Text>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.moodSheetLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                      <Text style={[styles.moodSheetDesc, { color: colors.textSecondary }]}>{item.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </Pressable>
                )}
              />
            ) : (
              <View style={{ minHeight: 400, maxHeight: 485 }}>
                <Text style={{ paddingHorizontal: 20, paddingBottom: 12, fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' }}>
                  Supplications recommended for feeling {MOODS.find(m => m.id === selectedMoodId)?.label}:
                </Text>

                <View style={{ alignItems: 'center', width: '100%', marginTop: 10, marginBottom: 6 }}>
                  <Pressable
                    onPress={() => {
                      const mood = MOODS.find(m => m.id === selectedMoodId);
                      if (mood) {
                        handleStartMoodJourney(mood);
                      }
                    }}
                    style={({ pressed }) => [
                      styles.saveBtn,
                      {
                        backgroundColor: colors.primary,
                        width: '90%',
                        marginTop: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        opacity: pressed ? 0.9 : 1
                      }
                    ]}
                  >
                    <Ionicons name="play" size={18} color={colors.background} />
                    <Text style={[styles.saveBtnText, { color: colors.background, fontWeight: '800' }]}>
                      Start Mood Journey
                    </Text>
                  </Pressable>
                </View>

                <FlatList
                  data={MOODS.find(m => m.id === selectedMoodId)?.dhikrs}
                  keyExtractor={(item) => item.arabic}
                  contentContainerStyle={styles.bottomSheetList}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        handleSelectSuggestedDhikr(item);
                      }}
                      style={[styles.moodDhikrItem, { borderBottomColor: colors.border }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.moodDhikrArabic, { color: colors.textPrimary, fontFamily: FONTS.arabic }]}>
                          {item.arabic}
                        </Text>
                        <Text style={[styles.moodDhikrTranslation, { color: colors.textSecondary }]}>
                          {item.translation}
                        </Text>
                      </View>
                      <View style={[styles.moodDhikrBadge, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[styles.moodDhikrBadgeText, { color: colors.primary }]}>{item.target} Reps</Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Salawat / Durood Tracker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={salawatModalVisible}
        onRequestClose={() => setSalawatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setSalawatModalVisible(false)} />
          <View style={[styles.bottomSheetContent, { backgroundColor: colors.surface, height: '70%' }]}>
            <View style={styles.bottomSheetHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="rose-outline" size={24} color={colors.primary} />
                <Text style={[styles.bottomSheetTitle, { color: colors.textPrimary }]}>Salawat Counter</Text>
              </View>
              <Pressable onPress={() => setSalawatModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, alignItems: 'center' }}>
              
              {/* Friday Optimization Notice */}
              {new Date().getDay() === 5 ? (
                <View style={[styles.jummahBadge, { backgroundColor: '#F59E0B' + '20', borderColor: '#F59E0B' }]}>
                  <Ionicons name="sparkles" size={18} color="#F59E0B" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#F59E0B' }}>Blessed Friday (Jummah) Active!</Text>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                      "Send blessings upon me abundantly on Friday..." — recommended target: 1000.
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.jummahBadge, { backgroundColor: colors.primary + '10', borderColor: colors.primary }]}>
                  <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: colors.primary }}>Daily Salawat</Text>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                      "He who sends one blessing upon me, Allah sends ten upon him." (Sahih Muslim)
                    </Text>
                  </View>
                </View>
              )}

              {/* Calligraphy Card inside Salawat Tracker */}
              <Pressable
                onPress={() => setDuroodSelectorVisible(true)}
                style={[styles.salawatCalligraphy, { borderColor: colors.border, backgroundColor: colors.background }]}
              >
                <Text 
                  style={[styles.salawatArabic, { color: colors.textPrimary, fontFamily: FONTS.arabic }]}
                  adjustsFontSizeToFit={true}
                  numberOfLines={2}
                  minimumFontScale={0.5}
                >
                  {activeDurood.arabic}
                </Text>
                <Text 
                  style={[styles.salawatTranslation, { color: colors.textSecondary, marginTop: 6 }]}
                  adjustsFontSizeToFit={true}
                  numberOfLines={3}
                  minimumFontScale={0.6}
                >
                  {activeDurood.translation}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 }}>
                  <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
                  <Text style={{ fontSize: 11, color: colors.primary, fontWeight: 'bold' }}>Tap to select / add Durood preset</Text>
                </View>
              </Pressable>

              {/* Big Tap to Count Button for Salawat */}
              <Pressable
                onPress={handleIncrementSalawat}
                style={({ pressed }) => [
                  styles.salawatCircleBtn,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  }
                ]}
              >
                <Text style={[styles.salawatCountDigit, { color: colors.primary }]}>
                  {salawatCount}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600' }}>
                  / {salawatTarget} Target
                </Text>
              </Pressable>

              {/* Custom Target and Reset Actions */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' }}>
                <Pressable
                  onPress={() => handleSetSalawatTarget(100)}
                  style={[styles.salawatActionBtn, salawatTarget === 100 && { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.salawatActionBtnText, { color: salawatTarget === 100 ? colors.background : colors.textPrimary }]}>100</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleSetSalawatTarget(313)}
                  style={[styles.salawatActionBtn, salawatTarget === 313 && { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.salawatActionBtnText, { color: salawatTarget === 313 ? colors.background : colors.textPrimary }]}>313</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleSetSalawatTarget(1000)}
                  style={[styles.salawatActionBtn, salawatTarget === 1000 && { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.salawatActionBtnText, { color: salawatTarget === 1000 ? colors.background : colors.textPrimary }]}>1000</Text>
                </Pressable>
                <Pressable
                  onPress={handleResetSalawat}
                  style={[styles.salawatResetBtn, { borderColor: colors.error }]}
                >
                  <Ionicons name="refresh-outline" size={18} color={colors.error} />
                </Pressable>
              </View>

              {/* Custom Salawat Target Input */}
              <Pressable
                onPress={() => setShowSalawatTargetInput(!showSalawatTargetInput)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15 }}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary} />
                <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '700' }}>
                  {showSalawatTargetInput ? "Hide Custom Target" : "Set Custom Target Count"}
                </Text>
              </Pressable>

              {showSalawatTargetInput && (
                <View style={{ width: '100%', marginTop: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border, marginBottom: 8 }]}
                    placeholder="Enter Custom Target (e.g. 500, 2000)"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={customSalawatTargetInput}
                    onChangeText={setCustomSalawatTargetInput}
                  />
                  <Pressable
                    onPress={() => {
                      const val = parseInt(customSalawatTargetInput, 10);
                      if (!isNaN(val) && val > 0) {
                        handleSetSalawatTarget(val);
                        setCustomSalawatTargetInput('');
                        setShowSalawatTargetInput(false);
                      }
                    }}
                    style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.saveBtnText, { color: colors.background }]}>Set Target</Text>
                  </Pressable>
                </View>
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  toastContainer: {
    position: 'absolute',
    top: 25,
    left: 20,
    right: 20,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  topActionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 8,
    zIndex: 10,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: '85%',
    gap: 8,
  },
  dropdownBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  displayArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  calligraphyCard: {
    width: '100%',
    top: -90,
    borderRadius: 24,
    borderWidth: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  arabicDisplay: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 6,
  },
  translationDisplay: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  circleContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
  },
  idleRipple: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 1.5,
  },
  tapRipple: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 3,
  },
  mainCircle: {
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  countDigit: {
    fontSize: 67,
    fontWeight: '900',
    lineHeight: 56,
  },
  targetLabel: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  percentLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tapInstructions: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    top: 25,
  },
  bottomDockContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 26,
    zIndex: 10,
  },
  controlDock: {
    flexDirection: 'row',
    borderRadius: 22,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dockBtn: {
    flex: 2.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 14,
    gap: 6,
    paddingHorizontal: 10,
  },
  dockBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dockActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  bottomSheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '75%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  bottomSheetList: {
    paddingBottom: 24,
  },
  itemRowWrapper: {
    borderBottomWidth: 1,
  },
  bottomSheetItemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  itemTextLeft: {
    flex: 1,
    paddingRight: 10,
  },
  itemArabic: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'left',
  },
  itemTranslation: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'left',
  },
  itemProgressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteMiniBtn: {
    padding: 6,
  },
  addCustomTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    marginTop: 18,
    gap: 6,
  },
  addCustomTriggerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  targetSheetBody: {
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  targetGridItem: {
    flex: 1,
    minWidth: '45%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetGridText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customTargetTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 8,
  },
  customTargetTriggerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customTargetInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  customTargetTextInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  customTargetSetBtn: {
    width: 70,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTargetSetBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    gap: 16,
  },
  validationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  validationText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: -8,
  },
  textInput: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  saveBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  confirmIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnCancel: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  topHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%',
    zIndex: 20,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  editMiniBtn: {
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  // Moods Sheet Styles
  moodSheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  moodSheetEmoji: {
    fontSize: 26,
  },
  moodSheetLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  moodSheetDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  moodDhikrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  moodDhikrArabic: {
    fontSize: 20,
    textAlign: 'left',
    lineHeight: 28,
  },
  moodDhikrTranslation: {
    fontSize: 12,
    marginTop: 4,
  },
  moodDhikrBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  moodDhikrBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Salawat Modal Styles
  jummahBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  salawatCalligraphy: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  salawatArabic: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 6,
  },
  salawatTranslation: {
    fontSize: 13,
    textAlign: 'center',
  },
  salawatCircleBtn: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  salawatCountDigit: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
    marginBottom: 4,
  },
  salawatActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  salawatActionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  salawatResetBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedWarningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    top: -80,
    marginBottom: 10,
  },
  speedWarningText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moodJourneyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    top: -100,
    marginBottom: 10,
  },
  moodJourneyText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
