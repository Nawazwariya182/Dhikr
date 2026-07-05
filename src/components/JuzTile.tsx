import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '../utils/constants';
import { AppColors } from '../utils/theme';

interface JuzTileProps {
  juz: number;
  startLabel: string;
  onPress: () => void;
  colors: AppColors;
}

export const JuzTile: React.FC<JuzTileProps> = ({ juz, startLabel, onPress, colors }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container(colors), pressed && styles.pressed(colors)]}>
      <View style={styles.numberContainer(colors)}>
        <Text style={styles.number(colors)}>{juz}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title(colors)}>Juz {juz}</Text>
        <Text style={styles.meta(colors)}>Starts at {startLabel}</Text>
      </View>
    </Pressable>
  );
};

const styles = {
  container: (colors: AppColors) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  }),
  pressed: (colors: AppColors) => ({
    backgroundColor: colors.surface,
  }),
  numberContainer: (colors: AppColors) => ({
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
  }),
  number: (colors: AppColors) => ({
    fontFamily: FONTS.english,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600' as const,
  }),
  info: {
    flex: 1,
  },
  title: (colors: AppColors) => ({
    fontFamily: FONTS.english,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600' as const,
    marginBottom: 2,
  }),
  meta: (colors: AppColors) => ({
    fontFamily: FONTS.english,
    fontSize: 13,
    color: colors.textMuted,
  }),
};
