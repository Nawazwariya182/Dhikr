import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../utils/theme';

export type TranslationLanguage = 'english' | 'urdu' | 'both';
export type HomeMode = 'surah' | 'juz';
export type ArabicFont = 'uthmani' | 'indopak';

export interface AppPreferences {
  themeMode: ThemeMode;
  translationLanguage: TranslationLanguage;
  homeMode: HomeMode;
  arabicFont: ArabicFont;
  enableHifzBlur: boolean;
  dailyRukuGoal: number;
  remindersEnabled: boolean;
  reminderStartHour: number;
  reminderEndHour: number;
}

const PREFERENCES_KEY = '@dhikr_preferences';

const defaultPreferences: AppPreferences = {
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

class PreferencesService {
  private preferences: AppPreferences = defaultPreferences;
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

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
    this.notify();
    
    // Auto backup to Google Drive
    import('./backupService').then(({ backupService }) => {
      backupService.triggerAutoBackup();
    }).catch(err => console.warn('Auto backup trigger error:', err));

    return this.preferences;
  }
}

export const preferencesService = new PreferencesService();
