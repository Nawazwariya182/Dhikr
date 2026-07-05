import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Ayah } from '../models/types';
import { tafseerService, TafseerContent } from '../services/tafseerService';
import { AppColors } from '../utils/theme';
import { FONTS } from '../utils/constants';

interface TafseerDrawerProps {
  visible: boolean;
  onClose: () => void;
  ayah: Ayah | null;
  colors: AppColors;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: render inline **bold** spans within a text string
// ─────────────────────────────────────────────────────────────────────────────
const renderInline = (text: string, baseStyle: any, boldStyle: any) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={boldStyle}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={i} style={baseStyle}>{part}</Text>;
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: classify & render a single paragraph block
// ─────────────────────────────────────────────────────────────────────────────
const TafseerBlock: React.FC<{
  text: string;
  isUrdu: boolean;
  colors: AppColors;
}> = ({ text, isUrdu, colors }) => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // 1. Section heading: wrapped in ##...##
  if (trimmed.startsWith('##') && trimmed.endsWith('##')) {
    const heading = trimmed.slice(2, -2).trim();
    return (
      <View style={blockStyles.headingContainer}>
        <View style={[blockStyles.headingAccent, { backgroundColor: colors.primary }]} />
        <Text style={[
          blockStyles.headingText,
          { color: colors.primary },
          isUrdu ? blockStyles.rtlText : blockStyles.ltrText,
        ]}>
          {heading}
        </Text>
      </View>
    );
  }

  // 2. Numbered Hadith/citation block: starts with a digit followed by )
  const hadithMatch = trimmed.match(/^(\d+)\)\s*(.+)$/s);
  if (hadithMatch) {
    const [, num, body] = hadithMatch;
    return (
      <View style={[blockStyles.hadithBlock, { borderLeftColor: colors.primary + '60', backgroundColor: colors.primary + '08' }]}>
        <View style={[blockStyles.hadithNumber, { backgroundColor: colors.primary }]}>
          <Text style={blockStyles.hadithNumberText}>{num}</Text>
        </View>
        <Text style={[
          blockStyles.hadithText,
          { color: colors.textPrimary },
          isUrdu ? blockStyles.rtlText : blockStyles.ltrText,
        ]}>
          {renderInline(body, { color: colors.textPrimary }, { color: colors.textPrimary, fontWeight: '700' })}
        </Text>
      </View>
    );
  }

  // 3. Bullet point: starts with • or -
  if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
    const bulletText = trimmed.replace(/^[•\-]\s*/, '');
    return (
      <View style={blockStyles.bulletRow}>
        <View style={[blockStyles.bulletDot, { backgroundColor: colors.primary }]} />
        <Text style={[
          blockStyles.bodyText,
          { color: colors.textPrimary, flex: 1 },
          isUrdu ? blockStyles.rtlText : blockStyles.ltrText,
        ]}>
          {renderInline(bulletText, { color: colors.textPrimary }, { color: colors.textPrimary, fontWeight: '700' })}
        </Text>
      </View>
    );
  }

  // 4. Plain paragraph
  return (
    <Text style={[
      blockStyles.bodyText,
      { color: colors.textPrimary },
      isUrdu ? blockStyles.rtlText : blockStyles.ltrText,
      blockStyles.paragraph,
    ]}>
      {renderInline(trimmed, { color: colors.textPrimary }, { color: colors.textPrimary, fontWeight: '700' })}
    </Text>
  );
};

const blockStyles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    gap: 10,
  },
  headingAccent: {
    width: 3,
    minHeight: 20,
    borderRadius: 2,
    alignSelf: 'stretch',
  },
  headingText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: FONTS.english,
    flex: 1,
    lineHeight: 26,
  },
  hadithBlock: {
    flexDirection: 'row',
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    gap: 10,
    alignItems: 'flex-start',
  },
  hadithNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  hadithNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: FONTS.english,
  },
  hadithText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 26,
    fontFamily: FONTS.english,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: FONTS.english,
    lineHeight: 26,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontFamily: FONTS.arabic,
    lineHeight: 34,
    fontSize: 16,
  },
  ltrText: {
    textAlign: 'left',
  },
  paragraph: {
    marginBottom: 12,
  },
});

// ─────────────────────────────────────────────────────────────────────────────

export const TafseerDrawer: React.FC<TafseerDrawerProps> = ({
  visible,
  onClose,
  ayah,
  colors,
}) => {
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tafseer, setTafseer] = useState<TafseerContent | null>(null);
  const [activeLang, setActiveLang] = useState<'urdu' | 'english'>('english');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && ayah) {
      setLoading(true);
      setError(null);
      setTafseer(null);
      setIsSpeaking(false);
      Speech.stop();

      tafseerService
        .getTafseer(ayah.surah, ayah.ayah, activeLang === 'english')
        .then((data) => {
          setTafseer(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message || 'Failed to load Tafseer exegesis.');
          setLoading(false);
        });

      // Animate slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Speech.stop();
      setIsSpeaking(false);
    }
  }, [visible, ayah]);

  // On-demand English translation trigger
  useEffect(() => {
    const isEnglishMissingOrBroken = tafseer && (
      !tafseer.english ||
      tafseer.english.includes('QUERY LENGTH LIMIT EXCEEDED') ||
      tafseer.english.includes('MAX ALLOWED QUERY') ||
      /[\u0600-\u06FF]/.test(tafseer.english)
    );

    if (activeLang === 'english' && tafseer && isEnglishMissingOrBroken && ayah && visible) {
      setTranslating(true);
      setError(null);
      tafseerService
        .translateTafseerEnglish(ayah.surah, ayah.ayah, tafseer.urdu)
        .then((translatedText) => {
          setTafseer((prev) => prev ? { ...prev, english: translatedText } : null);
          setTranslating(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to translate exegesis to English. Please check connection and try again.');
          setTranslating(false);
        });
    }
  }, [activeLang, tafseer, ayah, visible]);

  const handleClose = () => {
    Speech.stop();
    setIsSpeaking(false);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleToggleTTS = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = activeLang === 'urdu' ? tafseer?.urdu : tafseer?.english;
    if (!textToSpeak) return;

    setIsSpeaking(true);
    const chunk = textToSpeak.substring(0, 1000) + (textToSpeak.length > 1000 ? '...' : '');
    Speech.speak(chunk, {
      language: activeLang === 'urdu' ? 'ur' : 'en',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  if (!visible || !ayah) return null;

  // ── Render rich formatted Tafseer blocks ─────────────────────────────────
  const renderTafseerContent = () => {
    if (translating) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted, marginTop: 8 }]}>
            Translating exegesis to English...
          </Text>
        </View>
      );
    }

    if (!tafseer) return null;

    const rawText = activeLang === 'urdu' ? tafseer.urdu : (tafseer.english || '');
    const isUrdu = activeLang === 'urdu';

    // Split on double newlines to get blocks
    const blocks = rawText.split(/\n\n+/);

    return (
      <View>
        {blocks.map((block, idx) => (
          <TafseerBlock
            key={idx}
            text={block}
            isUrdu={isUrdu}
            colors={colors}
          />
        ))}

        {/* Source attribution */}
        <View style={[styles.footerBanner, { backgroundColor: colors.background }]}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.accent} />
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {tafseer.source} | Aligned with Sunni Hanafi Scholarship.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: '#000000' }]} />
        </Pressable>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.dragBar, { backgroundColor: colors.border }]} />
            <View style={styles.headerTitleRow}>
              <View>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                  Siraat-ul-Jinan Tafseer
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                  Surah {ayah.surah}, Ayah {ayah.ayah}
                </Text>
              </View>
              <Pressable
                onPress={handleClose}
                style={[styles.closeButton, { backgroundColor: colors.border }]}
                hitSlop={8}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
          </View>

          {/* Actions Row */}
          <View style={[styles.tabsRow, { borderBottomColor: colors.border, justifyContent: 'flex-end' }]}>
            {tafseer && (
              <Pressable
                onPress={handleToggleTTS}
                style={[styles.ttsButton, { borderColor: colors.border }]}
              >
                <Ionicons
                  name={isSpeaking ? 'volume-mute-outline' : 'volume-high-outline'}
                  size={18}
                  color={colors.primary}
                />
                <Text style={[styles.ttsText, { color: colors.primary }]}>
                  {isSpeaking ? 'Stop' : 'Listen'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Content */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                  Fetching Siraat-ul-Jinan Tafseer...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                <Pressable
                  onPress={() => {
                    setLoading(true);
                    setError(null);
                    tafseerService
                      .getTafseer(ayah.surah, ayah.ayah)
                      .then((data) => {
                        setTafseer(data);
                        setLoading(false);
                      })
                      .catch((err) => {
                        setError(err.message || 'Failed to load Tafseer.');
                        setLoading(false);
                      });
                  }}
                  style={[styles.retryButton, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            ) : tafseer ? (
              <View>
                {/* Arabic Ayah + translation */}
                <View style={[styles.ayahBox, { backgroundColor: colors.background + '80', borderColor: colors.border }]}>
                  <Text style={[styles.ayahArabic, { color: colors.textPrimary }]}>
                    {ayah.arabic}
                  </Text>
                  <Text style={[styles.ayahTranslation, { color: colors.textSecondary }]}>
                    {activeLang === 'urdu' ? ayah.urdu : (tafseer.english ? ayah.english : '')}
                  </Text>
                </View>

                {renderTafseerContent()}
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.75,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    alignItems: 'center',
  },
  dragBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: FONTS.english,
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 2,
    width: 200,
  },
  tabButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '600',
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
  },
  ttsText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '600',
  },
  contentScroll: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
  },
  ayahBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ayahArabic: {
    fontFamily: FONTS.arabic,
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  ayahTranslation: {
    fontFamily: FONTS.english,
    fontSize: 14,
    lineHeight: 20,
  },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
});
