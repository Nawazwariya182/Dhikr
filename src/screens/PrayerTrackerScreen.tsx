import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { prayerService, PrayerDay } from '../services/prayerService';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { PrayerTrackerWidget } from '../widgets/components/PrayerTrackerWidget';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { FONTS, SIZES } from '../utils/constants';

const PRAYERS: { key: keyof PrayerDay; name: string; icon: keyof typeof Ionicons.glyphMap; time: string }[] = [
  { key: 'fajr', name: 'Fajr', icon: 'moon-outline', time: 'Dawn' },
  { key: 'dhuhr', name: 'Dhuhr', icon: 'sunny-outline', time: 'Noon' },
  { key: 'asr', name: 'Asr', icon: 'partly-sunny-outline', time: 'Afternoon' },
  { key: 'maghrib', name: 'Maghrib', icon: 'partly-sunny-outline', time: 'Sunset' },
  { key: 'isha', name: 'Isha', icon: 'cloudy-night-outline', time: 'Night' },
];

export const PrayerTrackerScreen: React.FC = () => {
  const { colors } = useAppPreferences();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [prayerDay, setPrayerDay] = useState<PrayerDay>({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });
  const [streak, setStreak] = useState(0);
  const [historyDates, setHistoryDates] = useState<string[]>([]);
  const [historyLogs, setHistoryLogs] = useState<Record<string, PrayerDay>>({});

  const dateStr = prayerService.formatDate(selectedDate);

  const loadData = useCallback(async () => {
    const logs = await prayerService.load();
    setPrayerDay(prayerService.getPrayerDay(dateStr));
    setStreak(prayerService.getStreak());
    
    // Load last 7 days history
    const last7 = prayerService.getLastNDays(7);
    setHistoryDates(last7);
    
    const hLogs: Record<string, PrayerDay> = {};
    for (const d of last7) {
      hLogs[d] = prayerService.getPrayerDay(d);
    }
    setHistoryLogs(hLogs);
  }, [dateStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (prayer: keyof PrayerDay, status: boolean | 'qaza') => {
    const updated = await prayerService.togglePrayer(dateStr, prayer, status);
    setPrayerDay({ ...updated });
    setStreak(prayerService.getStreak());
    
    // Update local history logs state
    setHistoryLogs(prev => ({
      ...prev,
      [dateStr]: { ...updated }
    }));

    // Trigger prayer widget update
    try {
      requestWidgetUpdate({
        widgetName: 'PrayerTracker',
        renderWidget: () => (
          <PrayerTrackerWidget
            fajr={updated.fajr}
            dhuhr={updated.dhuhr}
            asr={updated.asr}
            maghrib={updated.maghrib}
            isha={updated.isha}
            streak={prayerService.getStreak()}
          />
        )
      });
    } catch (e) {}
  };

  const navigateDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (prayerService.formatDate(date) === prayerService.formatDate(today)) {
      return 'Today';
    }
    if (prayerService.formatDate(date) === prayerService.formatDate(yesterday)) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Helper to count completed prayers for a day
  const getCompletedCount = (day: PrayerDay) => {
    return Object.values(day).filter(val => val === true || val === 'qaza').length;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Streak Header Card */}
      <View style={[styles.streakCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={styles.streakInfo}>
          <Text style={[styles.streakTitle, { color: colors.textSecondary }]}>Prayer Streak</Text>
          <Text style={[styles.streakCount, { color: colors.textPrimary }]}>
            {streak} {streak === 1 ? 'Day' : 'Days'}
          </Text>
          <Text style={[styles.streakSubtitle, { color: colors.textMuted }]}>
            Consecutive days with all 5 prayers logged
          </Text>
        </View>
        <View style={[styles.streakBadge, { backgroundColor: streak > 0 ? '#f59e0b20' : colors.surfaceLight }]}> 
          <Ionicons name="flame" size={36} color={streak > 0 ? '#f59e0b' : colors.textMuted} />
        </View>
      </View>

      {/* Date Navigator */}
      <View style={styles.dateSelector}>
        <Pressable onPress={() => navigateDate(-1)} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={[styles.dateText, { color: colors.textPrimary }]}>{formatDateLabel(selectedDate)}</Text>
        <Pressable 
          onPress={() => navigateDate(1)} 
          disabled={prayerService.formatDate(selectedDate) === prayerService.formatDate(new Date())}
          style={[
            styles.arrowButton, 
            prayerService.formatDate(selectedDate) === prayerService.formatDate(new Date()) ? { opacity: 0.3 } : null
          ]}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {/* Prayer List */}
      <View style={styles.prayerList}>
        {PRAYERS.map((item) => {
          const checked = prayerDay[item.key];
          
          return (
            <View
              key={item.key}
              style={[
                styles.prayerItem,
                { 
                  backgroundColor: colors.surface, 
                  borderColor: checked === true 
                    ? '#10b981' 
                    : checked === 'qaza' 
                    ? '#f59e0b' 
                    : colors.border 
                }
              ]}
            >
              <View style={styles.prayerLeft}>
                <View style={[
                  styles.iconContainer, 
                  { 
                    backgroundColor: checked === true 
                      ? '#10b98115' 
                      : checked === 'qaza' 
                      ? '#f59e0b15' 
                      : colors.background 
                  }
                ]}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={checked === true ? '#10b981' : checked === 'qaza' ? '#f59e0b' : colors.textSecondary} 
                  />
                </View>
                <View>
                  <Text style={[styles.prayerName, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.prayerTime, { color: colors.textMuted }]}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.actionContainer}>
                {/* On Time Button */}
                <Pressable
                  onPress={() => handleToggle(item.key, true)}
                  style={[
                    styles.pillButton,
                    {
                      borderColor: checked === true ? '#10b981' : colors.border,
                      backgroundColor: checked === true ? '#10b98120' : 'transparent',
                    }
                  ]}
                >
                  <Ionicons 
                    name={checked === true ? "checkmark-circle" : "ellipse-outline"} 
                    size={14} 
                    color={checked === true ? '#10b981' : colors.textMuted} 
                  />
                  <Text style={[
                    styles.pillText, 
                    { color: checked === true ? '#10b981' : colors.textSecondary }
                  ]}>
                    On Time
                  </Text>
                </Pressable>

                {/* Qaza Button */}
                <Pressable
                  onPress={() => handleToggle(item.key, 'qaza')}
                  style={[
                    styles.pillButton,
                    {
                      borderColor: checked === 'qaza' ? '#f59e0b' : colors.border,
                      backgroundColor: checked === 'qaza' ? '#f59e0b20' : 'transparent',
                    }
                  ]}
                >
                  <Ionicons 
                    name={checked === 'qaza' ? "checkmark-circle" : "ellipse-outline"} 
                    size={14} 
                    color={checked === 'qaza' ? '#f59e0b' : colors.textMuted} 
                  />
                  <Text style={[
                    styles.pillText, 
                    { color: checked === 'qaza' ? '#f59e0b' : colors.textSecondary }
                  ]}>
                    Qaza
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* Weekly History */}
      <View style={styles.historySection}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Last 7 Days</Text>
        <View style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          {historyDates.slice().reverse().map((date) => {
            const day = historyLogs[date] || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
            const completed = getCompletedCount(day);
            const isToday = date === prayerService.formatDate(new Date());
            
            // Format single letter weekday
            const d = new Date(date);
            const weekday = d.toLocaleDateString('en-US', { weekday: 'narrow' });
            
            return (
              <View key={date} style={styles.historyDay}>
                <Text style={[
                  styles.historyDayLabel, 
                  { color: isToday ? colors.primary : colors.textSecondary },
                  isToday ? { fontWeight: 'bold' } : null
                ]}>
                  {weekday}
                </Text>
                
                {/* Completed dots */}
                <View style={styles.progressContainer}>
                  <View style={[
                    styles.historyDot, 
                    { 
                      backgroundColor: completed === 5 
                        ? colors.primary 
                        : completed > 0 
                        ? colors.primary + '40' 
                        : colors.surfaceLight,
                      borderColor: completed === 5 ? colors.primary : colors.border
                    }
                  ]}>
                    <Text style={{ 
                      fontSize: 10, 
                      fontWeight: 'bold', 
                      color: completed === 5 ? colors.white : colors.textSecondary 
                    }}>
                      {completed}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  streakCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  streakCount: {
    fontFamily: FONTS.english,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  streakSubtitle: {
    fontFamily: FONTS.english,
    fontSize: 12,
  },
  streakBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  arrowButton: {
    padding: 8,
  },
  dateText: {
    fontFamily: FONTS.english,
    fontSize: 18,
    fontWeight: '700',
  },
  prayerList: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.2,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerName: {
    fontFamily: FONTS.english,
    fontSize: 16,
    fontWeight: '700',
  },
  prayerTime: {
    fontFamily: FONTS.english,
    fontSize: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.2,
  },
  pillText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '600',
  },
  historyTitle: {
    fontFamily: FONTS.english,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  historySection: {
    marginBottom: 40,
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
  historyCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDay: {
    alignItems: 'center',
    flex: 1,
  },
  historyDayLabel: {
    fontFamily: FONTS.english,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  historyDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
