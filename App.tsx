import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { quranService } from './src/services/quranService';
import { bookmarkService } from './src/services/bookmarkService';
import { tafseerService } from './src/services/tafseerService';
import { AppPreferencesProvider, useAppPreferences } from './src/context/AppPreferencesContext';
import { getColors } from './src/utils/theme';
import { FONTS } from './src/utils/constants';

const baseColors = getColors('dark');

const linking = {
  prefixes: ['dhikr://'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Quran: 'search',
          Bookmarks: 'bookmarks',
          Settings: 'settings',
        },
      },
      Surah: {
        path: 'surah',
        parse: {
          surahId: (id: string) => (id ? Number(id) : undefined),
          juzNumber: (juz: string) => (juz ? Number(juz) : undefined),
          initialAyah: (ayah: string) => (ayah ? Number(ayah) : undefined),
        },
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Tafseer download progress banner (slides in from bottom when downloading)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// App content (clean navigation container)
// ─────────────────────────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const { preferences, colors } = useAppPreferences();

  return (
    <NavigationContainer
      linking={linking as any}
      theme={{
        dark: preferences.themeMode === 'dark',
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.background,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.accent,
        },
        fonts: {
          regular: { fontFamily: 'Figtree', fontWeight: 'normal' },
          medium: { fontFamily: 'Figtree', fontWeight: '500' },
          bold: { fontFamily: 'Figtree', fontWeight: 'bold' },
          heavy: { fontFamily: 'Figtree', fontWeight: '900' },
        },
      }}
    >
      <AppNavigator />
      <StatusBar style={preferences.themeMode === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await Font.loadAsync({
        UthmanicHafs: require('./assets/fonts/UthmanicHafs1Ver18.ttf'),
        IndoPak: require('./assets/fonts/indopak.ttf'),
        Figtree: require('./assets/fonts/Figtree.ttf'),
        AyahNumber: require('./assets/fonts/p1.ttf'),
        SurahNames: require('./assets/fonts/sura_names.ttf'),
      });

      quranService.load();
      await bookmarkService.load();
      // Note: tafseerService.startBackgroundDownload() is called inside AppContent
      // after preferences/context are available

      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={baseColors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppPreferencesProvider>
        <AppContent />
      </AppPreferencesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: baseColors.background,
  },
});
