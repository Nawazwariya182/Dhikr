import React, { useMemo, useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Animated,
  Alert,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { AyahWidget } from '../components/AyahWidget';
import { BismillahHeader } from '../components/BismillahHeader';
import { SurahHeader } from '../components/SurahHeader';
import { quranService } from '../services/quranService';
import { bookmarkService } from '../services/bookmarkService';
import { Ayah } from '../models/types';
import { BISMILLAH, FONTS, getArabicFontFamily } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';
import quranData from '../../assets/json/quran.json';
import juzData from '../../assets/json/juz.json';
import surahMetaData from '../../assets/json/surah_meta.json';
import { LastReadWidget } from '../widgets/components/LastReadWidget';
import { JuzProgressWidget } from '../widgets/components/JuzProgressWidget';

type Props = {
  route: RouteProp<{ Surah: { surahId?: number; juzNumber?: number; initialAyah?: number } }, 'Surah'>;
  navigation: NativeStackNavigationProp<any>;
};

// Separator item inserted into the Juz list when a new surah begins
interface SurahSeparator {
  _type: 'separator';
  surahId: number;
  showBismillah: boolean;
}

type ListItem = Ayah | SurahSeparator;

function isSeparator(item: ListItem): item is SurahSeparator {
  return '_type' in item && item._type === 'separator';
}

function stripAutoBismillahPrefix(ayah: Ayah): Ayah {
  if (ayah.surah === 1 || ayah.ayah !== 1) {
    return ayah;
  }

  const variants = [
    BISMILLAH,
    'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    'بسم الله الرحمن الرحيم',
  ];

  let cleaned = ayah.arabic.trimStart();
  for (const variant of variants) {
    if (cleaned.startsWith(variant)) {
      cleaned = cleaned.slice(variant.length).trimStart();
      break;
    }
  }

  // Fallback for minor orthographic variations that still begin with Bismillah.
  if (cleaned === ayah.arabic.trimStart()) {
    cleaned = cleaned
      .replace(/^\s*بِ?سْمِ\s+اللَّهِ\s+الرَّ?حْمَ?ـ?ٰ?نِ\s+الرَّ?حِيمِ\s*/u, '')
      .trimStart();
  }

  if (!cleaned) {
    return ayah;
  }

  return {
    ...ayah,
    arabic: cleaned,
  };
}

const updateLastReadWidgets = (surahId: number, ayahNumber: number) => {
  try {
    const surah = surahMetaData.find((s) => s.id === surahId);
    const surahName = surah ? surah.name_translit : 'Al-Fatihah';

    requestWidgetUpdate({
      widgetName: 'LastRead',
      renderWidget: () => (
        <LastReadWidget
          surahName={surahName}
          surahId={surahId}
          ayahNumber={ayahNumber}
          hasHistory={true}
        />
      ),
    });

    // Calculate Juz progress
    const findAyahIndex = (sId: number, aNum: number) => {
      return quranData.findIndex((a: any) => a.surah === sId && a.ayah === aNum);
    };

    const currentIndex = findAyahIndex(surahId, ayahNumber);
    let juzNumber = 1;
    let startIndex = 0;
    let endIndex = quranData.length;

    for (let i = 0; i < juzData.length; i++) {
      const j = juzData[i];
      const jIndex = findAyahIndex(j.surah, j.ayah);
      if (jIndex >= 0 && currentIndex >= jIndex) {
        juzNumber = j.juz;
        startIndex = jIndex;
        if (i + 1 < juzData.length) {
          endIndex = findAyahIndex(juzData[i + 1].surah, juzData[i + 1].ayah);
        } else {
          endIndex = quranData.length;
        }
      }
    }

    const totalVerses = endIndex - startIndex;
    const versesRead = Math.max(1, currentIndex - startIndex + 1);
    const progressPercent = (versesRead / totalVerses) * 100;

    requestWidgetUpdate({
      widgetName: 'JuzProgress',
      renderWidget: () => (
        <JuzProgressWidget
          juzNumber={juzNumber}
          progressPercent={progressPercent}
          versesRead={versesRead}
          totalVerses={totalVerses}
        />
      ),
    });
  } catch (e) {
    console.log('Widget update error:', e);
  }
};

export const SurahScreen: React.FC<Props> = ({ route, navigation }) => {
  const { preferences, colors } = useAppPreferences();
  const { surahId, juzNumber, initialAyah } = route.params;
  const listRef = useRef<FlatList<ListItem>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      const firstVisible = viewableItems[0].item;
      if (firstVisible && !isSeparator(firstVisible)) {
        AsyncStorage.setItem('@dhikr_last_read', JSON.stringify({
          surahId: firstVisible.surah,
          ayahNumber: firstVisible.ayah,
        })).then(() => {
          updateLastReadWidgets(firstVisible.surah, firstVisible.ayah);
        });
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 30,
  }).current;

  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [verseInput, setVerseInput] = useState('');
  const [rukuInput, setRukuInput] = useState('');

  const isSurahMode = surahId !== undefined;
  const surahMeta = useMemo(() => (surahId ? quranService.getSurahMeta(surahId) : undefined), [surahId]);

  const rawAyahs = useMemo(() => {
    if (isSurahMode && surahId) {
      return quranService.getAyahsForSurah(surahId);
    }
    if (juzNumber) {
      return quranService.getAyahsForJuz(juzNumber);
    }
    return [];
  }, [isSurahMode, surahId, juzNumber]);

  // Keep verse 1 visible, but strip duplicated Bismillah prefix from Arabic text (except Surah 1).
  const ayahs = useMemo(() => rawAyahs.map(stripAutoBismillahPrefix), [rawAyahs]);

  // Build mixed list with surah separators for Juz mode
  const listData: ListItem[] = useMemo(() => {
    if (isSurahMode) return ayahs;

    const items: ListItem[] = [];
    let prevSurah = -1;
    for (const a of ayahs) {
      if (a.surah !== prevSurah) {
        items.push({
          _type: 'separator',
          surahId: a.surah,
          showBismillah: a.surah !== 1 && a.surah !== 9,
        });
        prevSurah = a.surah;
      }
      items.push(a);
    }
    return items;
  }, [isSurahMode, ayahs]);

  const rukuStarts = useMemo(() => {
    if (isSurahMode && surahId) {
      return quranService.getRukuStartsForSurah(surahId);
    }
    if (juzNumber) {
      return quranService.getRukuStartsForJuz(juzNumber);
    }
    return [];
  }, [isSurahMode, surahId, juzNumber]);

  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(() => {
    const set = new Set<string>();
    for (const b of bookmarkService.getBookmarks()) {
      set.add(`${b.surah}:${b.ayah}`);
    }
    return set;
  });

  const showBismillah = isSurahMode && surahId !== 1 && surahId !== 9;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setIsJumpOpen(true)}
          style={({ pressed }) => [
            styles.headerJumpButton,
            { backgroundColor: pressed ? colors.primaryDark : colors.primary },
          ]}
          hitSlop={8}
        >
          <Ionicons name="navigate" size={16} color={colors.white} />
          <Text style={[styles.headerJumpText, { color: colors.white }]}>Jump</Text>
        </Pressable>
      ),
    });
  }, [navigation, colors]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, surahId, juzNumber]);

  useEffect(() => {
    if (surahId) {
      AsyncStorage.setItem('@dhikr_last_read', JSON.stringify({
        surahId,
        ayahNumber: initialAyah || 1,
      })).then(() => {
        updateLastReadWidgets(surahId, initialAyah || 1);
      });
    } else if (juzNumber) {
      const juzAyahs = quranService.getAyahsForJuz(juzNumber);
      if (juzAyahs.length > 0) {
        AsyncStorage.setItem('@dhikr_last_read', JSON.stringify({
          surahId: juzAyahs[0].surah,
          ayahNumber: juzAyahs[0].ayah,
        })).then(() => {
          updateLastReadWidgets(juzAyahs[0].surah, juzAyahs[0].ayah);
        });
      }
    }
  }, [surahId, juzNumber, initialAyah]);

  const jumpToIndex = useCallback(
    (index: number, showNotFound = true) => {
      if (index < 0 || index >= listData.length) {
        if (showNotFound) {
          Alert.alert('Not found', 'Requested position is not available in this section.');
        }
        return;
      }
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
      setIsJumpOpen(false);
    },
    [listData.length]
  );

  const handleJumpVerse = useCallback(() => {
    const verse = Number(verseInput);
    if (!Number.isInteger(verse) || verse <= 0) {
      Alert.alert('Invalid verse', 'Enter a valid verse number.');
      return;
    }
    let index = listData.findIndex((item) => !isSeparator(item) && item.ayah === verse);
    if (index < 0) {
      index = listData.findIndex((item) => !isSeparator(item) && item.ayah > verse);
    }
    jumpToIndex(index);
  }, [verseInput, listData, jumpToIndex]);

  const handleJumpRuku = useCallback(() => {
    const rukuNumber = Number(rukuInput);
    if (!Number.isInteger(rukuNumber) || rukuNumber <= 0) {
      Alert.alert('Invalid ruku', 'Enter a valid ruku number.');
      return;
    }
    const exactRuku = rukuStarts.find((r) => r.ruku === rukuNumber);
    const ordinalRuku = !exactRuku ? rukuStarts[rukuNumber - 1] : undefined;
    const target = exactRuku ?? ordinalRuku;
    if (!target) {
      Alert.alert('Not found', 'Ruku is not available in this section.');
      return;
    }
    const index = listData.findIndex(
      (item) => !isSeparator(item) && item.surah === target.surah && item.ayah === target.ayah
    );
    jumpToIndex(index);
  }, [rukuInput, rukuStarts, listData, jumpToIndex]);

  useEffect(() => {
    if (!initialAyah || listData.length === 0) return;
    const timer = setTimeout(() => {
      let index = listData.findIndex((item) => !isSeparator(item) && item.ayah === initialAyah);
      if (index < 0) {
        index = listData.findIndex((item) => !isSeparator(item) && item.ayah > initialAyah);
      }
      jumpToIndex(index, false);
    }, 180);
    return () => clearTimeout(timer);
  }, [initialAyah, listData, jumpToIndex]);

  const handleToggleBookmark = useCallback(
    async (surah: number, ayah: number) => {
      const key = `${surah}:${ayah}`;
      const isNowBookmarked = await bookmarkService.toggleBookmark(surah, ayah, juzNumber);
      setBookmarkedKeys((prev) => {
        const next = new Set(prev);
        if (isNowBookmarked) next.add(key);
        else next.delete(key);
        return next;
      });
    },
    [juzNumber]
  );

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      // Surah separator header in Juz view
      if (isSeparator(item)) {
        const meta = quranService.getSurahMeta(item.surahId);
        return (
          <View style={[styles.juzSurahSep, { backgroundColor: colors.surface }]}>
            <View style={[styles.juzSurahSepLine, { backgroundColor: colors.border }]} />
            <View style={[styles.juzSurahSepCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {meta && (
                <>
                  <Text style={[styles.juzSurahSepArabic, { color: colors.textPrimary }]}>{meta.name_ar}</Text>
                  <Text style={[styles.juzSurahSepName, { color: colors.textSecondary }]}>
                    {meta.name_translit} — {meta.name_en}
                  </Text>
                  <Text style={[styles.juzSurahSepMeta, { color: colors.textMuted }]}>
                    {meta.ayahs} Ayahs • {meta.type}
                  </Text>
                </>
              )}
            </View>
            {item.showBismillah && (
              <Text style={[styles.juzSurahSepBismillah, { color: colors.textPrimary, fontFamily: getArabicFontFamily(preferences.arabicFont) }]}>{BISMILLAH}</Text>
            )}
            <View style={[styles.juzSurahSepLine, { backgroundColor: colors.border }]} />
          </View>
        );
      }
 
      const key = `${item.surah}:${item.ayah}`;
      return (
        <AyahWidget
          ayah={item}
          isBookmarked={bookmarkedKeys.has(key)}
          onToggleBookmark={() => handleToggleBookmark(item.surah, item.ayah)}
          juzMarker={quranService.getJuzMarker(item.surah, item.ayah)}
          rukuMarker={quranService.getRukuMarker(item.surah, item.ayah)}
          sajdaMarker={quranService.getSajdaMarker(item.surah, item.ayah)}
          manzilMarker={quranService.getManzilMarker(item.surah, item.ayah)}
          translationLanguage={preferences.translationLanguage}
          arabicFont={preferences.arabicFont}
          colors={colors}
        />
      );
    },
    [bookmarkedKeys, handleToggleBookmark, preferences.translationLanguage, preferences.arabicFont, colors]
  );

  const ListHeader = useMemo(
    () => (
      <View>
        {surahMeta && <SurahHeader surah={surahMeta} colors={colors} />}
        {!surahMeta && juzNumber ? (
          <View style={[styles.juzHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <View style={[styles.juzBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.juzBadgeText, { color: colors.primary }]}>JUZ</Text>
              <Text style={[styles.juzBadgeNumber, { color: colors.primary }]}>{juzNumber}</Text>
            </View>
            <Text style={[styles.juzMeta, { color: colors.textMuted }]}>
              Continuous reading • {ayahs.length} verses
            </Text>
          </View>
        ) : null}
        {showBismillah && <BismillahHeader colors={colors} arabicFont={preferences.arabicFont} />}
      </View>
    ),
    [surahMeta, showBismillah, colors, juzNumber, ayahs.length, preferences.arabicFont]
  );

  const getItemKey = useCallback((item: ListItem) => {
    if (isSeparator(item)) return `sep-${item.surahId}`;
    return `${item.surah}:${item.ayah}`;
  }, []);

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background, opacity: fadeAnim }]}>
      <FlatList
        ref={listRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={getItemKey}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        scrollEventThrottle={16}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={8}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={(info) => {
          listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: true });
          }, 200);
        }}
      />

      <Modal transparent visible={isJumpOpen} animationType="fade" onRequestClose={() => setIsJumpOpen(false)}>
        <View style={styles.modalRoot}>
          <BlurView intensity={45} tint={preferences.themeMode === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsJumpOpen(false)} />

          <View style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dialogTitle, { color: colors.textPrimary }]}>Jump to Position</Text>

            <View style={styles.dialogRow}>
              <TextInput
                style={[styles.dialogInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                value={verseInput}
                onChangeText={setVerseInput}
                keyboardType="number-pad"
                placeholder="Verse number"
                placeholderTextColor={colors.textMuted}
              />
              <Pressable onPress={handleJumpVerse} style={[styles.dialogButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.dialogButtonText, { color: colors.white }]}>Jump</Text>
              </Pressable>
            </View>

            <View style={styles.dialogRow}>
              <TextInput
                style={[styles.dialogInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.background }]}
                value={rukuInput}
                onChangeText={setRukuInput}
                keyboardType="number-pad"
                placeholder="Ruku number"
                placeholderTextColor={colors.textMuted}
              />
              <Pressable onPress={handleJumpRuku} style={[styles.dialogButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.dialogButtonText, { color: colors.white }]}>Jump</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerJumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerJumpText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '700',
  },
  /* ── Juz top header ── */
  juzHeader: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  juzBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  juzBadgeText: {
    fontFamily: FONTS.english,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  juzBadgeNumber: {
    fontFamily: FONTS.english,
    fontSize: 28,
    fontWeight: '800',
  },
  juzMeta: {
    fontFamily: FONTS.english,
    fontSize: 13,
  },
  /* ── Juz surah separator ── */
  juzSurahSep: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  juzSurahSepLine: {
    width: '60%',
    height: StyleSheet.hairlineWidth,
  },
  juzSurahSepCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    width: '85%',
  },
  juzSurahSepArabic: {
    fontFamily: FONTS.surahName,
    fontSize: 34,
    marginBottom: 6,
  },
  juzSurahSepName: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  juzSurahSepMeta: {
    fontFamily: FONTS.english,
    fontSize: 12,
  },
  juzSurahSepBismillah: {
    fontFamily: FONTS.arabic,
    fontSize: 24,
    lineHeight: 46,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  /* ── Modal ── */
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    elevation: 8,
  },
  dialogTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  dialogRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dialogInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.english,
  },
  dialogButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogButtonText: {
    fontFamily: FONTS.english,
    fontWeight: '700',
    fontSize: 13,
  },
});
