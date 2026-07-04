import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FONTS } from '../utils/constants';
import { AppColors } from '../utils/theme';

interface JumpControlsProps {
  verseValue: string;
  rukuValue: string;
  onVerseChange: (value: string) => void;
  onRukuChange: (value: string) => void;
  onJumpVerse: () => void;
  onJumpRuku: () => void;
  colors: AppColors;
}

export const JumpControls: React.FC<JumpControlsProps> = ({
  verseValue,
  rukuValue,
  onVerseChange,
  onRukuChange,
  onJumpVerse,
  onJumpRuku,
  colors,
}) => {
  return (
    <View style={styles.wrapper(colors)}>
      <View style={styles.row}>
        <TextInput
          style={styles.input(colors)}
          value={verseValue}
          onChangeText={onVerseChange}
          keyboardType="number-pad"
          placeholder="Go to verse"
          placeholderTextColor={colors.textMuted}
        />
        <Pressable onPress={onJumpVerse} style={styles.button(colors)}>
          <Text style={styles.buttonText(colors)}>Jump Verse</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input(colors)}
          value={rukuValue}
          onChangeText={onRukuChange}
          keyboardType="number-pad"
          placeholder="Go to ruku"
          placeholderTextColor={colors.textMuted}
        />
        <Pressable onPress={onJumpRuku} style={styles.button(colors)}>
          <Text style={styles.buttonText(colors)}>Jump Ruku</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = {
  wrapper: (colors: AppColors) => ({
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  }),
  row: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  input: (colors: AppColors) => ({
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontFamily: FONTS.english,
    backgroundColor: colors.background,
  }),
  button: (colors: AppColors) => ({
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  }),
  buttonText: (colors: AppColors) => ({
    color: colors.white,
    fontFamily: FONTS.english,
    fontWeight: '600' as const,
  }),
};
