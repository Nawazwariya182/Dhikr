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
  setEnableHifzBlur: (enabled: boolean) => Promise<void>;
  setDailyRukuGoal: (goal: number) => Promise<void>;
  setRemindersEnabled: (enabled: boolean) => Promise<void>;
  setReminderStartHour: (hour: number) => Promise<void>;
  setReminderEndHour: (hour: number) => Promise<void>;
}

const defaultPrefs: AppPreferences = {
  themeMode: 'dark',
  translationLanguage: 'english',
  homeMode: 'surah',
  arabicFont: 'uthmani',
  enableHifzBlur: false,
  dailyRukuGoal: 1,
  remindersEnabled: false,
  reminderStartHour: 8,
  reminderEndHour: 22,
};

const AppPreferencesContext = createContext<AppPreferencesContextValue>({
  preferences: defaultPrefs,
  colors: getColors(defaultPrefs.themeMode),
  isLoaded: false,
  setThemeMode: async () => undefined,
  setTranslationLanguage: async () => undefined,
  setHomeMode: async () => undefined,
  setArabicFont: async () => undefined,
  setEnableHifzBlur: async () => undefined,
  setDailyRukuGoal: async () => undefined,
  setRemindersEnabled: async () => undefined,
  setReminderStartHour: async () => undefined,
  setReminderEndHour: async () => undefined,
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

    const unsubscribe = preferencesService.subscribe(() => {
      load();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AppPreferencesContextValue>(() => {
    const colors = getColors(preferences.themeMode);

    return {
      preferences,
      colors,
      isLoaded,
      setThemeMode: async (mode: ThemeMode) => {
        setPreferences(prev => ({ ...prev, themeMode: mode }));
        await preferencesService.save({ themeMode: mode });
      },
      setTranslationLanguage: async (language: TranslationLanguage) => {
        setPreferences(prev => ({ ...prev, translationLanguage: language }));
        await preferencesService.save({ translationLanguage: language });
      },
      setHomeMode: async (mode: HomeMode) => {
        setPreferences(prev => ({ ...prev, homeMode: mode }));
        await preferencesService.save({ homeMode: mode });
      },
      setArabicFont: async (font: ArabicFont) => {
        setPreferences(prev => ({ ...prev, arabicFont: font }));
        await preferencesService.save({ arabicFont: font });
      },
      setEnableHifzBlur: async (enabled: boolean) => {
        setPreferences(prev => ({ ...prev, enableHifzBlur: enabled }));
        await preferencesService.save({ enableHifzBlur: enabled });
      },
      setDailyRukuGoal: async (goal: number) => {
        setPreferences(prev => ({ ...prev, dailyRukuGoal: goal }));
        await preferencesService.save({ dailyRukuGoal: goal });
      },
      setRemindersEnabled: async (enabled: boolean) => {
        setPreferences(prev => ({ ...prev, remindersEnabled: enabled }));
        await preferencesService.save({ remindersEnabled: enabled });
      },
      setReminderStartHour: async (hour: number) => {
        setPreferences(prev => ({ ...prev, reminderStartHour: hour }));
        await preferencesService.save({ reminderStartHour: hour });
      },
      setReminderEndHour: async (hour: number) => {
        setPreferences(prev => ({ ...prev, reminderEndHour: hour }));
        await preferencesService.save({ reminderEndHour: hour });
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
