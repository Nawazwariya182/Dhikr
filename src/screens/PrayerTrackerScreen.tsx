import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Modal } from 'react-native';
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

  // Calendar states
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

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

  // Sync calendar current month view with selected date when opened
  useEffect(() => {
    if (calendarVisible) {
      setCalendarMonth(new Date(selectedDate));
    }
  }, [calendarVisible, selectedDate]);

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

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(calendarMonth);
    selected.setDate(day);
    setSelectedDate(selected);
    setCalendarVisible(false);
  };

  const handleMonthChange = (offset: number) => {
    const nextMonth = new Date(calendarMonth);
    nextMonth.setMonth(nextMonth.getMonth() + offset);
    setCalendarMonth(nextMonth);
  };

  const renderCalendar = () => {
    const { firstDay, totalDays } = getDaysInMonth(calendarMonth);
    const dayCells = [];
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Empty cells padding
    for (let i = 0; i < firstDay; i++) {
      dayCells.push(<View key={`empty-${i}`} style={styles.calendarDayCellEmpty} />);
    }

    const todayStr = prayerService.formatDate(new Date());
    const selectedStr = prayerService.formatDate(selectedDate);

    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(calendarMonth);
      cellDate.setDate(day);
      const cellDateStr = prayerService.formatDate(cellDate);
      const isSelected = cellDateStr === selectedStr;
      const isToday = cellDateStr === todayStr;
      
      // Prevent selecting future dates
      const cellStart = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()).getTime();
      const todayStart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
      const isFuture = cellStart > todayStart;

      dayCells.push(
        <Pressable
          key={`day-${day}`}
          disabled={isFuture}
          onPress={() => handleSelectDay(day)}
          style={[
            styles.calendarDayCell,
            isToday ? { borderColor: colors.primary, borderWidth: 1.5 } : null,
            isSelected ? { backgroundColor: colors.primary } : null,
            isFuture ? { opacity: 0.25 } : null,
          ]}
        >
          <Text
            style={[
              styles.calendarDayText,
              { color: isSelected ? colors.white : colors.textPrimary },
              isSelected ? { fontWeight: 'bold' } : null,
            ]}
          >
            {day}
          </Text>
        </Pressable>
      );
    }

    // Group into 7-day rows
    const rows = [];
    let row = [];
    for (let i = 0; i < dayCells.length; i++) {
      row.push(dayCells[i]);
      if (row.length === 7 || i === dayCells.length - 1) {
        rows.push(
          <View key={`row-${rows.length}`} style={styles.calendarWeekRow}>
            {row}
          </View>
        );
        row = [];
      }
    }

    return (
      <Modal visible={calendarVisible} transparent animationType="fade">
        <View style={styles.calendarOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setCalendarVisible(false)} />
          <View style={[styles.calendarCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Header: Month selector */}
            <View style={styles.calendarHeader}>
              <Pressable onPress={() => handleMonthChange(-1)} style={styles.calendarMonthNav} hitSlop={8}>
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
              </Pressable>
              <Text style={[styles.calendarMonthLabel, { color: colors.textPrimary }]}>
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <Pressable onPress={() => handleMonthChange(1)} style={styles.calendarMonthNav} hitSlop={8}>
                <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            {/* Weekday letters */}
            <View style={styles.calendarWeekRow}>
              {weekdays.map((wd, idx) => (
                <View key={`wd-${idx}`} style={styles.calendarDayCellEmpty}>
                  <Text style={[styles.calendarWeekdayText, { color: colors.textMuted }]}>{wd}</Text>
                </View>
              ))}
            </View>

            {/* Grid Days */}
            <View style={styles.calendarGrid}>
              {rows}
            </View>

            {/* Cancel btn */}
            <Pressable
              onPress={() => setCalendarVisible(false)}
              style={[styles.calendarCloseBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: 'bold' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
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
        
        {/* Clickable Date display */}
        <Pressable onPress={() => setCalendarVisible(true)} style={styles.dateLabelPressable} hitSlop={12}>
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>{formatDateLabel(selectedDate)}</Text>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} style={{ marginLeft: 8 }} />
        </Pressable>

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

      {/* Render Calendar Modal */}
      {renderCalendar()}
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
  dateLabelPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  // Calendar Dialog Overlay Styles
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  calendarMonthNav: {
    padding: 8,
  },
  calendarMonthLabel: {
    fontFamily: FONTS.english,
    fontSize: 17,
    fontWeight: '800',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calendarDayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayCellEmpty: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayText: {
    fontFamily: FONTS.english,
    fontSize: 14,
    fontWeight: '600',
  },
  calendarWeekdayText: {
    fontFamily: FONTS.english,
    fontSize: 12,
    fontWeight: '800',
  },
  calendarGrid: {
    width: '100%',
    marginVertical: 4,
  },
  calendarCloseBtn: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
