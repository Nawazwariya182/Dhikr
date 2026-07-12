import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { BlurView } from 'expo-blur';
import { Ayah } from '../models/types';
import { FONTS, SIZES, getArabicFontFamily } from '../utils/constants';
import { MarkerBadge } from './MarkerBadge';
import { TranslationLanguage, ArabicFont } from '../services/preferencesService';
import { AppColors } from '../utils/theme';
import { useAppPreferences } from '../context/AppPreferencesContext';

interface AyahWidgetProps {
  ayah: Ayah;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenTafseer: () => void;
  juzMarker?: number;
  rukuMarker?: number;
  sajdaMarker?: string;
  manzilMarker?: number;
  translationLanguage: TranslationLanguage;
  arabicFont?: ArabicFont;
  colors: AppColors;
  enableHifzBlur?: boolean;
}

interface HifzBlurOverlayProps {
  colors: AppColors;
  revealAnim: Animated.Value;
  isRevealed: boolean;
}

const HifzBlurOverlay: React.FC<HifzBlurOverlayProps> = ({
  colors,
  revealAnim,
  isRevealed,
}) => {
  const isDark = colors.textPrimary === '#ffffff';
  const backingColor = isDark ? 'rgba(30, 41, 59, 0.96)' : 'rgba(255, 255, 255, 0.96)';

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: revealAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: backingColor,
        },
      ]}
      pointerEvents={isRevealed ? 'none' : 'auto'}
    >
      <BlurView
        intensity={95}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const AyahWidget: React.FC<AyahWidgetProps> = ({
  ayah,
  isBookmarked,
  onToggleBookmark,
  onOpenTafseer,
  juzMarker,
  rukuMarker,
  sajdaMarker,
  manzilMarker,
  translationLanguage,
  arabicFont,
  colors,
  enableHifzBlur: enableHifzBlurProp = false,
}) => {
  const enableHifzBlur = false; // Feature paused for now
  const { preferences } = useAppPreferences();
  const fontSizeMode = preferences.fontSizeMode || 'medium';

  const [tempScale, setTempScale] = useState(1);
  const initialTouchDistance = useRef<number | null>(null);

  // Auto-reset scaled font after 3.5 seconds
  useEffect(() => {
    if (tempScale !== 1) {
      const timer = setTimeout(() => {
        setTempScale(1);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [tempScale]);

  const handleTouchStart = (e: any) => {
    const touches = e.nativeEvent.touches;
    if (touches && touches.length === 2) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      initialTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e: any) => {
    const touches = e.nativeEvent.touches;
    if (touches && touches.length === 2 && initialTouchDistance.current !== null) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const ratio = currentDistance / initialTouchDistance.current;
      
      if (ratio > 1.15) {
        setTempScale(Math.min(1.6, ratio)); // Max 60% larger
      } else if (ratio < 0.85) {
        setTempScale(Math.max(0.65, ratio)); // Min 35% smaller
      }
    }
  };

  const handleTouchEnd = () => {
    initialTouchDistance.current = null;
  };

  // Base font sizes depending on user preference
  let baseArabic = SIZES.arabicFont; // 32
  let baseTranslation = SIZES.translationFont; // 16
  let arabicLineHeight = 56;
  let translationLineHeight = 24;

  if (fontSizeMode === 'small') {
    baseArabic = 26;
    baseTranslation = 13;
    arabicLineHeight = 44;
    translationLineHeight = 20;
  } else if (fontSizeMode === 'big') {
    baseArabic = 40;
    baseTranslation = 20;
    arabicLineHeight = 68;
    translationLineHeight = 30;
  }

  const finalArabicFontSize = baseArabic * tempScale;
  const finalTranslationFontSize = baseTranslation * tempScale;
  const finalArabicLineHeight = arabicLineHeight * tempScale;
  const finalTranslationLineHeight = translationLineHeight * tempScale;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHifzRevealed, setIsHifzRevealed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  // Reset Hifz reveal state when ayah changes
  useEffect(() => {
    setIsHifzRevealed(false);
    revealAnim.setValue(0);
  }, [ayah.surah, ayah.ayah]);

  const handleLongPressTranslation = useCallback((text: string, lang: 'ur' | 'en') => {
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
    Speech.speak(text, {
      language: lang,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, [isSpeaking, scaleAnim]);

  const handleRevealHifz = () => {
    const nextState = !isHifzRevealed;
    setIsHifzRevealed(nextState);
    Animated.timing(revealAnim, {
      toValue: nextState ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const renderArabicText = () => {
    return (
      <Text
        style={[
          styles.arabic,
          {
            color: colors.textPrimary,
            fontFamily: getArabicFontFamily(arabicFont),
            fontSize: finalArabicFontSize,
            lineHeight: finalArabicLineHeight,
          },
        ]}
      >
        {ayah.arabic}
      </Text>
    );
  };

  const renderTranslations = () => {
    if (translationLanguage === 'both') {
      return (
        <View style={styles.stackedTranslations}>
          <Pressable onLongPress={() => handleLongPressTranslation(ayah.english, 'en')} delayLongPress={350} style={styles.translationPressable}>
            <Text
              style={[
                styles.translation,
                {
                  color: colors.textSecondary,
                  fontSize: finalTranslationFontSize,
                  lineHeight: finalTranslationLineHeight,
                },
              ]}
            >
              {ayah.english}
            </Text>
          </Pressable>
          <View style={[styles.translationDivider, { backgroundColor: colors.border }]} />
          <Pressable onLongPress={() => handleLongPressTranslation(ayah.urdu, 'ur')} delayLongPress={350} style={styles.translationPressable}>
            <Text
              style={[
                styles.translation,
                styles.translationUrdu,
                {
                  color: colors.textSecondary,
                  fontSize: finalTranslationFontSize,
                  lineHeight: finalTranslationLineHeight,
                },
              ]}
            >
              {ayah.urdu}
            </Text>
          </Pressable>
        </View>
      );
    }

    const isUrdu = translationLanguage === 'urdu';
    const translationText = isUrdu ? ayah.urdu : ayah.english;
    return (
      <Pressable onLongPress={() => handleLongPressTranslation(translationText, isUrdu ? 'ur' : 'en')} delayLongPress={350}>
        <Text
          style={[
            styles.translation,
            {
              color: colors.textSecondary,
              fontSize: finalTranslationFontSize,
              lineHeight: finalTranslationLineHeight,
            },
            isUrdu ? styles.translationUrdu : null,
          ]}
        >
          {translationText}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

      {/* Translation(s) */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {renderTranslations()}
        {isSpeaking && (
          <View style={styles.speakingIndicator}>
            <Ionicons name="volume-high" size={14} color={colors.primary} />
            <Text style={[styles.speakingText, { color: colors.primary }]}>Speaking… tap & hold to stop</Text>
          </View>
        )}
      </Animated.View>

      {/* Arabic text — with optional Hifz blur overlay */}
      <Pressable
        onPress={enableHifzBlur ? handleRevealHifz : undefined}
        accessibilityLabel={
          enableHifzBlur
            ? `Ayah ${ayah.ayah}: ${isHifzRevealed ? 'revealed, tap to blur' : 'blurred, tap to reveal'}`
            : undefined
        }
        accessibilityRole={enableHifzBlur ? 'button' : undefined}
      >
        {/* Container: sharp text always rendered here */}
        <View style={styles.arabicContainer}>
          {renderArabicText()}

          {/* Blur overlay — sits on top, fades out when revealed */}
          {enableHifzBlur && (
            <HifzBlurOverlay
              colors={colors}
              revealAnim={revealAnim}
              isRevealed={isHifzRevealed}
            />
          )}
        </View>
      </Pressable>

      {/* Footer: bookmark + Tafseer drawer trigger + verse-end ornament number */}
      <View style={styles.footer}>
        <View style={styles.actionButtons}>
          <Pressable onPress={onToggleBookmark} hitSlop={8} style={styles.actionButton}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? colors.accent : colors.textMuted}
            />
          </Pressable>

          {/* Tafseer button paused for now
          <Pressable onPress={onOpenTafseer} hitSlop={8} style={styles.actionButton}>
            <Ionicons
              name="book-outline"
              size={20}
              color={colors.textMuted}
            />
            <Text style={[styles.actionLabel, { color: colors.textMuted }]}>Tafseer</Text>
          </Pressable>
          */}
        </View>

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
  arabicContainer: {
    position: 'relative',
    marginBottom: 8,
    overflow: 'hidden',
    borderRadius: 8,
    minHeight: 64,
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
  stackedTranslations: {
    marginBottom: 12,
  },
  translationPressable: {
    paddingVertical: 4,
  },
  translationDivider: {
    height: 1,
    opacity: 0.2,
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  actionLabel: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '600',
  },
});
