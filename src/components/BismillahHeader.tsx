import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS, BISMILLAH, getArabicFontFamily } from '../utils/constants';
import { AppColors } from '../utils/theme';
import { ArabicFont } from '../services/preferencesService';

export const BismillahHeader: React.FC<{ colors: AppColors; arabicFont?: ArabicFont }> = ({ colors, arabicFont }) => (
  <View style={[styles.container, { borderBottomColor: colors.border }]}>
    <View style={styles.ornamentRow}>
      <View style={[styles.ornamentLine, { backgroundColor: colors.primary + '30' }]} />
      <Text style={[styles.ornamentStar, { color: colors.primary }]}>✦</Text>
      <View style={[styles.ornamentLine, { backgroundColor: colors.primary + '30' }]} />
    </View>
    <Text style={[styles.text, { color: colors.textPrimary, fontFamily: getArabicFontFamily(arabicFont) }]}>{BISMILLAH}</Text>
    <View style={styles.ornamentRow}>
      <View style={[styles.ornamentLine, { backgroundColor: colors.primary + '30' }]} />
      <Text style={[styles.ornamentStar, { color: colors.primary }]}>✦</Text>
      <View style={[styles.ornamentLine, { backgroundColor: colors.primary + '30' }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '60%',
  },
  ornamentLine: {
    flex: 1,
    height: 1,
  },
  ornamentStar: {
    fontSize: 10,
  },
  text: {
    fontFamily: FONTS.arabic,
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 52,
    marginVertical: 4,
  },
});
