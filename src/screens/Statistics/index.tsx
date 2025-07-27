import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {HabitRecord, HabitStats} from '@Types/index';
import {memo, useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

const Statistics = () => {
  const [stats, setStats] = useState<HabitStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    cleanDays: 0,
  });
  const [calendarData, setCalendarData] = useState<{[key: string]: HabitRecord}>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loadStatistics = useCallback(async () => {
    try {
      const currentStreak = parseInt((await AsyncStorage.getItem('current_streak')) || '0', 10);
      const longestStreak = parseInt((await AsyncStorage.getItem('longest_streak')) || '0', 10);

      // Calculate total and clean days from stored records
      const keys = await AsyncStorage.getAllKeys();
      const habitKeys = keys.filter(key => key.startsWith('habit_'));
      const records = await AsyncStorage.multiGet(habitKeys);

      let totalDays = 0;
      let cleanDays = 0;
      let maxStreak = 0;
      let tempStreak = 0;

      // Sort records by date
      const sortedRecords = records
        .map(([key, value]) => JSON.parse(value || '{}'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      sortedRecords.forEach((record: HabitRecord) => {
        totalDays++;
        if (!record.fapped) {
          cleanDays++;
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      });

      // Update longest streak if current is higher
      if (maxStreak > longestStreak) {
        await AsyncStorage.setItem('longest_streak', maxStreak.toString());
      }

      setStats({
        currentStreak,
        longestStreak: Math.max(longestStreak, maxStreak),
        totalDays,
        cleanDays,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, []);

  const loadCalendarData = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const habitKeys = keys.filter(key => key.startsWith('habit_'));
      const records = await AsyncStorage.multiGet(habitKeys);

      const data: {[key: string]: HabitRecord} = {};
      records.forEach(([key, value]) => {
        if (value) {
          const record: HabitRecord = JSON.parse(value);
          data[record.date] = record;
        }
      });

      setCalendarData(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
    loadCalendarData();
  }, [currentMonth, loadStatistics, loadCalendarData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadStatistics();
      loadCalendarData();
    }, [loadStatistics, loadCalendarData]),
  );

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const current = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = current.toISOString().split('T')[0];
        const isCurrentMonth = current.getMonth() === month;
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        const record = calendarData[dateStr];

        weekDays.push({
          date: new Date(current),
          dateStr,
          isCurrentMonth,
          isToday,
          record,
        });

        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);

      // Stop if we've filled the month
      if (current.getMonth() !== month && week >= 4) break;
    }

    return calendar;
  };

  const getDayColor = (record: HabitRecord | undefined, isCurrentMonth: boolean, isToday: boolean) => {
    if (!isCurrentMonth) return '#666';
    if (isToday) return COLORS.primaryComponent;
    if (!record) return '#888';
    return record.fapped ? '#F44336' : '#4CAF50';
  };

  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getSuccessRate = () => {
    if (stats.totalDays === 0) return 0;
    return Math.round((stats.cleanDays / stats.totalDays) * 100);
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Stats */}
          <View style={styles.statsContainer}>
            <Typography element="h1" style={styles.title}>
              Statistics
            </Typography>

            <View style={styles.statGrid}>
              <View style={styles.statCard}>
                <Typography element="h1" style={styles.statNumber}>
                  {stats.currentStreak}
                </Typography>
                <Typography element="body" style={styles.statLabel}>
                  Current Streak
                </Typography>
              </View>

              <View style={styles.statCard}>
                <Typography element="h1" style={styles.statNumber}>
                  {stats.longestStreak}
                </Typography>
                <Typography element="body" style={styles.statLabel}>
                  Best Streak
                </Typography>
              </View>

              <View style={styles.statCard}>
                <Typography element="h1" style={styles.statNumber}>
                  {getSuccessRate()}%
                </Typography>
                <Typography element="body" style={styles.statLabel}>
                  Success Rate
                </Typography>
              </View>

              <View style={styles.statCard}>
                <Typography element="h1" style={styles.statNumber}>
                  {stats.cleanDays}/{stats.totalDays}
                </Typography>
                <Typography element="body" style={styles.statLabel}>
                  Clean Days
                </Typography>
              </View>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                <Typography element="h2" style={styles.navText}>
                  ‹
                </Typography>
              </TouchableOpacity>

              <Typography element="h2" style={styles.monthText}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Typography>

              <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                <Typography element="h2" style={styles.navText}>
                  ›
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Day headers */}
            <View style={styles.dayHeadersContainer}>
              {dayNames.map(day => (
                <View key={day} style={styles.dayHeader}>
                  <Typography element="caption" style={styles.dayHeaderText}>
                    {day}
                  </Typography>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {generateCalendar().map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {week.map((day, dayIndex) => (
                    <View
                      key={dayIndex}
                      style={[
                        styles.dayCell,
                        {
                          backgroundColor: getDayColor(day.record, day.isCurrentMonth, day.isToday),
                          opacity: day.isCurrentMonth ? 1 : 0.3,
                        },
                      ]}>
                      <Typography
                        element="body"
                        style={[styles.dayText, {color: day.isCurrentMonth ? '#fff' : '#666'}]}>
                        {day.date.getDate()}
                      </Typography>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#4CAF50'}]} />
                <Typography element="caption" style={styles.legendText}>
                  Clean Day
                </Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#F44336'}]} />
                <Typography element="caption" style={styles.legendText}>
                  Relapse
                </Typography>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#888'}]} />
                <Typography element="caption" style={styles.legendText}>
                  No Data
                </Typography>
              </View>
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default memo(Statistics);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.spacing,
  },
  title: {
    textAlign: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  statsContainer: {
    marginBottom: SIZES.spacing * 2,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  statNumber: {
    color: COLORS.primaryComponent,
    textAlign: 'center',
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 4,
  },
  calendarContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: SIZES.spacing,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  navButton: {
    padding: 8,
  },
  navText: {
    fontSize: 24,
  },
  monthText: {
    textAlign: 'center',
  },
  dayHeadersContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing / 2,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    opacity: 0.7,
  },
  calendarGrid: {
    marginBottom: SIZES.spacing,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SIZES.spacing,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    opacity: 0.8,
  },
});
