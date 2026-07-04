import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SurahMeta } from '../models/types';
import { FONTS } from '../utils/constants';
import { AppColors } from '../utils/theme';

interface SurahTileProps {
  surah: SurahMeta;
  onPress: () => void;
  colors: AppColors;
}

export const SurahTile: React.FC<SurahTileProps> = ({ surah, onPress, colors }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.border },
        pressed ? { backgroundColor: colors.surface } : null,
      ]}
    >
      <View style={[styles.numberContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.number, { color: colors.textSecondary }]}>{surah.id}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.nameTranslit, { color: colors.textPrimary }]}>{surah.name_translit}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {surah.ayahs} Ayahs • {surah.type}
        </Text>
      </View>

      <Text style={[styles.nameArabic, { color: colors.textPrimary }]}>{surah.name_ar}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  number: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  nameTranslit: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontFamily: FONTS.english,
    fontSize: 13,
  },
  nameArabic: {
    fontFamily: FONTS.surahName,
    fontSize: 28,
    marginLeft: 8,
  },
});
