import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Ayah } from '../models/types';
import { FONTS, SIZES, getArabicFontFamily } from '../utils/constants';
import { MarkerBadge } from './MarkerBadge';
import { TranslationLanguage, ArabicFont } from '../services/preferencesService';
import { AppColors } from '../utils/theme';

interface AyahWidgetProps {
  ayah: Ayah;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  juzMarker?: number;
  rukuMarker?: number;
  sajdaMarker?: string;
  manzilMarker?: number;
  translationLanguage: TranslationLanguage;
  arabicFont?: ArabicFont;
  colors: AppColors;
}

export const AyahWidget: React.FC<AyahWidgetProps> = ({
  ayah,
  isBookmarked,
  onToggleBookmark,
  juzMarker,
  rukuMarker,
  sajdaMarker,
  manzilMarker,
  translationLanguage,
  arabicFont,
  colors,
}) => {
  const translationText = translationLanguage === 'urdu' ? ayah.urdu : ayah.english;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLongPressTranslation = useCallback(() => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    const lang = translationLanguage === 'urdu' ? 'ur' : 'en';
    Speech.speak(translationText, {
      language: lang,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, [isSpeaking, translationText, translationLanguage, scaleAnim]);

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: colors.border },
        sajdaMarker
          ? { backgroundColor: colors.sajdah + '10', borderLeftWidth: 3, borderLeftColor: colors.sajdah }
          : null,
      ]}
    >
      {/* Marker badges row */}
      {(juzMarker || rukuMarker || manzilMarker) && (
        <View style={styles.markersRow}>
          {juzMarker !== undefined && <MarkerBadge label={`Juz ${juzMarker}`} color={colors.juz} />}
          {manzilMarker !== undefined && <MarkerBadge label={`Manzil ${manzilMarker}`} color={colors.manzil} />}
          {rukuMarker !== undefined && <MarkerBadge label={`Ruku ${rukuMarker}`} color={colors.ruku} />}
        </View>
      )}

      {/* Sajda detail banner */}
      {sajdaMarker !== undefined && (
        <View style={[styles.sajdaBanner, { backgroundColor: colors.sajdah + '18', borderColor: colors.sajdah }]}>
          <Ionicons name="arrow-down-circle" size={16} color={colors.sajdah} />
          <Text style={[styles.sajdaText, { color: colors.sajdah }]}>
            Sajdah — {sajdaMarker === 'obligatory' ? 'Obligatory (Wajib)' : 'Recommended (Mustahab)'}
          </Text>
        </View>
      )}

      {/* Translation — long-press to hear via TTS */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable onLongPress={handleLongPressTranslation} delayLongPress={350}>
          <Text
            style={[
              styles.translation,
              { color: colors.textSecondary },
              translationLanguage === 'urdu' ? styles.translationUrdu : null,
            ]}
          >
            {translationText}
          </Text>
          {isSpeaking && (
            <View style={styles.speakingIndicator}>
              <Ionicons name="volume-high" size={14} color={colors.primary} />
              <Text style={[styles.speakingText, { color: colors.primary }]}>Speaking… tap & hold to stop</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Arabic text */}
      <Text style={[styles.arabic, { color: colors.textPrimary, fontFamily: getArabicFontFamily(arabicFont) }]}>{ayah.arabic}</Text>

      {/* Footer: bookmark + verse-end ornament number */}
      <View style={styles.footer}>
        <Pressable onPress={onToggleBookmark} hitSlop={8}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? colors.accent : colors.textMuted}
          />
        </Pressable>

        {/* Verse-end ornament around ayah number */}
        <View style={styles.verseEndOuter}>
          <View style={[styles.verseHalo, { borderColor: colors.primary + '35' }]}>
            <View style={[styles.verseEndDiamond, { borderColor: colors.primary }]}> 
              <View style={[styles.verseEndInner, { borderColor: colors.primary + '70' }]}>
                <View style={[styles.verseNumberCapsule, { borderColor: colors.primary + '45' }]}>
                  <Text style={[styles.ayahNumber, { color: colors.primary }]}>{ayah.ayah}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.ornamentDotTop, { backgroundColor: colors.primary }]} />
            <View style={[styles.ornamentDotRight, { backgroundColor: colors.primary }]} />
            <View style={[styles.ornamentDotBottom, { backgroundColor: colors.primary }]} />
            <View style={[styles.ornamentDotLeft, { backgroundColor: colors.primary }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const ORNAMENT_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.verseSpacing / 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  markersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  sajdaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  sajdaText: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
  },
  translation: {
    fontFamily: FONTS.english,
    fontSize: SIZES.translationFont,
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: 12,
  },
  translationUrdu: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  speakingText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '600',
  },
  arabic: {
    fontFamily: FONTS.arabic,
    fontSize: SIZES.arabicFont,
    lineHeight: 56,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verseEndOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ORNAMENT_SIZE + 12,
    height: ORNAMENT_SIZE + 12,
  },
  verseHalo: {
    width: ORNAMENT_SIZE + 8,
    height: ORNAMENT_SIZE + 8,
    borderRadius: (ORNAMENT_SIZE + 8) / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseEndDiamond: {
    width: ORNAMENT_SIZE,
    height: ORNAMENT_SIZE,
    borderWidth: 1.6,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseEndInner: {
    width: ORNAMENT_SIZE - 12,
    height: ORNAMENT_SIZE - 12,
    borderWidth: 1,
    borderRadius: 2,
    transform: [{ rotate: '0deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseNumberCapsule: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  ayahNumber: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '800',
    transform: [{ rotate: '-45deg' }],
  },
  ornamentDotTop: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 0,
  },
  ornamentDotRight: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    right: 0,
  },
  ornamentDotBottom: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    bottom: 0,
  },
  ornamentDotLeft: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    left: 0,
  },
});
