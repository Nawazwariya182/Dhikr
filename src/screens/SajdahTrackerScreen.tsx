import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { sajdahService, SajdahLogs } from '../services/sajdahService';
import { quranService } from '../services/quranService';
import { FONTS } from '../utils/constants';
import sajdaData from '../../assets/json/sajda.json';

interface SajdahItem {
  id: number;
  surah: number;
  ayah: number;
  type: string;
  surahName: string;
  arabicText: string;
  englishText: string;
}

export const SajdahTrackerScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const [sajdahList, setSajdahList] = useState<SajdahItem[]>([]);
  const [logs, setLogs] = useState<SajdahLogs>({});
  const [completedCount, setCompletedCount] = useState(0);

  const loadData = useCallback(async () => {
    const loadedLogs = await sajdahService.getLogs();
    setLogs({ ...loadedLogs });
    const count = await sajdahService.getCompletedCount();
    setCompletedCount(count);
  }, []);

  useEffect(() => {
    // Compile list of sajdahs with names and translations
    quranService.load();
    const compiledList: SajdahItem[] = sajdaData.map((item: any) => {
      const surahMeta = quranService.getSurahMeta(item.surah);
      const surahName = surahMeta ? surahMeta.name_translit : `Surah ${item.surah}`;
      
      const verses = quranService.getAyahsForSurah(item.surah);
      const verse = verses.find((v) => v.ayah === item.ayah);
      
      return {
        id: item.id,
        surah: item.surah,
        ayah: item.ayah,
        type: item.type,
        surahName,
        arabicText: verse ? verse.arabic : '',
        englishText: verse ? verse.english : '',
      };
    });

    setSajdahList(compiledList);
    loadData();
  }, [loadData]);

  const handleToggleSajdah = async (id: number) => {
    await sajdahService.toggleSajdah(id);
    await loadData();
  };

  const renderSajdahCard = ({ item }: { item: SajdahItem }) => {
    const isCompleted = !!logs[item.id]?.completed;
    
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: isCompleted ? colors.primary : colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.surahTitle, { color: colors.textPrimary }]}>
              {item.surahName}
            </Text>
            <Text style={[styles.referenceText, { color: colors.textMuted }]}>
              Surah {item.surah}, Ayah {item.ayah} •{' '}
              <Text
                style={{
                  color: item.type === 'obligatory' ? '#ef4444' : '#10b981',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {item.type}
              </Text>
            </Text>
          </View>
          <Pressable
            onPress={() => handleToggleSajdah(item.id)}
            style={[
              styles.checkbox,
              {
                borderColor: isCompleted ? colors.primary : colors.textMuted,
                backgroundColor: isCompleted ? colors.primary : 'transparent',
              },
            ]}
          >
            {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
          </Pressable>
        </View>

        <Text style={[styles.arabicText, { color: colors.textPrimary }]}>
          {item.arabicText}
        </Text>
        <Text style={[styles.englishText, { color: colors.textSecondary }]}>
          {item.englishText}
        </Text>
      </View>
    );
  };

  const progressPercent = Math.round((completedCount / 15) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Progress Card */}
      <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
            Sujud al-Tilawah
          </Text>
          <Text style={[styles.progressSubtitle, { color: colors.textMuted }]}>
            Log the prostrations of recitation as you encounter them in the Quran.
          </Text>
          <Text style={[styles.statsText, { color: colors.primary }]}>
            {completedCount} / 15 Completed ({progressPercent}%)
          </Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="sparkles" size={32} color={colors.primary} />
        </View>
      </View>

      <FlatList
        data={sajdahList}
        renderItem={renderSajdahCard}
        keyExtractor={(item) => `sajdah-${item.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListFooterComponent={
          <View style={[styles.eduCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.eduHeader}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.eduTitle, { color: colors.textPrimary }]}>
                How to perform Sajdah al-Tilawah?
              </Text>
            </View>
            <Text style={[styles.eduBody, { color: colors.textSecondary }]}>
              1. Standing facing the Qibla (recommended) or sitting, make intention for Sajdah al-Tilawah.{"\n"}
              2. Without raising your hands, say "Allahu Akbar" and go straight down into prostration (Sajdah).{"\n"}
              3. In Sajdah, recite: "Subhana Rabbiyal A'la" three times.{"\n"}
              4. Say "Allahu Akbar" and rise back up to a standing or sitting position.{"\n\n"}
              Note: Wudu and pure clothes/place are required just like for normal Salat.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressCard: {
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressInfo: {
    flex: 1,
    marginRight: 12,
  },
  progressTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  statsText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '700',
  },
  progressBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  surahTitle: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '700',
  },
  referenceText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 18,
    fontFamily: 'UthmanicHafs',
    lineHeight: 28,
    textAlign: 'right',
    marginVertical: 8,
  },
  englishText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  eduCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  eduHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  eduTitle: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '700',
  },
  eduBody: {
    fontFamily: FONTS.english,
    fontSize: 13,
    lineHeight: 20,
  },
});
