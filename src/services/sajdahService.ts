import AsyncStorage from '@react-native-async-storage/async-storage';
import sajdaData from '../../assets/json/sajda.json';

export interface SajdahLog {
  id: number;
  completed: boolean;
  timestamp?: number;
}

export type SajdahLogs = Record<number, SajdahLog>;

const STORAGE_KEY = '@dhikr_sajdah_logs';

class SajdahService {
  private logs: SajdahLogs = {};
  private loaded = false;

  async load(): Promise<SajdahLogs> {
    if (this.loaded) return this.logs;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.logs = JSON.parse(raw) as SajdahLogs;
      } else {
        // Initialize empty logs for all 15 sajdahs
        this.logs = {};
        sajdaData.forEach((s: any) => {
          this.logs[s.id] = { id: s.id, completed: false };
        });
      }
    } catch (e) {
      console.warn('Error loading sajdah logs:', e);
      this.logs = {};
    }
    this.loaded = true;
    return this.logs;
  }

  async getLogs(): Promise<SajdahLogs> {
    await this.load();
    return this.logs;
  }

  async toggleSajdah(id: number): Promise<SajdahLog> {
    await this.load();
    
    if (!this.logs[id]) {
      this.logs[id] = { id, completed: false };
    }

    const currentStatus = this.logs[id].completed;
    this.logs[id] = {
      id,
      completed: !currentStatus,
      timestamp: !currentStatus ? Date.now() : undefined,
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
      
      // Auto backup to Google Drive
      import('./backupService').then(({ backupService }) => {
        backupService.triggerAutoBackup();
      }).catch(err => console.warn('Auto backup trigger error:', err));
    } catch (e) {
      console.warn('Error saving sajdah logs:', e);
    }

    return this.logs[id];
  }

  async isCompleted(id: number): Promise<boolean> {
    await this.load();
    return !!this.logs[id]?.completed;
  }

  async getCompletedCount(): Promise<number> {
    await this.load();
    return Object.values(this.logs).filter(log => log.completed).length;
  }

  async restoreData(logs: SajdahLogs): Promise<void> {
    this.logs = logs || {};
    this.loaded = true;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
  }
}

export const sajdahService = new SajdahService();
