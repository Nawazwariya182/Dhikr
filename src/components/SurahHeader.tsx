import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SurahMeta } from '../models/types';
import { FONTS } from '../utils/constants';
import { AppColors } from '../utils/theme';

interface SurahHeaderProps {
  surah: SurahMeta;
  colors: AppColors;
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({ surah, colors }) => (
  <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
    <Text style={[styles.nameArabic, { color: colors.textPrimary }]}>{surah.name_ar}</Text>
    <View style={[styles.divider, { backgroundColor: colors.primary + '30' }]} />
    <Text style={[styles.nameEnglish, { color: colors.textSecondary }]}>
      {surah.name_translit} — {surah.name_en}
    </Text>
    <View style={styles.metaRow}>
      <Text style={[styles.metaPill, { color: colors.textMuted, backgroundColor: colors.surfaceLight + '60' }]}>
        {surah.ayahs} Ayahs
      </Text>
      <Text style={[styles.metaPill, { color: colors.textMuted, backgroundColor: colors.surfaceLight + '60' }]}>
        {surah.type}
      </Text>
      <Text style={[styles.metaPill, { color: colors.textMuted, backgroundColor: colors.surfaceLight + '60' }]}>
        Revelation #{surah.revelation_order}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nameArabic: {
    fontFamily: FONTS.surahName,
    fontSize: 42,
    marginBottom: 10,
  },
  divider: {
    width: 48,
    height: 3,
    borderRadius: 2,
    marginBottom: 10,
  },
  nameEnglish: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
