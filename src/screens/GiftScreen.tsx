import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS } from '../utils/constants';
import quranData from '../../assets/json/quran.json';
import surahMetaData from '../../assets/json/surah_meta.json';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ── Types ──
type GiftThemeId = 'ramadan' | 'eid' | 'healing' | 'blessings' | 'gratitude' | 'royal_indigo' | 'midnight_mosque' | 'amber_victory' | 'violet_mercy' | 'gold_royal' | 'silver_pearl' | 'bronze_earth' | 'platinum_sky';
type GiftAnimation = 'lanterns' | 'stars' | 'rain' | 'petals';

interface GiftTheme {
  id: GiftThemeId;
  name: string;
  colors: string[]; // Gradient
  isDark: boolean;
  bgSource?: any;
  accent: string;
  metallic?: boolean;
  metalGradient?: [string, string, ...string[]];
}

interface PresetDua {
  id: string;
  title: string;
  arabic: string;
  english: string;
}

// ── Constants ──
const THEMES: GiftTheme[] = [
  // ── Standard Themes ──
  { id: 'ramadan', name: 'Ramadan Moon', colors: ['#0b0c1b', '#1a1b3a', '#060714'], isDark: true, bgSource: require('../../assets/backgrounds/bg_indigo_stars.jpg'), accent: '#f59e0b' },
  { id: 'eid', name: 'Eid Mubarak', colors: ['#120120', '#2d0a42', '#08000f'], isDark: true, bgSource: require('../../assets/backgrounds/bg_mosque_night_sky.jpg'), accent: '#d946ef' },
  { id: 'healing', name: 'Olive Peace', colors: ['#0f1710', '#1c2e20', '#0a0f0a'], isDark: true, bgSource: require('../../assets/backgrounds/bg_olive_gold.jpg'), accent: '#84cc16' },
  { id: 'blessings', name: 'Daily Ivory', colors: ['#FCFBF7', '#F5F2E9', '#EAE4D3'], isDark: false, bgSource: require('../../assets/backgrounds/bg_parchment.jpg'), accent: '#b45309' },
  { id: 'gratitude', name: 'Emerald Gold', colors: ['#03180b', '#0e3a1f', '#010c05'], isDark: true, bgSource: require('../../assets/backgrounds/bg_arabesque_emerald.jpg'), accent: '#fbbf24' },
  { id: 'royal_indigo', name: 'Royal Indigo', colors: ['#09091e', '#1e1b4b', '#030712'], isDark: true, bgSource: require('../../assets/backgrounds/bg_charcoal_gold.jpg'), accent: '#818cf8' },
  { id: 'midnight_mosque', name: 'Midnight Mosque', colors: ['#020617', '#0f172a', '#090d16'], isDark: true, bgSource: require('../../assets/backgrounds/wp_17_lantern_glow.jpg'), accent: '#a78bfa' },
  { id: 'amber_victory', name: 'Amber Victory', colors: ['#1c1917', '#44403c', '#0c0a09'], isDark: true, bgSource: require('../../assets/backgrounds/bg_desert_gold.jpg'), accent: '#f59e0b' },
  { id: 'violet_mercy', name: 'Violet Mercy', colors: ['#1e1b4b', '#3b0764', '#090514'], isDark: true, bgSource: require('../../assets/backgrounds/bg_amethyst_gold.jpg'), accent: '#c084fc' },
  // ── Metallic Premium Themes ──
  {
    id: 'gold_royal',
    name: '🥇 Gold Royal',
    colors: ['#1a1200', '#2e1f00', '#0c0900'],
    isDark: true,
    bgSource: require('../../assets/backgrounds/bg_gold_black.jpg'),
    accent: '#f6c90e',
    metallic: true,
    metalGradient: ['#bf953f', '#fcf6ba', '#b38728', '#ffd700', '#aa771c'],
  },
  {
    id: 'silver_pearl',
    name: '🥈 Silver Pearl',
    colors: ['#0d0d0d', '#1a1a1a', '#050505'],
    isDark: true,
    bgSource: require('../../assets/backgrounds/bg_marble_dark.jpg'),
    accent: '#c8cdd4',
    metallic: true,
    metalGradient: ['#bdc3c7', '#f5f5f5', '#8e9eab', '#ffffff', '#b0b8be'],
  },
  {
    id: 'bronze_earth',
    name: '🥉 Bronze Earth',
    colors: ['#160b04', '#2a1406', '#0a0502'],
    isDark: true,
    bgSource: require('../../assets/backgrounds/bg_rust_gold.jpg'),
    accent: '#cd7f32',
    metallic: true,
    metalGradient: ['#a87c53', '#e3c08d', '#8f6034', '#caa278', '#7a4b26'],
  },
  {
    id: 'platinum_sky',
    name: '✨ Platinum Sky',
    colors: ['#050a12', '#0f1924', '#020509'],
    isDark: true,
    bgSource: require('../../assets/backgrounds/wp_25_moon_clouds.jpg'),
    accent: '#e8eaf0',
    metallic: true,
    metalGradient: ['#e8eaf0', '#ffffff', '#c5cae9', '#e8eaf0', '#9fa8da'],
  },
];

const PRESET_DUAS: PresetDua[] = [
  {
    id: 'protection',
    title: 'Dua for Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    english: 'In the name of Allah, with whose name nothing can cause harm on earth or in the heaven, and He is the All-Hearing, the All-Knowing.'
  },
  {
    id: 'anxiety',
    title: 'Dua for Anxiety & Grief',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    english: 'O Allah, I seek refuge in You from anxiety, grief, incapacity, laziness, cowardice, miserliness, the burden of debt and control of men.'
  },
  {
    id: 'ease',
    title: 'Dua for Ease & Trials',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزَنَ إِذَا شِئْتَ سَهْلًا',
    english: 'O Allah, there is no ease except in what You make easy, and You make the difficulty easy if You will.'
  },
  {
    id: 'health',
    title: 'Dua for Health & Well-being',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي لَا إِلَهَ إِلَّا أَنْتَ',
    english: 'O Allah, grant health to my body; O Allah, grant health to my hearing; O Allah, grant health to my sight; there is no deity except You.'
  },
  {
    id: 'forgiveness',
    title: 'Dua for Forgiveness',
    arabic: 'رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ',
    english: 'Our Lord, forgive us our sins and wipe out from us our evil deeds and make us die with the righteous.'
  },
  {
    id: 'parents',
    title: 'Dua for Parents',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    english: 'My Lord, have mercy upon them as they brought me up [when I was] small.'
  },
  {
    id: 'patience',
    title: 'Dua for Patience',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    english: 'Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.'
  },
  {
    id: 'guidance',
    title: 'Dua for Guidance',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',
    english: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.'
  },
  {
    id: 'gratitude_dua',
    title: 'Dua for Gratitude',
    arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ',
    english: 'My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.'
  },
  {
    id: 'steadfastness',
    title: 'Dua for Steadfastness',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَىٰ دِينِكَ',
    english: 'O Controller of the hearts, make my heart steadfast in Your religion.'
  },
];

export const GiftScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { giftData?: string } }, 'params'>>();
  const viewShotRef = useRef<ViewShot>(null);

  // Mode: 'create' | 'receive'
  const [mode, setMode] = useState<'create' | 'receive'>('create');
  
  // Received state
  const [giftOpened, setGiftOpened] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [receivedArabic, setReceivedArabic] = useState('');
  const [receivedEnglish, setReceivedEnglish] = useState('');
  const [receivedRef, setReceivedRef] = useState('');
  const [receivedTheme, setReceivedTheme] = useState<GiftTheme>(THEMES[0]);
  const [receivedAnimation, setReceivedAnimation] = useState<GiftAnimation>('lanterns');
  const [receivedTo, setReceivedTo] = useState('');
  const [receivedFrom, setReceivedFrom] = useState('');

  // Creator state
  const [selectedThemeId, setSelectedThemeId] = useState<GiftThemeId>('ramadan');
  const [selectedAnimation, setSelectedAnimation] = useState<GiftAnimation>('lanterns');
  const [customMsg, setCustomMsg] = useState('May Allah accept all your deeds, answer your prayers, and bless you with infinite happiness.');
  const [toName, setToName] = useState('');
  const [fromName, setFromName] = useState('');

  // Quran Verse picker
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [ayahNum, setAyahNum] = useState('1');
  const [verseArabic, setVerseArabic] = useState('');
  const [verseEnglish, setVerseEnglish] = useState('');
  const [verseRef, setVerseRef] = useState('');
  const [surahModalVisible, setSurahModalVisible] = useState(false);
  const [surahSearch, setSurahSearch] = useState('');
  const [duaModalVisible, setDuaModalVisible] = useState(false);

  // Dua Picker
  const [selectedDuaId, setSelectedDuaId] = useState<string>('protection');

  // Sharing states
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Animations
  const boxScale = useRef(new Animated.Value(1)).current;
  const boxOpacity = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(Array.from({ length: 15 }, () => new Animated.Value(0))).current;

  // Load verse details
  useEffect(() => {
    loadVerse();
  }, [selectedSurahId, ayahNum]);

  const loadVerse = () => {
    try {
      const num = parseInt(ayahNum, 10);
      if (isNaN(num) || num < 1) return;
      const flat = quranData as any[];
      const entry = flat.find((v: any) => v.surah === selectedSurahId && v.ayah === num);
      const surah = surahMetaData.find(s => s.id === selectedSurahId);
      if (entry && surah) {
        setVerseArabic(entry.arabic || '');
        setVerseEnglish(entry.english || '');
        setVerseRef(`${surah.name_en} — ${selectedSurahId}:${num}`);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Check if we received a gift via deep link / route params on mount
  useEffect(() => {
    if (route.params?.giftData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(route.params.giftData))));
        setReceivedMessage(decoded.msg || '');
        setReceivedArabic(decoded.ar || '');
        setReceivedEnglish(decoded.en || '');
        setReceivedRef(decoded.ref || '');
        const theme = THEMES.find(t => t.id === decoded.theme) || THEMES[0];
        setReceivedTheme(theme);
        setReceivedAnimation(decoded.anim || 'lanterns');
        setReceivedTo(decoded.to || '');
        setReceivedFrom(decoded.from || '');
        setMode('receive');
        setGiftOpened(false);
      } catch (e) {
        Alert.alert('Invalid Gift', 'Could not open this digital gift package.');
      }
    } else {
      setMode('create');
    }
  }, [route.params?.giftData]);

  // Open Gift Action
  const handleOpenGift = () => {
    // Trigger animations
    Animated.parallel([
      // Shrink and fade gift box
      Animated.timing(boxScale, {
        toValue: 0.1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(boxOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      // Fade in digital content card
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setGiftOpened(true);
    });

    // Animate bursting stars/particles
    particleAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200 + Math.random() * 600,
        useNativeDriver: true,
      }).start();
    });
  };

  // Build gift object and encode in Base64
  const buildGiftLink = () => {
    const chosenDua = PRESET_DUAS.find(d => d.id === selectedDuaId);
    const giftObj = {
      to: toName.trim() || 'My Dear Friend',
      from: fromName.trim() || 'Well Wisher',
      msg: customMsg.trim(),
      ar: chosenDua ? chosenDua.arabic : verseArabic,
      en: chosenDua ? chosenDua.english : verseEnglish,
      ref: chosenDua ? chosenDua.title : verseRef,
      theme: selectedThemeId,
      anim: selectedAnimation,
    };
    
    // Convert to JSON and encode to Base64 (supporting Unicode characters)
    const jsonStr = JSON.stringify(giftObj);
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    
    // We point to our public universal landing page (which hosts gift_viewer.html)
    // The user can host this page on Github Pages or Firebase
    const hostedLandingPage = 'https://nawazwariya182.github.io/dhikr-gift/viewer.html';
    return `${hostedLandingPage}?data=${encodeURIComponent(b64)}`;
  };

  // ── Share as Image ──
  const handleShareAsImage = async () => {
    setSharing(true);
    try {
      const uri = await (viewShotRef.current as any)?.capture?.();
      if (!uri) {
        Alert.alert('Error', 'Could not capture gift card. Please wait for the preview to fully load.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Spiritual Gift Card',
        UTI: 'public.png',
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to share gift card image.');
    } finally {
      setSharing(false);
    }
  };

  // ── Share Text/Link (for friends without the app) ──
  const handleShareTextLink = async () => {
    setSharing(true);
    try {
      const chosenDua = PRESET_DUAS.find(d => d.id === selectedDuaId);
      const arabicText = chosenDua ? chosenDua.arabic : verseArabic;
      const englishText = chosenDua ? chosenDua.english : verseEnglish;
      const refText = chosenDua ? chosenDua.title : verseRef;
      const toText = toName.trim() || 'you';
      const fromText = fromName.trim() || 'a friend';
      const msgText = customMsg.trim() || 'May Allah bless you.';

      const shareUrl = buildGiftLink();

      // Rich text gift — works in WhatsApp, SMS, Telegram, etc.
      const shareMessage =
        `🎁 A Spiritual Gift for ${toText} — from ${fromText}\n\n` +
        `"${msgText}"\n\n` +
        `${arabicText}\n\n` +
        `${englishText}\n` +
        `— ${refText}\n\n` +
        `✨ Open your interactive gift card here (no app needed):\n${shareUrl}\n\n` +
        `📲 Get the Dhikr App to send your own gifts:\nhttps://dhikr.contentify.studio`;

      await Share.share({ message: shareMessage });
    } catch (e) {
      Alert.alert('Error', 'Could not share the digital gift text.');
    } finally {
      setSharing(false);
    }
  };



  const filteredSurahs = surahSearch.trim()
    ? surahMetaData.filter(s =>
        (s.name_en || '').toLowerCase().includes(surahSearch.toLowerCase()) ||
        (s.name_translit || '').toLowerCase().includes(surahSearch.toLowerCase()) ||
        (s.id || '').toString().includes(surahSearch)
      )
    : surahMetaData;

  const selectedSurah = surahMetaData.find(s => s.id === selectedSurahId) ?? surahMetaData[0];
  const activeTheme = THEMES.find(t => t.id === selectedThemeId) ?? THEMES[0];

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      
      {/* ── MODE: RECEIVE GIFT (Interactive Opening Card) ── */}
      {mode === 'receive' && (
        <ImageBackground
          source={receivedTheme.bgSource}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        >
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.45)' }]} />

          {!giftOpened ? (
            <View style={styles.openingContainer}>
              <Animated.View style={{ transform: [{ scale: boxScale }], opacity: boxOpacity, alignItems: 'center' }}>
                <Text style={styles.giftTitle}>You have received a Gift!</Text>
                <Text style={styles.giftSubtitle}>A spiritual gift was sent to bless your day.</Text>

                {/* Animated Glowing Gift Box */}
                <Pressable onPress={handleOpenGift} style={styles.giftBoxWrapper}>
                  <View style={[styles.glowRing, { borderColor: receivedTheme.accent }]} />
                  <Ionicons name="gift" size={100} color={receivedTheme.accent} />
                  <Text style={styles.tapPrompt}>Tap to Open Gift</Text>
                </Pressable>
              </Animated.View>

              {/* Particle Burst Effects */}
              {particleAnims.map((anim, i) => {
                const angle = (i / particleAnims.length) * 2 * Math.PI;
                const distX = Math.cos(angle) * 200;
                const distY = Math.sin(angle) * 200 - 100;
                
                const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, distX] });
                const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, distY] });
                const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.5, 0] });

                return (
                  <Animated.View
                    key={i}
                    style={[
                      styles.particle,
                      {
                        backgroundColor: receivedTheme.accent,
                        transform: [{ translateX }, { translateY }, { scale }],
                      }
                    ]}
                  />
                );
              })}
            </View>
          ) : (
            <Animated.View style={[styles.contentCardContainer, { opacity: contentFade }]}>
              <ScrollView contentContainerStyle={styles.openedScroll}>
                <View style={[styles.giftPaper, { borderColor: receivedTheme.accent }]}>
                  {/* Decorative Border Corner Icons */}
                  <Ionicons name="heart" size={16} color={receivedTheme.accent} style={styles.cardCornerTL} />
                  <Ionicons name="star" size={16} color={receivedTheme.accent} style={styles.cardCornerTR} />

                  {receivedTo ? (
                    <View style={{
                      backgroundColor: receivedTheme.accent + '20',
                      borderColor: receivedTheme.accent,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      alignSelf: 'flex-start',
                      marginBottom: 8,
                    }}>
                      <Text style={{ color: receivedTheme.accent, fontSize: 12, fontWeight: 'bold', fontStyle: 'italic' }} numberOfLines={1}>
                        For: {receivedTo}
                      </Text>
                    </View>
                  ) : null}

                  <Text style={[styles.openedGreeting, { color: receivedTheme.accent }]}>✨ Assalamu Alaikum ✨</Text>
                  
                  <Text style={styles.openedMsg}>"{receivedMessage}"</Text>

                  <View style={styles.openedDivider} />

                  {/* Arabic Text */}
                  <Text style={styles.openedArabicText}>
                    {receivedArabic}
                  </Text>

                  {/* English Text */}
                  <Text style={styles.openedEnglishText}>
                    {receivedEnglish}
                  </Text>

                  <Text style={[styles.openedRef, { color: receivedTheme.accent }]}>
                    — {receivedRef}
                  </Text>

                  {receivedFrom ? (
                    <View style={{
                      backgroundColor: receivedTheme.accent + '20',
                      borderColor: receivedTheme.accent,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      alignSelf: 'flex-end',
                      marginTop: 12,
                    }}>
                      <Text style={{ color: receivedTheme.accent, fontSize: 12, fontWeight: 'bold', fontStyle: 'italic' }} numberOfLines={1}>
                        With Duas: {receivedFrom}
                      </Text>
                    </View>
                  ) : null}

                  <Pressable
                    onPress={() => setMode('create')}
                    style={[styles.replyBtn, { backgroundColor: colors.primary }]}
                  >
                    <Ionicons name="paper-plane" size={18} color="#fff" />
                    <Text style={styles.replyBtnText}>Send a Gift Back</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </Animated.View>
          )}
        </ImageBackground>
      )}

      {/* ── MODE: CREATE GIFT (Packaging Interface) ── */}
      {mode === 'create' && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Spiritual Gift Dispatcher</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Package custom blessings, Quran verses, or Duas in an elegant, interactive web landing page card to share with friends.
            </Text>
          </View>

          {/* ── Card Design Preview (ViewShot) ── */}
          <View style={styles.previewWrapper}>
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1.0 }}
              style={styles.viewShotCard}
            >
              <ImageBackground
                source={activeTheme.bgSource}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
              >
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: activeTheme.isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.1)' }]} />
                
                <View style={[styles.previewPaper, {
                    borderColor: activeTheme.metallic
                      ? (activeTheme.metalGradient?.[1] ?? activeTheme.accent)
                      : activeTheme.accent,
                    borderWidth: activeTheme.metallic ? 2.5 : 1.5,
                    shadowColor: activeTheme.metallic ? activeTheme.accent : 'transparent',
                    shadowOpacity: activeTheme.metallic ? 0.6 : 0,
                    shadowRadius: activeTheme.metallic ? 12 : 0,
                    elevation: activeTheme.metallic ? 8 : 2,
                  }]}>
                  {toName ? (
                    <View style={{
                      backgroundColor: activeTheme.accent + '20',
                      borderColor: activeTheme.accent,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      alignSelf: 'flex-start',
                      marginBottom: 8,
                    }}>
                      <Text style={{ color: activeTheme.accent, fontSize: 11, fontWeight: 'bold', fontStyle: 'italic' }} numberOfLines={1}>
                        For: {toName}
                      </Text>
                    </View>
                  ) : null}

                  <Text style={[styles.previewGreeting, { color: activeTheme.accent }]}>🌙 A Gift For You</Text>
                  
                  <Text style={[styles.previewMsg, { color: activeTheme.isDark ? '#fff' : '#111' }]} numberOfLines={3}>
                    "{customMsg || 'May Allah bless you.'}"
                  </Text>

                  <View style={[styles.previewDivider, { backgroundColor: activeTheme.accent }]} />

                  {/* Previewing selected verse or Dua */}
                  <Text style={[styles.previewArabic, { color: activeTheme.isDark ? '#fff' : '#111' }]} numberOfLines={3}>
                    {selectedDuaId ? PRESET_DUAS.find(d => d.id === selectedDuaId)?.arabic : verseArabic}
                  </Text>

                  <Text style={[styles.previewRef, { color: activeTheme.accent }]}>
                    — {selectedDuaId ? PRESET_DUAS.find(d => d.id === selectedDuaId)?.title : verseRef}
                  </Text>

                  {fromName ? (
                    <View style={{
                      backgroundColor: activeTheme.accent + '20',
                      borderColor: activeTheme.accent,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      alignSelf: 'flex-end',
                      marginTop: 10,
                    }}>
                      <Text style={{ color: activeTheme.accent, fontSize: 11, fontWeight: 'bold', fontStyle: 'italic' }} numberOfLines={1}>
                        With Duas: {fromName}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </ImageBackground>
            </ViewShot>
          </View>

          {/* ── Form Inputs ── */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>1. Personalized Message</Text>
            
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>To (optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                  value={toName}
                  onChangeText={setToName}
                  placeholder="Friend name..."
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>From (optional)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                  value={fromName}
                  onChangeText={setFromName}
                  placeholder="Your name..."
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Greeting message</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={customMsg}
              onChangeText={setCustomMsg}
              multiline
              maxLength={150}
              placeholder="Write a custom blessing/greeting..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* ── Content Type Selection ── */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>2. Select Sacred Content</Text>
            
            <View style={styles.choiceRow}>
              <Pressable
                onPress={() => setSelectedDuaId('')}
                style={[styles.choiceBtn, !selectedDuaId && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.choiceBtnText, { color: !selectedDuaId ? '#fff' : colors.textSecondary }]}>
                  Quran Verse
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedDuaId('protection')}
                style={[styles.choiceBtn, selectedDuaId !== '' && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.choiceBtnText, { color: selectedDuaId !== '' ? '#fff' : colors.textSecondary }]}>
                  Prophetic Dua
                </Text>
              </Pressable>
            </View>

            {/* Quran Verse Selector */}
            {!selectedDuaId ? (
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Select Surah</Text>
                <Pressable
                  onPress={() => setSurahModalVisible(true)}
                  style={[styles.dropdownBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
                    {selectedSurah.id}. {selectedSurah.name_en}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </Pressable>

                <Text style={[styles.label, { color: colors.textSecondary, marginTop: 10 }]}>Ayah Number</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
                  value={ayahNum}
                  onChangeText={setAyahNum}
                  keyboardType="number-pad"
                  placeholder={`1 – ${selectedSurah.ayahs}`}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            ) : (
              // Preset Dua Selector
              <View style={{ marginTop: 12 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Choose Dua Preset</Text>
                <Pressable
                  onPress={() => setDuaModalVisible(true)}
                  style={[styles.dropdownBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
                    {PRESET_DUAS.find(d => d.id === selectedDuaId)?.title || 'Select a Prophetic Dua'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </Pressable>
              </View>
            )}
          </View>

          {/* ── Theme Customization ── */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>3. Theme Presets</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themePalette}>
              {THEMES.map(theme => (
                <Pressable
                  key={theme.id}
                  onPress={() => setSelectedThemeId(theme.id)}
                  style={[styles.themePill, {
                    borderColor: selectedThemeId === theme.id
                      ? (theme.metallic ? theme.accent : colors.primary)
                      : colors.border,
                    borderWidth: selectedThemeId === theme.id ? 2 : 1,
                    backgroundColor: colors.background,
                  }]}
                >
                  {/* Color dot — metallic uses a multi-stop gradient visual */}
                  {theme.metallic && theme.metalGradient ? (
                    <View style={{ width: 14, height: 14, borderRadius: 7, overflow: 'hidden', marginRight: 2 }}>
                      <View style={[styles.colorDot, {
                        backgroundColor: theme.metalGradient[1],
                        borderWidth: 1.5,
                        borderColor: theme.metalGradient[2],
                      }]} />
                    </View>
                  ) : (
                    <View style={[styles.colorDot, { backgroundColor: theme.accent }]} />
                  )}
                  <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>{theme.name}</Text>
                  {theme.metallic && (
                    <View style={{ backgroundColor: theme.accent + '30', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1, marginLeft: 4 }}>
                      <Text style={{ color: theme.accent, fontSize: 9, fontWeight: '800' }}>PREMIUM</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* ── Share / Send Action ── Two explicit buttons ── */}
          <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 8, marginTop: 4 }}>
            {/* Image Share Button */}
            <Pressable
              onPress={handleShareAsImage}
              disabled={sharing}
              style={[styles.dispatchBtn, { backgroundColor: activeTheme.accent, flex: 1, minHeight: 52 }]}
            >
              {sharing ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <>
                  <Ionicons name="image-outline" size={20} color="#000" />
                  <Text style={[styles.dispatchBtnText, { color: '#000', fontSize: 13 }]}>Share as Image</Text>
                </>
              )}
            </Pressable>

            {/* Text / Link Share Button */}
            <Pressable
              onPress={handleShareTextLink}
              disabled={sharing}
              style={[styles.dispatchBtn, { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: activeTheme.accent, flex: 1, minHeight: 52 }]}
            >
              {sharing ? (
                <ActivityIndicator color={activeTheme.accent} size="small" />
              ) : (
                <>
                  <Ionicons name="paper-plane-outline" size={20} color={activeTheme.accent} />
                  <Text style={[styles.dispatchBtnText, { color: activeTheme.accent, fontSize: 13 }]}>Share Text/Link</Text>
                </>
              )}
            </Pressable>
          </View>

        </ScrollView>
      )}

      {/* ── Surah Dropdown Modal ── */}
      <Modal
        visible={surahModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSurahModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Surah</Text>
              <Pressable onPress={() => setSurahModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              value={surahSearch}
              onChangeText={setSurahSearch}
              placeholder="Search surah..."
              placeholderTextColor={colors.textMuted}
            />
            <FlatList
              data={filteredSurahs}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedSurahId(item.id);
                    setAyahNum('1');
                    setSurahModalVisible(false);
                    setSurahSearch('');
                  }}
                  style={[styles.surahRow, { borderBottomColor: colors.border, backgroundColor: item.id === selectedSurahId ? colors.primary + '15' : 'transparent' }]}
                >
                  <View style={[styles.surahNumBadge, { backgroundColor: item.id === selectedSurahId ? colors.primary : colors.background }]}>
                    <Text style={[styles.surahNum, { color: item.id === selectedSurahId ? '#fff' : colors.textMuted }]}>{item.id}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.surahName, { color: colors.textPrimary }]}>{item.name_en}</Text>
                  </View>
                  <Text style={[styles.surahArabicName, { color: item.id === selectedSurahId ? colors.primary : colors.textSecondary }]}>{item.name_ar}</Text>
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>

      {/* ── Dua Dropdown Modal ── */}
      <Modal
        visible={duaModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDuaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select Prophetic Dua</Text>
              <Pressable onPress={() => setDuaModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>
            <FlatList
              data={PRESET_DUAS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedDuaId(item.id);
                    setDuaModalVisible(false);
                  }}
                  style={[styles.surahRow, { borderBottomColor: colors.border, backgroundColor: item.id === selectedDuaId ? colors.primary + '15' : 'transparent' }]}
                >
                  <View style={{ flex: 1, paddingVertical: 4 }}>
                    <Text style={[styles.surahName, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={{ fontFamily: FONTS.english, fontSize: 11, color: colors.textMuted, marginTop: 3 }} numberOfLines={1}>
                      {item.english}
                    </Text>
                  </View>
                  <Ionicons
                    name={item.id === selectedDuaId ? "checkmark-circle" : "ellipse-outline"}
                    size={20}
                    color={item.id === selectedDuaId ? colors.primary : colors.textMuted}
                  />
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
};

// ── Styles ──
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },

  header: { paddingHorizontal: 4, marginVertical: 6 },
  title: { fontFamily: FONTS.english, fontSize: 24, fontWeight: '800' },
  subtitle: { fontFamily: FONTS.english, fontSize: 13, lineHeight: 18, marginTop: 4 },

  previewWrapper: { alignItems: 'center', marginVertical: 10 },
  viewShotCard: {
    width: 320,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  previewPaper: {
    flex: 1,
    margin: 20,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  previewGreeting: { fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  previewMsg: { fontFamily: FONTS.english, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  previewDivider: { height: 1.5, width: 40, marginVertical: 12 },
  previewArabic: { fontFamily: 'UthmanicHafs', fontSize: 18, textAlign: 'center', lineHeight: 28, marginVertical: 4 },
  previewRef: { fontFamily: FONTS.english, fontSize: 10, fontWeight: '700', marginTop: 8 },

  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  sectionTitle: { fontFamily: FONTS.english, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 10 },
  label: { fontFamily: FONTS.english, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: FONTS.english },
  textArea: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, minHeight: 64, textAlignVertical: 'top', fontFamily: FONTS.english },
  
  choiceRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  choiceBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  choiceBtnText: { fontFamily: FONTS.english, fontSize: 12, fontWeight: '600' },
  
  duaPresetItem: { borderWidth: 1, padding: 10, borderRadius: 10, marginBottom: 8 },
  duaPresetTitle: { fontFamily: FONTS.english, fontSize: 12, fontWeight: '700' },
  duaPresetSub: { fontFamily: FONTS.english, fontSize: 10, marginTop: 2 },
  
  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12 },
  dropdownText: { fontFamily: FONTS.english, fontSize: 14 },

  themePalette: { flexDirection: 'row', paddingVertical: 4 },
  themePill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  themeLabel: { fontFamily: FONTS.english, fontSize: 12, fontWeight: '700' },

  dispatchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, gap: 8, marginTop: 4 },
  dispatchBtnText: { color: '#fff', fontFamily: FONTS.english, fontSize: 14, fontWeight: '700' },

  // Opening screen received
  openingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  giftTitle: { color: '#fff', fontSize: 24, fontWeight: '800', fontFamily: FONTS.english, textAlign: 'center' },
  giftSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontFamily: FONTS.english, textAlign: 'center' },
  giftBoxWrapper: { marginTop: 40, alignItems: 'center' },
  glowRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, opacity: 0.3, top: -20 },
  tapPrompt: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 14, letterSpacing: 2, textTransform: 'uppercase' },

  particle: { position: 'absolute', width: 8, height: 8, borderRadius: 4, top: '50%', left: '50%' },

  // Content Card received
  contentCardContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  openedScroll: { flexGrow: 1, justifyContent: 'center' },
  giftPaper: {
    backgroundColor: '#0a0d14',
    borderWidth: 2,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: 'relative',
  },
  cardCornerTL: { position: 'absolute', top: 16, left: 16, opacity: 0.6 },
  cardCornerTR: { position: 'absolute', top: 16, right: 16, opacity: 0.6 },
  openedGreeting: { fontSize: 15, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  openedMsg: { color: '#fff', fontFamily: FONTS.english, fontSize: 14, textAlign: 'center', lineHeight: 22 },
  openedDivider: { height: 1.5, width: 80, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  openedArabicText: { fontFamily: 'UthmanicHafs', fontSize: 26, color: '#fff', textAlign: 'center', lineHeight: 46, marginBottom: 16 },
  openedEnglishText: { fontFamily: FONTS.english, fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20 },
  openedRef: { fontFamily: FONTS.english, fontSize: 11, fontWeight: '700', marginTop: 14 },
  replyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 8, marginTop: 24 },
  replyBtnText: { color: '#fff', fontFamily: FONTS.english, fontWeight: '700', fontSize: 13 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, height: '82%', flexDirection: 'column' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontFamily: FONTS.english, fontSize: 18, fontWeight: '700' },
  searchInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontFamily: FONTS.english, fontSize: 14, marginBottom: 8 },
  surahRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, gap: 10 },
  surahNumBadge: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  surahNum: { fontFamily: FONTS.english, fontSize: 13, fontWeight: '700' },
  surahName: { fontFamily: FONTS.english, fontSize: 14, fontWeight: '600' },
  surahArabicName: { fontFamily: 'UthmanicHafs', fontSize: 18 },
});
