import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';
import React from 'react';
import { DigitalDetoxWidget } from '../widgets/components/DigitalDetoxWidget';

const SECONDS_KEY = 'dhikr_spiritual_seconds';
const DATE_KEY = 'dhikr_spiritual_last_reset_date';
const MINUTES_KEY = 'dhikr_spiritual_time'; // matches widget-task-handler key

class SpiritualTimeTracker {
  private lastDateStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async resetIfNewDay(): Promise<number> {
    const today = this.lastDateStr();
    const storedDate = await AsyncStorage.getItem(DATE_KEY);
    if (storedDate !== today) {
      await AsyncStorage.setItem(DATE_KEY, today);
      await AsyncStorage.setItem(SECONDS_KEY, '0');
      await AsyncStorage.setItem(MINUTES_KEY, '0');
      return 0;
    }
    const secRaw = await AsyncStorage.getItem(SECONDS_KEY);
    return secRaw ? Number(secRaw) : 0;
  }

  async addActiveSeconds(seconds: number): Promise<void> {
    try {
      const currentSeconds = await this.resetIfNewDay();
      const newSeconds = currentSeconds + seconds;
      const newMinutes = Math.floor(newSeconds / 60);

      await AsyncStorage.setItem(SECONDS_KEY, String(newSeconds));
      await AsyncStorage.setItem(MINUTES_KEY, String(newMinutes));

      // Trigger immediate widget update
      await this.updateWidget(newMinutes);
    } catch (e) {
      console.log('Error adding active seconds:', e);
    }
  }

  async getMinutes(): Promise<number> {
    try {
      await this.resetIfNewDay();
      const minRaw = await AsyncStorage.getItem(MINUTES_KEY);
      return minRaw ? Number(minRaw) : 0;
    } catch {
      return 0;
    }
  }

  async updateWidget(minutes?: number): Promise<void> {
    try {
      const mins = minutes !== undefined ? minutes : await this.getMinutes();
      requestWidgetUpdate({
        widgetName: 'DigitalDetox',
        renderWidget: () => React.createElement(DigitalDetoxWidget, {
          spiritualTime: mins,
          spiritualGoal: 30,
          otherTime: 0
        })
      });
    } catch (e) {
      console.log('Error updating digital detox widget:', e);
    }
  }
}

export const spiritualTimeTracker = new SpiritualTimeTracker();
