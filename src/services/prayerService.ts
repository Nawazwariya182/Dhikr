import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PrayerDay {
  fajr: boolean | 'qaza';
  dhuhr: boolean | 'qaza';
  asr: boolean | 'qaza';
  maghrib: boolean | 'qaza';
  isha: boolean | 'qaza';
}

export type PrayerLogs = Record<string, PrayerDay>;

const STORAGE_KEY = '@dhikr_prayer_logs';

const defaultDay: PrayerDay = {
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
};

class PrayerService {
  private logs: PrayerLogs = {};
  private loaded = false;

  async load(): Promise<PrayerLogs> {
    if (this.loaded) return this.logs;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.logs = JSON.parse(raw) as PrayerLogs;
      }
    } catch (e) {
      console.warn('Error loading prayer logs:', e);
      this.logs = {};
    }
    this.loaded = true;
    return this.logs;
  }

  async restoreData(logs: PrayerLogs): Promise<void> {
    this.logs = logs || {};
    this.loaded = true;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
  }

  getPrayerDay(dateStr: string): PrayerDay {
    return this.logs[dateStr] ? { ...this.logs[dateStr] } : { ...defaultDay };
  }

  async togglePrayer(dateStr: string, prayer: keyof PrayerDay, targetStatus?: boolean | 'qaza'): Promise<PrayerDay> {
    await this.load();
    
    if (!this.logs[dateStr]) {
      this.logs[dateStr] = { ...defaultDay };
    }
    
    const current = this.logs[dateStr][prayer];
    
    if (targetStatus !== undefined) {
      if (current === targetStatus) {
        this.logs[dateStr][prayer] = false;
      } else {
        this.logs[dateStr][prayer] = targetStatus;
      }
    } else {
      // Toggle logic for simple toggling (e.g. from widgets)
      if (current === true || current === 'qaza') {
        this.logs[dateStr][prayer] = false;
      } else {
        this.logs[dateStr][prayer] = true;
      }
    }
    
    // Clean up empty days
    const day = this.logs[dateStr];
    if (!day.fajr && !day.dhuhr && !day.asr && !day.maghrib && !day.isha) {
      delete this.logs[dateStr];
    }
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
      
      // Auto backup to Google Drive
      import('./backupService').then(({ backupService }) => {
        backupService.triggerAutoBackup();
      }).catch(err => console.warn('Auto backup trigger error:', err));
    } catch (e) {
      console.warn('Error saving prayer logs:', e);
    }
    
    return day;
  }

  // Calculate streak of consecutive days where all 5 prayers were completed
  getStreak(): number {
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateStr = this.formatDate(checkDate);
      const day = this.logs[dateStr];
      
      const isComplete = day && 
                          day.fajr === true && 
                          day.dhuhr === true && 
                          day.asr === true && 
                          day.maghrib === true && 
                          day.isha === true;
      
      if (isComplete) {
        streak++;
        // Go back 1 day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If checking today and it's not complete, check yesterday to continue streak
        if (streak === 0 && dateStr === this.formatDate(today)) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    
    return streak;
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Get date strings for last N days
  getLastNDays(n: number): string[] {
    const dates: string[] = [];
    for (let i = 0; i < n; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(this.formatDate(d));
    }
    return dates;
  }
}

export const prayerService = new PrayerService();
