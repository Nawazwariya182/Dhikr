import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../utils/constants';
import { useAppPreferences } from '../context/AppPreferencesContext';

export const SettingsScreen: React.FC = () => {
  const { preferences, setTranslationLanguage, setThemeMode, setArabicFont, colors } = useAppPreferences();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Dhikr</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>Quran Reader • Version 2.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Reading Preferences</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.prefLabel, { color: colors.textSecondary }]}>Translation Language</Text>
          <View style={[styles.segmentRow, { backgroundColor: colors.background }]}> 
            <Pressable
              onPress={() => setTranslationLanguage('english')}
              style={[
                styles.segmentButton,
                preferences.translationLanguage === 'english' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.translationLanguage === 'english' ? colors.white : colors.textSecondary }]}>English</Text>
            </Pressable>
            <Pressable
              onPress={() => setTranslationLanguage('urdu')}
              style={[
                styles.segmentButton,
                preferences.translationLanguage === 'urdu' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.translationLanguage === 'urdu' ? colors.white : colors.textSecondary }]}>Urdu</Text>
            </Pressable>
          </View>

          <Text style={[styles.prefLabel, { color: colors.textSecondary, marginTop: 14 }]}>Quran Font Style</Text>
          <View style={[styles.segmentRow, { backgroundColor: colors.background }]}> 
            <Pressable
              onPress={() => setArabicFont('uthmani')}
              style={[
                styles.segmentButton,
                preferences.arabicFont === 'uthmani' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.arabicFont === 'uthmani' ? colors.white : colors.textSecondary }]}>Uthmani</Text>
            </Pressable>
            <Pressable
              onPress={() => setArabicFont('indopak')}
              style={[
                styles.segmentButton,
                preferences.arabicFont === 'indopak' ? { backgroundColor: colors.primary } : null,
              ]}
            >
              <Text style={[styles.segmentText, { color: preferences.arabicFont === 'indopak' ? colors.white : colors.textSecondary }]}>IndoPak</Text>
            </Pressable>
          </View>

          <Text style={[styles.prefLabel, { color: colors.textSecondary, marginTop: 14 }]}>Appearance</Text>
          <View style={[styles.segmentRow, { backgroundColor: colors.background }]}> 
            <Pressable
              onPress={() => setThemeMode('dark')}
              style={[styles.segmentButton, preferences.themeMode === 'dark' ? { backgroundColor: colors.primary } : null]}
            >
              <Text style={[styles.segmentText, { color: preferences.themeMode === 'dark' ? colors.white : colors.textSecondary }]}>Dark</Text>
            </Pressable>
            <Pressable
              onPress={() => setThemeMode('light')}
              style={[styles.segmentButton, preferences.themeMode === 'light' ? { backgroundColor: colors.primary } : null]}
            >
              <Text style={[styles.segmentText, { color: preferences.themeMode === 'light' ? colors.white : colors.textSecondary }]}>Light</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>About</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}> 
            Dhikr is a clean, respectful Quran reading application designed for
            daily recitation and study. It provides a distraction-free interface to read the Quran in Arabic along with English and Urdu translations By Ahmed Raza Khan. Dhikr is built with love and respect for the Holy Quran, aiming to make it easy for everyone to access and read the Quran on their mobile devices. May this app be a means of bringing us closer to the words of Allah. Ameen.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Quran Data</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Surahs</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>114</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Ayahs</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>6,236</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Juz</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>30</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Rukus</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>556</Text>
          </View>
        </View>
      </View>

      {/* <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Fonts</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Arabic Text</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>Uthmanic Hafs v18</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Translation</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>Figtree</Text>
          </View>
        </View>
      </View> */}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}> 
          Made with respect for the Holy Quran By Nawaz Wariya.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#3b82f620',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontFamily: FONTS.english,
    fontSize: 55,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: FONTS.english,
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  prefLabel: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    gap: 6,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  segmentText: {
    fontFamily: FONTS.english,
    fontWeight: '600',
  },
  aboutText: {
    fontFamily: FONTS.english,
    fontSize: 15,
    lineHeight: 22,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#64748b55',
  },
  statLabel: {
    fontFamily: FONTS.english,
    fontSize: 15,
  },
  statValue: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontFamily: FONTS.english,
    fontSize: 13,
  },
});
