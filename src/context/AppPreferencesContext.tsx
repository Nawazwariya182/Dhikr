import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppPreferences,
  HomeMode,
  preferencesService,
  TranslationLanguage,
  ArabicFont,
} from '../services/preferencesService';
import { AppColors, getColors, ThemeMode } from '../utils/theme';

interface AppPreferencesContextValue {
  preferences: AppPreferences;
  colors: AppColors;
  isLoaded: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setTranslationLanguage: (language: TranslationLanguage) => Promise<void>;
  setHomeMode: (mode: HomeMode) => Promise<void>;
  setArabicFont: (font: ArabicFont) => Promise<void>;
}

const defaultPrefs: AppPreferences = {
  themeMode: 'dark',
  translationLanguage: 'english',
  homeMode: 'surah',
  arabicFont: 'uthmani',
};

const AppPreferencesContext = createContext<AppPreferencesContextValue>({
  preferences: defaultPrefs,
  colors: getColors(defaultPrefs.themeMode),
  isLoaded: false,
  setThemeMode: async () => undefined,
  setTranslationLanguage: async () => undefined,
  setHomeMode: async () => undefined,
  setArabicFont: async () => undefined,
});

export const AppPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPrefs);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const loaded = await preferencesService.load();
      if (mounted) {
        setPreferences(loaded);
        setIsLoaded(true);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AppPreferencesContextValue>(() => {
    const colors = getColors(preferences.themeMode);

    return {
      preferences,
      colors,
      isLoaded,
      setThemeMode: async (mode: ThemeMode) => {
        const next = await preferencesService.save({ themeMode: mode });
        setPreferences(next);
      },
      setTranslationLanguage: async (language: TranslationLanguage) => {
        const next = await preferencesService.save({ translationLanguage: language });
        setPreferences(next);
      },
      setHomeMode: async (mode: HomeMode) => {
        const next = await preferencesService.save({ homeMode: mode });
        setPreferences(next);
      },
      setArabicFont: async (font: ArabicFont) => {
        const next = await preferencesService.save({ arabicFont: font });
        setPreferences(next);
      },
    };
  }, [preferences, isLoaded]);

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
};

export function useAppPreferences() {
  return useContext(AppPreferencesContext);
}
