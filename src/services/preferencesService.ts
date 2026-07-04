import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../utils/theme';

export type TranslationLanguage = 'english' | 'urdu';
export type HomeMode = 'surah' | 'juz';
export type ArabicFont = 'uthmani' | 'indopak';

export interface AppPreferences {
  themeMode: ThemeMode;
  translationLanguage: TranslationLanguage;
  homeMode: HomeMode;
  arabicFont: ArabicFont;
}

const PREFERENCES_KEY = '@dhikr_preferences';

const defaultPreferences: AppPreferences = {
  themeMode: 'dark',
  translationLanguage: 'english',
  homeMode: 'surah',
  arabicFont: 'uthmani',
};

class PreferencesService {
  private preferences: AppPreferences = defaultPreferences;

  async load(): Promise<AppPreferences> {
    try {
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (raw) {
        this.preferences = {
          ...defaultPreferences,
          ...(JSON.parse(raw) as Partial<AppPreferences>),
        };
      }
    } catch {
      this.preferences = defaultPreferences;
    }

    return this.preferences;
  }

  getPreferences(): AppPreferences {
    return this.preferences;
  }

  async save(partial: Partial<AppPreferences>): Promise<AppPreferences> {
    this.preferences = { ...this.preferences, ...partial };
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
    return this.preferences;
  }
}

export const preferencesService = new PreferencesService();
