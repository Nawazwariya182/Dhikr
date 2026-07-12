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
import { FONTS } from '../utils/constants';

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
    id: 'wp_15',
    title: 'Light Marble',
    type: 'image',
    source: require('../../assets/backgrounds/bg_marble_dark.jpg'),
    overlayText: 'ٱللَّٰهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ',
    overlaySub: 'Allah is the Light of the heavens and the earth',
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
    id: 'wp_15',
    title: 'Light Marble',
    type: 'image',
    source: require('../../assets/backgrounds/bg_marble_dark.jpg'),
    overlayText: 'ٱللَّٰهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ',
    overlaySub: 'Allah is the Light of the heavens and the earth',
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
    id: 'wp_15',
    title: 'Light Marble',
    type: 'image',
    source: require('../../assets/backgrounds/bg_marble_dark.jpg'),
    overlayText: 'ٱللَّٰهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ',
    overlaySub: 'Allah is the Light of the heavens and the earth',
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
          28 premium Islamic presets. Tap to preview full lock-screen, toggle Calligraphy ON/OFF, and save.
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
              setSelectedWp(item);
              setIncludeCalligraphy(true); // default to showing text on open
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

      {/* Full Screen Preview Modal */}
      <Modal
        visible={selectedWp !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedWp(null)}
      >
        {selectedWp && (
          <View style={styles.modalContainer}>
            {/* ViewShot wraps the wallpaper rendering for 9:16 high-def capture */}
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1.0 }}
              style={StyleSheet.absoluteFillObject}
            >
              {/* Wallpaper Background Image / Gradient centered and cropped */}
              {selectedWp.type === 'image' ? (
                <Image
                  source={selectedWp.source}
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
                  colors={selectedWp.colors!}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              
              {/* Overlay for contrast */}
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: selectedWp.isDark ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.06)' }]} />

              {/* Calligraphy Overlay Design (Centered properly with side clipping) */}
              {includeCalligraphy && (
                <View style={styles.calligraphyDesignContainer}>
                  {/* Decorative Islamic Star */}
                  <Text style={[styles.decorativeStar, { color: selectedWp.isDark ? '#f59e0b' : '#92400e' }]}>✦</Text>
                  
                  {/* Arabic text */}
                  <Text style={[styles.modalArabicText, { color: selectedWp.isDark ? '#fff' : '#111' }]}>
                    {selectedWp.overlayText}
                  </Text>
                  
                  {/* Subtext divider line */}
                  <View style={[styles.overlayLine, { backgroundColor: selectedWp.isDark ? '#f59e0b' : '#92400e' }]} />
                  
                  {/* English subtext */}
                  <Text style={[styles.modalEnglishSub, { color: selectedWp.isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)' }]}>
                    {selectedWp.overlaySub}
                  </Text>

                  <Text style={[styles.decorativeStar, { color: selectedWp.isDark ? '#f59e0b' : '#92400e', marginTop: 10 }]}>✦</Text>
                </View>
              )}
            </ViewShot>
            
            {/* Control Overlays (excluded from ViewShot capture so they don't appear in downloaded image) */}
            <View style={styles.topOverlay} />
            <View style={styles.bottomOverlay} />

            {/* Back Button */}
            <Pressable
              onPress={() => setSelectedWp(null)}
              style={[styles.closeBtn, { top: insets.top + 16 }]}
            >
              <Ionicons name="close-circle" size={36} color="#fff" style={styles.shadowIcon} />
            </Pressable>

            {/* Bottom Controls */}
            <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
              <Text style={styles.modalTitle}>{selectedWp.title}</Text>
              
              {/* Segmented Toggle Control for with / without calligraphy */}
              <View style={styles.toggleContainer}>
                <Pressable
                  onPress={() => setIncludeCalligraphy(false)}
                  style={[styles.toggleBtn, !includeCalligraphy && { backgroundColor: '#fff' }]}
                >
                  <Text style={[styles.toggleBtnText, { color: !includeCalligraphy ? '#111' : '#fff' }]}>
                    Clean
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setIncludeCalligraphy(true)}
                  style={[styles.toggleBtn, includeCalligraphy && { backgroundColor: '#fff' }]}
                >
                  <Text style={[styles.toggleBtnText, { color: includeCalligraphy ? '#111' : '#fff' }]}>
                    With Ayat
                  </Text>
                </Pressable>
              </View>
              
              <View style={styles.btnRow}>
                {/* Download */}
                <Pressable
                  onPress={handleDownload}
                  disabled={loading}
                  style={[styles.actionBtn, { backgroundColor: '#fff' }]}
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

                {/* Share */}
                <Pressable
                  onPress={handleShare}
                  disabled={loading}
                  style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }]}
                >
                  <Ionicons name="share-social-outline" size={18} color="#fff" />
                  <Text style={[styles.actionBtnText, { color: '#fff' }]}>Share</Text>
                </Pressable>
              </View>

              {/* Use in Card Creator */}
              <Pressable
                onPress={handleUseInCardCreator}
                style={[styles.cardBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="color-wand-outline" size={18} color="#fff" />
                <Text style={[styles.actionBtnText, { color: '#fff' }]}>Use in Card Creator</Text>
              </Pressable>
            </View>
          </View>
        )}
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
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  calligraphyDesignContainer: {
    position: 'absolute',
    top: '30%',
    left: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  decorativeStar: {
    fontSize: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalArabicText: {
    fontFamily: 'UthmanicHafs',
    fontSize: 32,
    lineHeight: 50,
    textAlign: 'center',
    marginVertical: 12,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  overlayLine: {
    height: 1.5,
    width: 60,
    borderRadius: 1,
    marginVertical: 10,
    opacity: 0.6,
  },
  modalEnglishSub: {
    fontFamily: FONTS.english,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  shadowIcon: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    gap: 12,
  },
  modalTitle: {
    color: '#fff',
    fontFamily: FONTS.english,
    fontSize: 20,
    fontWeight: '800',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    flex: 1,
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
    marginTop: 4,
  },
  actionBtnText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '800',
  },
});
