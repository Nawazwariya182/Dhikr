import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set default notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  /**
   * Request permissions to show notifications
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  /**
   * Schedules Ruku reminders every 2 hours during the active window
   */
  async scheduleRukuReminders(
    enabled: boolean,
    dailyGoalRukus: number,
    startHour: number,
    endHour: number
  ): Promise<void> {
    if (Platform.OS === 'web') return;

    // First, clear all scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!enabled) {
      console.log('Ruku reminders are disabled.');
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted.');
      return;
    }

    console.log(`Scheduling Ruku reminders. Goal: ${dailyGoalRukus} Ruku(s) daily. Active window: ${startHour}h to ${endHour}h.`);

    const now = new Date();
    let scheduledCount = 0;

    // Pre-schedule reminders for the next 7 days at 2-hour intervals
    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      for (let hour = startHour; hour <= endHour; hour += 2) {
        const triggerDate = new Date();
        triggerDate.setDate(now.getDate() + dayOffset);
        triggerDate.setHours(hour, 0, 0, 0);

        // If the calculated time is in the past, skip it
        if (triggerDate.getTime() <= now.getTime()) {
          continue;
        }

        // Schedule the local notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Daily Ruku Reminder 📖',
            body: `Assalamu Alaikum! Remember to read your daily Quran Ruku goal (${dailyGoalRukus} Ruku${dailyGoalRukus > 1 ? 's' : ''}). Set aside a few minutes for immense blessings.`,
            sound: true,
            data: { screen: 'Quran' },
          },
          trigger: { 
            type: Notifications.SchedulableTriggerInputTypes.DATE, 
            date: triggerDate 
          },
        });
        scheduledCount += 1;
        
        // Limit total scheduled to 60 to avoid OS limits (iOS caps at 64)
        if (scheduledCount >= 60) {
          break;
        }
      }
      if (scheduledCount >= 60) {
        break;
      }
    }

    console.log(`Successfully scheduled ${scheduledCount} Ruku reminders locally.`);
  }

  /**
   * Schedule a one-off immediate test notification
   */
  async triggerTestNotification(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Dhikr App Test Alert 🔔',
        body: 'This is a test notification to verify local reminder triggers.',
        sound: true,
      },
      trigger: null, // trigger immediately
    });
  }
}

export const notificationService = new NotificationService();
