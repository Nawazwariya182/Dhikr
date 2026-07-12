import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS, getArabicFontFamily } from '../utils/constants';

const { width: screenWidth } = Dimensions.get('window');
const columnWidth = (screenWidth - 48) / 2;

// Calculate strict 9:16 dimensions for the grid card thumbnails to crop them beautifully from center
const thumbnailHeight = columnWidth * (16 / 9);

interface WallpaperOption {
  id: string;
  title: string;
  type: 'image' | 'gradient';
  source?: any;             // for image background
  colors?: [string, string, ...string[]]; // for gradient background
  overlayText: string;      // Correct Arabic calligraphy overlaid in code
  overlaySub: string;       // English translation subtext
  isDark: boolean;          // Controls contrast for text overlay
}

const WALLPAPERS: WallpaperOption[] = [
  // ── 15 Image-Based Calligraphy Wallpapers (No AI text) ──
  {
    id: 'wp_01',
    title: 'Bismillah Gold',
    type: 'image',
    source: require('../../assets/backgrounds/bg_gold_black.jpg'),
    overlayText: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    overlaySub: 'In the name of Allah, Most Gracious, Most Merciful',
    isDark: true
  },
  {
    id: 'wp_02',
    title: 'Sabr Olive Gold',
    type: 'image',
    source: require('../../assets/backgrounds/bg_olive_gold.jpg'),
    overlayText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    overlaySub: 'Indeed, with hardship comes ease',
    isDark: false
  },
  {
    id: 'wp_03',
    title: 'Shukr Rust',
    type: 'image',
    source: require('../../assets/backgrounds/bg_rust_gold.jpg'),
    overlayText: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    overlaySub: 'If you are grateful, I will surely increase you',
    isDark: true
  },
  {
    id: 'wp_04',
    title: 'Kaaba Stars',
    type: 'image',
    source: require('../../assets/backgrounds/bg_indigo_stars.jpg'),
    overlayText: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    overlaySub: 'There is no deity but Allah',
    isDark: true
  },
  {
    id: 'wp_05',
    title: 'Madinah Green starlit',
    type: 'image',
    source: require('../../assets/backgrounds/bg_mosque_night_sky.jpg'),
    overlayText: 'مُحَمَّدٌ رَّسُولُ ٱللَّهِ',
    overlaySub: 'Muhammad is the Messenger of Allah',
    isDark: true
  },
  {
    id: 'wp_06',
    title: 'Al-Faatiha Parchment',
    type: 'image',
    source: require('../../assets/backgrounds/bg_parchment.jpg'),
    overlayText: 'ٱلْحَمْدُ لِلَّٰهِ رَبِّ ٱلْعَٰلَمِينَ',
    overlaySub: 'All praise is due to Allah, Lord of the worlds',
    isDark: false
  },
  {
    id: 'wp_07',
    title: 'Ayat al-Kursi Navy',
    type: 'image',
    source: require('../../assets/backgrounds/bg_islamic_star_navy.jpg'),
    overlayText: 'ٱللَّٰهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَيُّ ٱلْقَيُّومُ',
    overlaySub: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence',
    isDark: true
  },
  {
    id: 'wp_08',
    title: 'Forgiveness Burgundy',
    type: 'image',
    source: require('../../assets/backgrounds/bg_burgundy_floral.jpg'),
    overlayText: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    overlaySub: 'I seek forgiveness from Allah',
    isDark: true
  },
  {
    id: 'wp_09',
    title: 'Hasbunallah Charcoal',
    type: 'image',
    source: require('../../assets/backgrounds/bg_charcoal_gold.jpg'),
    overlayText: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ',
    overlaySub: 'Sufficient is Allah for us, and He is the best disposer of affairs',
    isDark: true
  },
  {
    id: 'wp_10',
    title: 'La Hawla Teal',
    type: 'image',
    source: require('../../assets/backgrounds/bg_geom_teal.jpg'),
    overlayText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ',
    overlaySub: 'There is no power or strength except with Allah',
    isDark: true
  },
  {
    id: 'wp_11',
    title: 'Jannah Clouds',
    type: 'image',
    source: require('../../assets/backgrounds/bg_pastel_cloud.jpg'),
    overlayText: 'أَدْخِلْنِي الْجَنَّةَ',
    overlaySub: 'O Allah, admit me to Paradise',
    isDark: false
  },
  {
    id: 'wp_12',
    title: 'Knowledge Amethyst',
    type: 'image',
    source: require('../../assets/backgrounds/bg_amethyst_gold.jpg'),
    overlayText: 'رَبِّ زِدْنِي عِلْمًا',
    overlaySub: 'My Lord, increase me in knowledge',
    isDark: true
  },
  {
    id: 'wp_13',
    title: 'Peace Mosaic',
    type: 'image',
    source: require('../../assets/backgrounds/bg_morocco_tile.jpg'),
    overlayText: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
    overlaySub: 'Peace - a word from a Merciful Lord',
    isDark: true
  },
  {
    id: 'wp_14',
    title: 'Praise Emerald',
    type: 'image',
    source: require('../../assets/backgrounds/bg_arabesque_emerald.jpg'),
    overlayText: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    overlaySub: 'Glory be to Allah, and praise is due to Him',
    isDark: true
  },
  {
    id: 'wp_15',
    title: 'Light Marble',
    type: 'image',
    source: require('../../assets/backgrounds/bg_marble_dark.jpg'),
    overlayText: 'ٱللَّٰهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ',
    overlaySub: 'Allah is the Light of the heavens and the earth',
    isDark: true
  },

  {
    id: 'wp_new_01',
    title: 'Geometry Gold',
    type: 'image',
    source: require('../../assets/backgrounds/wp_01_geometry_gold_1783750733413.jpg'),
    overlayText: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    overlaySub: 'In the name of Allah, Most Gracious, Most Merciful',
    isDark: true
  },
  {
    id: 'wp_new_02',
    title: 'Mosque Sunset',
    type: 'image',
    source: require('../../assets/backgrounds/wp_02_mosque_sunset_1783750743061.jpg'),
    overlayText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    overlaySub: 'Indeed, with hardship comes ease',
    isDark: true
  },
  {
    id: 'wp_new_03',
    title: 'Kaaba Cosmos',
    type: 'image',
    source: require('../../assets/backgrounds/wp_04_kaaba_stars.jpg'),
    overlayText: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    overlaySub: 'There is no deity but Allah',
    isDark: true
  },
  {
    id: 'wp_new_04',
    title: 'Madinah Starlight',
    type: 'image',
    source: require('../../assets/backgrounds/wp_07_madinah_green.jpg'),
    overlayText: 'مُحَمَّدٌ رَّسُولُ ٱللَّهِ',
    overlaySub: 'Muhammad is the Messenger of Allah',
    isDark: true
  },
  {
    id: 'wp_new_05',
    title: 'Pastel Floral',
    type: 'image',
    source: require('../../assets/backgrounds/wp_16_flower_mosque.jpg'),
    overlayText: 'سُبْحَانَ ٱللَّٰهِ',
    overlaySub: 'Glory be to Allah',
    isDark: false
  },
  {
    id: 'wp_new_06',
    title: 'Ramadan Lantern',
    type: 'image',
    source: require('../../assets/backgrounds/wp_17_lantern_glow.jpg'),
    overlayText: 'ٱللَّٰهُ أَكْبَرُ',
    overlaySub: 'Allah is the Greatest',
    isDark: true
  },
  {
    id: 'wp_new_07',
    title: 'Kaaba Watercolor',
    type: 'image',
    source: require('../../assets/backgrounds/wp_18_watercolor_kaaba.jpg'),
    overlayText: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    overlaySub: 'There is no deity but Allah',
    isDark: true
  },
  {
    id: 'wp_new_08',
    title: 'Emerald Star Pattern',
    type: 'image',
    source: require('../../assets/backgrounds/wp_19_moroccan_emerald.jpg'),
    overlayText: 'ٱلْحَمْدُ لِلَّٰهِ',
    overlaySub: 'Praise be to Allah',
    isDark: true
  },
  {
    id: 'wp_new_09',
    title: 'Gold Line Arabesque',
    type: 'image',
    source: require('../../assets/backgrounds/wp_20_gold_line_arabesque.jpg'),
    overlayText: 'فَٱذْكُرُونِيٓ أَذْكُرْكُمْ',
    overlaySub: 'So remember Me; I will remember you',
    isDark: true
  },
  {
    id: 'wp_new_10',
    title: 'Madinah Green Dome',
    type: 'image',
    source: require('../../assets/backgrounds/wp_21_madinah_dome.jpg'),
    overlayText: 'صَلَّىٰ ٱللَّٰهُ عَلَيْهِ وَسَلَّمَ',
    overlaySub: 'May Allah send blessings and peace upon him',
    isDark: false
  },
  {
    id: 'wp_new_11',
    title: 'Cream Watercolor Floral',
    type: 'image',
    source: require('../../assets/backgrounds/wp_22_floral_cream.jpg'),
    overlayText: 'رَبِّ زِدْنِي عِلْمًا',
    overlaySub: 'My Lord, increase me in knowledge',
    isDark: false
  },
  {
    id: 'wp_new_12',
    title: 'Archway Sunset',
    type: 'image',
    source: require('../../assets/backgrounds/wp_23_arch_sunset.jpg'),
    overlayText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    overlaySub: 'Indeed, with hardship comes ease',
    isDark: true
  },
  {
    id: 'wp_new_13',
    title: 'Teal Gold Geometry',
    type: 'image',
    source: require('../../assets/backgrounds/wp_24_geometry_emerald.jpg'),
    overlayText: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    overlaySub: 'If you are grateful, I will surely increase you',
    isDark: true
  },
  {
    id: 'wp_new_14',
    title: 'Crescent Moon & Clouds',
    type: 'image',
    source: require('../../assets/backgrounds/wp_25_moon_clouds.jpg'),
    overlayText: 'سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ',
    overlaySub: 'Peace - a word from a Merciful Lord',
    isDark: false
  },
  {
    id: 'wp_new_15',
    title: 'Mosque Sage Green',
    type: 'image',
    source: require('../../assets/backgrounds/wp_26_mosque_silhouette.jpg'),
    overlayText: 'ٱللَّٰهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ',
    overlaySub: 'Allah is the Light of the heavens and the earth',
    isDark: false
  },
  {
    id: 'wp_new_16',
    title: 'Ink Waves Blue Gold',
    type: 'image',
    source: require('../../assets/backgrounds/wp_27_abstract_waves.jpg'),
    overlayText: 'فَٱصْبِرْ صَبْرًا جَمِيلًا',
    overlaySub: 'So be patient with beautiful patience',
    isDark: true
  },
  {
    id: 'wp_new_17',
    title: 'Navy Gold Stars',
    type: 'image',
    source: require('../../assets/backgrounds/wp_28_stars_pattern.jpg'),
    overlayText: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ',
    overlaySub: 'Sufficient is Allah for us, and He is the best disposer of affairs',
    isDark: true
  },
  {
    id: 'wp_new_18',
    title: 'Olive Marble Gold',
    type: 'image',
    source: require('../../assets/backgrounds/wp_29_light_leaves.jpg'),
    overlayText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِٱللَّٰهِ',
    overlaySub: 'There is no power or strength except with Allah',
    isDark: false
  },
  {
    id: 'wp_new_19',
    title: 'Rose Gold Mandala',
    type: 'image',
    source: require('../../assets/backgrounds/wp_30_rose_gold_islamic.jpg'),
    overlayText: 'إِنَّ ٱللَّٰهَ مَعَ ٱلصَّٰبِرِينَ',
    overlaySub: 'Indeed, Allah is with the patient',
    isDark: false
  },

  // ── 13 Premium Gradient Calligraphy Wallpapers (Total 28) ──
  {
    id: 'wp_16',
    title: 'Dhikr Midnight',
    type: 'gradient',
    colors: ['#050B1A', '#0F1E36', '#1A3254'],
    overlayText: 'فَٱذْكُرُونِيٓ أَذْكُرْكُمْ',
    overlaySub: 'So remember Me; I will remember you',
    isDark: true
  },
  {
    id: 'wp_17',
    title: 'Forgiving Sunset',
    type: 'gradient',
    colors: ['#140202', '#360909', '#5E1717'],
    overlayText: 'إِنَّ ٱللَّٰهَ غَفُورٌ رَّحِيمٌ',
    overlaySub: 'Indeed, Allah is Forgiving and Merciful',
    isDark: true
  },
  {
    id: 'wp_18',
    title: 'Trust Ocean',
    type: 'gradient',
    colors: ['#020F12', '#0A2D35', '#164E5B'],
    overlayText: 'وَعَلَى ٱللَّٰهِ فَتَوَكَّلُوٓاْ',
    overlaySub: 'And upon Allah put your trust',
    isDark: true
  },
  {
    id: 'wp_19',
    title: 'Guidance Forest',
    type: 'gradient',
    colors: ['#05140B', '#0E2E1A', '#1C4E2D'],
    overlayText: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
    overlaySub: 'Guide us to the straight path',
    isDark: true
  },
  {
    id: 'wp_20',
    title: 'Mercy Violet',
    type: 'gradient',
    colors: ['#0E021A', '#240A3E', '#401763'],
    overlayText: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
    overlaySub: 'My mercy encompasses all things',
    isDark: true
  },
  {
    id: 'wp_21',
    title: 'Victory Ember',
    type: 'gradient',
    colors: ['#1A0F03', '#3B240B', '#633E17'],
    overlayText: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا',
    overlaySub: 'Indeed, We have granted you a clear triumph',
    isDark: true
  },
  {
    id: 'wp_22',
    title: 'Guardian Slate',
    type: 'gradient',
    colors: ['#0D1117', '#1F2937', '#374151'],
    overlayText: 'فَٱللَّٰهُ خَيْرٌ حَٰفِظًا',
    overlaySub: 'But Allah is the best guardian',
    isDark: true
  },
  {
    id: 'wp_23',
    title: 'Hope Rose Gold',
    type: 'gradient',
    colors: ['#1F0E16', '#4E2436', '#7D405B'],
    overlayText: 'لَا تَقْنَطُواْ مِن رَّحْمَةِ ٱللَّٰهِ',
    overlaySub: 'Do not despair of the mercy of Allah',
    isDark: true
  },
  {
    id: 'wp_24',
    title: 'Unity Gold',
    type: 'gradient',
    colors: ['#1A1600', '#423A0B', '#70641A'],
    overlayText: 'قُلْ هُوَ ٱللَّٰهُ أَحَدٌ',
    overlaySub: 'Say, He is Allah, the One',
    isDark: true
  },
  {
    id: 'wp_25',
    title: 'Rest Jade',
    type: 'gradient',
    colors: ['#031A0B', '#143C1F', '#2C6339'],
    overlayText: 'وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّٰهِ',
    overlaySub: 'And their hearts find rest in the remembrance of Allah',
    isDark: true
  },
  {
    id: 'wp_26',
    title: 'Dawn Breath',
    type: 'gradient',
    colors: ['#2E1B00', '#613E0E', '#9E6D24'],
    overlayText: 'وَٱلصُّبْحِ إِذَا تَنَفَّسَ',
    overlaySub: 'And by the dawn when it breathes',
    isDark: true
  },
  {
    id: 'wp_27',
    title: 'Night Cover',
    type: 'gradient',
    colors: ['#05000C', '#120224', '#260B47'],
    overlayText: 'وَٱلَّيْلِ إِذَا يَغْشَىٰ',
    overlaySub: 'And by the night when it covers',
    isDark: true
  },
  {
    id: 'wp_28',
    title: 'Favors Sakura',
    type: 'gradient',
    colors: ['#FFF5F5', '#FFE3E3', '#FFC9C9'],
    overlayText: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    overlaySub: 'So which of the favors of your Lord would you deny?',
    isDark: false
  },
];

export const WallpaperScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const viewShotRef = useRef<ViewShot>(null);
  
  const [selectedWp, setSelectedWp] = useState<WallpaperOption | null>(null);
  const [includeCalligraphy, setIncludeCalligraphy] = useState(true);
  const [loading, setLoading] = useState(false);

  // Wallpaper text customizer states
  const [isEditing, setIsEditing] = useState(false);
  const [customArabicText, setCustomArabicText] = useState('');
  const [customEnglishText, setCustomEnglishText] = useState('');
  const [textSize, setTextSize] = useState(30);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textShadowEnabled, setTextShadowEnabled] = useState(true);
  const [englishTypography, setEnglishTypography] = useState<'sans-serif' | 'serif' | 'light' | 'monospace'>('sans-serif');
  const [arabicFontFamily, setArabicFontFamily] = useState<'uthmani' | 'indopak'>('uthmani');

  const handleSelectWp = (wp: WallpaperOption) => {
    setSelectedWp(wp);
    setCustomArabicText(wp.overlayText);
    setCustomEnglishText(wp.overlaySub);
    setTextSize(30);
    setTextColor(wp.isDark ? '#ffffff' : '#111111');
    setTextShadowEnabled(wp.isDark);
    setIsEditing(false);
    setIncludeCalligraphy(true);
    setEnglishTypography('sans-serif');
    setArabicFontFamily('uthmani');
  };

  const captureWallpaper = async (): Promise<string | null> => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      return uri || null;
    } catch (e) {
      console.warn('ViewShot Capture Error:', e);
      return null;
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Allow access to save images to your gallery.');
        return;
      }
      
      const uri = await captureWallpaper();
      
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Saved!', includeCalligraphy ? 'Wallpaper with calligraphy saved!' : 'Clean wallpaper background saved!');
      } else {
        Alert.alert('Error', 'Failed to crop and save wallpaper.');
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to download wallpaper.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedWp) return;
    setLoading(true);
    try {
      const uri = await captureWallpaper();
      
      if (uri) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Share ${selectedWp.title}`,
        });
      } else {
        Alert.alert('Error', 'Failed to share wallpaper.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to share wallpaper.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseInCardCreator = () => {
    setSelectedWp(null);
    (navigation as any).navigate('WisdomCard');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      
      {/* Intro Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>AI Wallpapers</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          47 premium Islamic presets. Tap to preview full lock-screen, toggle Calligraphy ON/OFF, and save.
        </Text>
      </View>

      {/* Grid of Wallpapers */}
      <FlatList
        data={WALLPAPERS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              handleSelectWp(item);
            }}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
            ]}
          >
            {/* Strict 9:16 cropped container for thumbnails to center the 1:1 backgrounds */}
            <View style={styles.thumbnailWrapper}>
              {item.type === 'image' ? (
                <Image
                  source={item.source}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={item.colors!}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.thumbnail}
                />
              )}
              {/* Calligraphy Overlay for preview */}
              <View style={styles.thumbnailOverlay}>
                <Text style={[styles.thumbnailOverlayText, { color: item.isDark ? '#fff' : '#111' }]} numberOfLines={1}>
                  {item.overlayText}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Ionicons name="eye-outline" size={14} color={colors.primary} />
            </View>
          </Pressable>
        )}
      />

      {/* Redesigned 9:16 Preview Modal with Text Customizer */}
      <Modal
        visible={selectedWp !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedWp(null)}
      >
        {selectedWp && (() => {
          const { width: sW, height: sH } = Dimensions.get('window');
          const previewHeight = sH * 0.48;
          const previewWidth = previewHeight * (9 / 16);
          return (
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={[styles.modalHeader, { paddingTop: insets.top + 8 }]}>
                <Pressable
                  onPress={() => setSelectedWp(null)}
                  style={styles.closeHeaderBtn}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  {isEditing ? 'Customize Wallpaper' : selectedWp.title}
                </Text>
                <View style={{ width: 44 }} />
              </View>

              {/* Centered 9:16 aspect ratio ViewShot container */}
              <View style={[styles.previewCardContainer, { borderRadius: 20, overflow: 'hidden' }]}>
                <ViewShot
                  ref={viewShotRef}
                  options={{ format: 'png', quality: 1.0 }}
                  style={{
                    width: previewWidth,
                    height: previewHeight,
                    backgroundColor: '#090d16',
                  }}
                >
                  {/* Wallpaper Background Image / Gradient */}
                  {selectedWp.type === 'image' ? (
                    <Image
                      source={selectedWp.source}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <LinearGradient
                      colors={selectedWp.colors!}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                  
                  {/* Overlay for contrast */}
                  <View style={[StyleSheet.absoluteFillObject, { backgroundColor: selectedWp.isDark ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.06)' }]} />

                  {/* Calligraphy Overlay Design */}
                  {includeCalligraphy && (
                    <View style={styles.calligraphyDesignContainer}>
                      <Text style={[styles.decorativeStar, { color: textColor === '#ffffff' || textColor === '#fef08a' ? '#f59e0b' : '#92400e', fontSize: 13 }]}>✦</Text>
                      
                      <Text 
                        style={[
                          styles.modalArabicText, 
                          { 
                            color: textColor, 
                            fontFamily: getArabicFontFamily(arabicFontFamily),
                            fontSize: Math.min(textSize, previewWidth * 0.12),
                            lineHeight: Math.min(textSize * 1.4, previewWidth * 0.16),
                            textShadowColor: textShadowEnabled ? 'rgba(0,0,0,0.85)' : 'transparent',
                            textShadowRadius: textShadowEnabled ? 5 : 0,
                            paddingHorizontal: 8,
                          }
                        ]}
                        numberOfLines={3}
                      >
                        {customArabicText}
                      </Text>
                      
                      <View style={[styles.overlayLine, { backgroundColor: textColor === '#ffffff' || textColor === '#fef08a' ? '#f59e0b' : '#92400e', marginVertical: 6 }]} />
                      
                      <Text 
                        style={[
                          styles.modalEnglishSub, 
                          { 
                            color: textColor === '#ffffff' || textColor === '#fef08a' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)',
                            fontFamily: englishTypography === 'serif' ? (Platform.OS === 'ios' ? 'Georgia' : 'serif') : englishTypography === 'monospace' ? (Platform.OS === 'ios' ? 'Courier' : 'monospace') : FONTS.english,
                            fontWeight: englishTypography === 'light' ? '300' : 'normal',
                            fontSize: Math.min(12, previewWidth * 0.045),
                            lineHeight: Math.min(16, previewWidth * 0.06),
                            textShadowColor: textShadowEnabled ? 'rgba(0,0,0,0.6)' : 'transparent',
                            textShadowRadius: textShadowEnabled ? 3 : 0,
                            paddingHorizontal: 12,
                          }
                        ]}
                        numberOfLines={3}
                      >
                        {customEnglishText}
                      </Text>

                      <Text style={[styles.decorativeStar, { color: textColor === '#ffffff' || textColor === '#fef08a' ? '#f59e0b' : '#92400e', fontSize: 13, marginTop: 4 }]}>✦</Text>
                    </View>
                  )}
                </ViewShot>
              </View>

              {/* Bottom Controls / Customizer Sheet */}
              <View style={[styles.bottomControlsSheet, { paddingBottom: insets.bottom + 16 }]}>
                {isEditing ? (
                  // Customizer Edit Mode Layout
                  <View style={{ width: '100%' }}>
                    <Text style={styles.editorSectionTitle}>Customize Text Overlay</Text>
                    <ScrollView style={styles.editorScrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                      <Text style={styles.editorInputLabel}>Arabic Calligraphy / Ayat</Text>
                      <TextInput
                        style={[styles.editorTextInput, { fontFamily: 'UthmanicHafs1Ver18', fontSize: 16 }]}
                        value={customArabicText}
                        onChangeText={setCustomArabicText}
                        multiline
                        placeholder="Type custom Arabic text..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                      />

                      <Text style={styles.editorInputLabel}>English Translation / Subtext</Text>
                      <TextInput
                        style={styles.editorTextInput}
                        value={customEnglishText}
                        onChangeText={setCustomEnglishText}
                        multiline
                        placeholder="Type custom English subtext..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                      />

                      <View style={styles.styleControlsRow}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                          <Text style={styles.editorInputLabel}>Font Size ({textSize}px)</Text>
                          <View style={styles.fontSizeStepper}>
                            <Pressable 
                              onPress={() => setTextSize(Math.max(14, textSize - 2))}
                              style={styles.stepperBtn}
                            >
                              <Ionicons name="remove" size={18} color="#fff" />
                            </Pressable>
                            <View style={styles.stepperValueContainer}>
                              <Text style={styles.stepperValText}>{textSize}</Text>
                            </View>
                            <Pressable 
                              onPress={() => setTextSize(Math.min(46, textSize + 2))}
                              style={styles.stepperBtn}
                            >
                              <Ionicons name="add" size={18} color="#fff" />
                            </Pressable>
                          </View>
                        </View>

                        <View style={{ width: 100 }}>
                          <Text style={styles.editorInputLabel}>Text Shadow</Text>
                          <Pressable 
                            onPress={() => setTextShadowEnabled(!textShadowEnabled)}
                            style={[styles.shadowBtn, textShadowEnabled && { backgroundColor: colors.primary }]}
                          >
                            <Ionicons name={textShadowEnabled ? "checkmark-circle" : "ellipse-outline"} size={16} color="#fff" />
                            <Text style={styles.shadowBtnText}>{textShadowEnabled ? "Shadow On" : "Off"}</Text>
                          </Pressable>
                        </View>
                      </View>

                      <Text style={styles.editorInputLabel}>Text Color</Text>
                      <View style={styles.colorSelectorRow}>
                        {[
                          { color: '#ffffff', label: 'White' },
                          { color: '#f59e0b', label: 'Gold' },
                          { color: '#fef08a', label: 'Cream' },
                          { color: '#1e293b', label: 'Charcoal' },
                          { color: '#10b981', label: 'Emerald' },
                          { color: '#3b82f6', label: 'Teal' }
                        ].map((item) => (
                          <Pressable
                            key={item.color}
                            onPress={() => setTextColor(item.color)}
                            style={[
                              styles.colorBubble,
                              { backgroundColor: item.color },
                              textColor === item.color && { borderColor: '#fff', borderWidth: 2.5 }
                            ]}
                          />
                        ))}
                      </View>

                      {/* English Typography Selector */}
                      <Text style={styles.editorInputLabel}>English Typography Style</Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                        {[
                          { id: 'sans-serif', label: 'Modern' },
                          { id: 'serif', label: 'Classic' },
                          { id: 'light', label: 'Elegant' },
                          { id: 'monospace', label: 'Minimalist' }
                        ].map((t) => (
                          <Pressable
                            key={t.id}
                            onPress={() => setEnglishTypography(t.id as any)}
                            style={{
                              flex: 1,
                              paddingVertical: 8,
                              borderRadius: 8,
                              backgroundColor: englishTypography === t.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                              borderWidth: 1,
                              borderColor: englishTypography === t.id ? '#fff' : 'rgba(255,255,255,0.15)',
                              alignItems: 'center'
                            }}
                          >
                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{t.label}</Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Arabic Font Selector */}
                      <Text style={styles.editorInputLabel}>Arabic Font Style</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                        {[
                          { id: 'uthmani', label: 'Uthmani' },
                          { id: 'indopak', label: 'IndoPak' }
                        ].map((f) => (
                          <Pressable
                            key={f.id}
                            onPress={() => setArabicFontFamily(f.id as any)}
                            style={{
                              flex: 1,
                              paddingVertical: 8,
                              borderRadius: 8,
                              backgroundColor: arabicFontFamily === f.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                              borderWidth: 1,
                              borderColor: arabicFontFamily === f.id ? '#fff' : 'rgba(255,255,255,0.15)',
                              alignItems: 'center'
                            }}
                          >
                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{f.label}</Text>
                          </Pressable>
                        ))}
                      </View>

                      <Pressable
                        onPress={() => setIsEditing(false)}
                        style={[styles.doneButton, { backgroundColor: colors.primary }]}
                      >
                        <Ionicons name="checkmark-sharp" size={18} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.doneButtonText}>Done Customizing</Text>
                      </Pressable>
                    </ScrollView>
                  </View>
                ) : (
                  // Download Mode Layout
                  <View style={{ width: '100%' }}>
                    {/* Clean / With Calligraphy Toggle */}
                    <View style={styles.toggleContainer}>
                      <Pressable
                        onPress={() => setIncludeCalligraphy(false)}
                        style={[styles.toggleBtn, !includeCalligraphy && { backgroundColor: '#fff' }]}
                      >
                        <Text style={[styles.toggleBtnText, { color: !includeCalligraphy ? '#111' : '#fff' }]}>
                          Clean Background
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setIncludeCalligraphy(true)}
                        style={[styles.toggleBtn, includeCalligraphy && { backgroundColor: '#fff' }]}
                      >
                        <Text style={[styles.toggleBtnText, { color: includeCalligraphy ? '#111' : '#fff' }]}>
                          With Text / Ayat
                        </Text>
                      </Pressable>
                    </View>

                    {/* Action Row */}
                    <View style={styles.btnRow}>
                      <Pressable
                        onPress={handleDownload}
                        disabled={loading}
                        style={[styles.actionBtn, { backgroundColor: '#fff', flex: 1, marginRight: 8 }]}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#111" />
                        ) : (
                          <>
                            <Ionicons name="download" size={18} color="#111" />
                            <Text style={[styles.actionBtnText, { color: '#111' }]}>Save to Gallery</Text>
                          </>
                        )}
                      </Pressable>

                      <Pressable
                        onPress={handleShare}
                        disabled={loading}
                        style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', width: 100 }]}
                      >
                        <Ionicons name="share-social-outline" size={18} color="#fff" />
                        <Text style={[styles.actionBtnText, { color: '#fff' }]}>Share</Text>
                      </Pressable>
                    </View>

                    {/* Secondary Actions */}
                    <View style={[styles.btnRow, { marginTop: 10 }]}>
                      {includeCalligraphy && (
                        <Pressable
                          onPress={() => setIsEditing(true)}
                          style={[styles.actionBtn, { backgroundColor: '#f59e0b', flex: 1, marginRight: 8 }]}
                        >
                          <Ionicons name="create-outline" size={18} color="#fff" />
                          <Text style={[styles.actionBtnText, { color: '#fff' }]}>Edit Text</Text>
                        </Pressable>
                      )}

                      <Pressable
                        onPress={handleUseInCardCreator}
                        style={[styles.cardBtn, { flex: 1, backgroundColor: colors.primary }]}
                      >
                        <Ionicons name="color-wand-outline" size={18} color="#fff" />
                        <Text style={[styles.actionBtnText, { color: '#fff' }]}>Use in Card Creator</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })()}
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontFamily: FONTS.english,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailWrapper: {
    width: '100%',
    height: thumbnailHeight,
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  thumbnailOverlayText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  cardTitle: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#090d16',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  closeHeaderBtn: {
    padding: 8,
  },
  modalHeaderTitle: {
    color: '#fff',
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    flex: 1,
  },
  previewCardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  calligraphyDesignContainer: {
    position: 'absolute',
    top: '25%',
    left: 16,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  decorativeStar: {
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalArabicText: {
    fontFamily: 'UthmanicHafs',
    textAlign: 'center',
    marginVertical: 10,
  },
  overlayLine: {
    height: 1.5,
    width: 60,
    borderRadius: 1,
    opacity: 0.6,
  },
  modalEnglishSub: {
    fontFamily: FONTS.english,
    textAlign: 'center',
  },
  bottomControlsSheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1.5,
    borderTopColor: '#1e293b',
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  editorSectionTitle: {
    color: '#f59e0b',
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  editorScrollView: {
    maxHeight: 210,
  },
  editorInputLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  editorTextInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#fff',
    fontSize: 13,
    minHeight: 38,
  },
  styleControlsRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  fontSizeStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    height: 38,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  shadowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    height: 38,
    gap: 4,
  },
  shadowBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  colorSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  colorBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '800',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 3,
    marginVertical: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  cardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '800',
  },
});
