import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { surahIntroService, SurahIntro } from '../services/surahIntroService';
import { AppColors } from '../utils/theme';
import { FONTS } from '../utils/constants';

interface SurahIntroModalProps {
  visible: boolean;
  onClose: () => void;
  surahId: number;
  surahNameTranslit: string;
  colors: AppColors;
}

export const SurahIntroModal: React.FC<SurahIntroModalProps> = ({
  visible,
  onClose,
  surahId,
  surahNameTranslit,
  colors,
}) => {
  const intro: SurahIntro = surahIntroService.getIntro(surahId);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={styles.backdrop} />
        </Pressable>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {surahNameTranslit || intro.name}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Historical Surah Context & Shan-e-Nuzul
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.border }]}
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {/* Metadata badges */}
            <View style={styles.badgesRow}>
              <View style={[styles.badge, { backgroundColor: colors.background }]}>
                <Ionicons name="location-outline" size={14} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                  {intro.period}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: colors.background }]}>
                <Ionicons name="list-outline" size={14} color={colors.accent} />
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>
                  Order: #{intro.order}
                </Text>
              </View>
            </View>

            {/* Context Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="book-outline" size={16} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  Shan-e-Nuzul (Revelation Context)
                </Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.textPrimary }]}>
                {intro.context}
              </Text>
            </View>

            {/* Themes Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb-outline" size={16} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                  Key Themes & Lessons
                </Text>
              </View>
              <Text style={[styles.bodyText, { color: colors.textPrimary }]}>
                {intro.themes}
              </Text>
            </View>

            {/* Scholar note */}
            <View style={[styles.noteBox, { backgroundColor: colors.background }]}>
              <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.noteText, { color: colors.textMuted }]}>
                Sourced from Sunni Hanafi commentaries (Tafsir Khaza\'in-ul-Irfan & Siraat-ul-Jinan).
              </Text>
            </View>
          </ScrollView>

          {/* Footer close button */}
          <Pressable
            onPress={onClose}
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.actionButtonText}>Proceed to Surah</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: FONTS.english,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontFamily: FONTS.english,
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bodyText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    lineHeight: 22,
  },
  noteBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
    alignItems: 'center',
  },
  noteText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  actionButtonText: {
    color: '#ffffff',
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '700',
  },
});
