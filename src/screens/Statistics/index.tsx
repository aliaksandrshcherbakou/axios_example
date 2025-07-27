import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import {useFocusEffect} from '@react-navigation/native';
import {memo, useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {HabitService} from '../../services/habitService';
import {HabitRecord, HabitStats} from '../../types';

const Statistics = () => {
  const [stats, setStats] = useState<HabitStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    cleanDays: 0,
  });
  const [calendarData, setCalendarData] = useState<{[key: string]: boolean}>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {user} = useAuth();

  const loadStatistics = useCallback(async () => {
    if (!user) return;

    try {
      // Get all habit records
      const records = await HabitService.getAllHabitRecords(user.uid);

      // Calculate statistics
      const calculatedStats = HabitService.calculateStats(records);
      setStats(calculatedStats);

      // Prepare calendar data
      const calendar: {[key: string]: boolean} = {};
      records.forEach((record: HabitRecord) => {
        calendar[record.date] = !record.fapped; // true = clean day, false = relapse day
      });
      setCalendarData(calendar);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, [user]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useFocusEffect(
    useCallback(() => {
      loadStatistics();
    }, [loadStatistics]),
  );

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date().toISOString().split('T')[0];

    // Generate calendar days
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isToday = dateString === today;
      const hasData = calendarData.hasOwnProperty(dateString);
      const isCleanDay = calendarData[dateString] === true;
      const isRelapseDay = calendarData[dateString] === false;

      let backgroundColor = 'transparent';
      let textColor = COLORS.White;

      if (hasData) {
        if (isCleanDay) {
          backgroundColor = '#4CAF50'; // Green for clean days
        } else if (isRelapseDay) {
          backgroundColor = '#F44336'; // Red for relapse days
        }
      }

      if (isToday) {
        backgroundColor = COLORS.primaryComponent;
      }

      if (!isCurrentMonth) {
        textColor = '#666';
      }

      days.push(
        <View key={dateString} style={[styles.calendarDay, {backgroundColor}]}>
          <Typography element="caption" style={[styles.calendarDayText, {color: textColor}]}>
            {date.getDate()}
          </Typography>
        </View>,
      );
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Typography element="h1" style={styles.title}>
              Statistics
            </Typography>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Typography element="h2" style={styles.statNumber}>
                {stats.currentStreak}
              </Typography>
              <Typography element="body" style={styles.statLabel}>
                Current Streak
              </Typography>
            </View>

            <View style={styles.statCard}>
              <Typography element="h2" style={styles.statNumber}>
                {stats.longestStreak}
              </Typography>
              <Typography element="body" style={styles.statLabel}>
                Longest Streak
              </Typography>
            </View>

            <View style={styles.statCard}>
              <Typography element="h2" style={styles.statNumber}>
                {stats.cleanDays}
              </Typography>
              <Typography element="body" style={styles.statLabel}>
                Clean Days
              </Typography>
            </View>

            <View style={styles.statCard}>
              <Typography element="h2" style={styles.statNumber}>
                {stats.totalDays > 0 ? Math.round((stats.cleanDays / stats.totalDays) * 100) : 0}%
              </Typography>
              <Typography element="body" style={styles.statLabel}>
                Success Rate
              </Typography>
            </View>
          </View>

          {/* Calendar */}
          <View style={styles.calendarContainer}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <View style={styles.monthNavigation}>
                <TouchableOpacity onPress={() => navigateMonth(-1)}>
                  <Typography element="h2" style={styles.navButton}>
                    ‹
                  </Typography>
                </TouchableOpacity>

                <Typography element="h2" style={styles.monthTitle}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Typography>

                <TouchableOpacity onPress={() => navigateMonth(1)}>
                  <Typography element="h2" style={styles.navButton}>
                    ›
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            {/* Week Days */}
            <View style={styles.weekDaysContainer}>
              {weekDays.map(day => (
                <View key={day} style={styles.weekDayContainer}>
                  <Typography element="caption" style={styles.weekDayText}>
                    {day}
                  </Typography>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>{renderCalendar()}</View>

            {/* Legend */}
            <View style={styles.legend}>
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
                <View style={[styles.legendColor, {backgroundColor: COLORS.primaryComponent}]} />
                <Typography element="caption" style={styles.legendText}>
                  Today
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
  header: {
    marginBottom: SIZES.spacing * 2,
    paddingTop: SIZES.spacing,
  },
  title: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing * 3,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    width: '48%',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  statNumber: {
    color: COLORS.primaryComponent,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    color: COLORS.White,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
  },
  calendarHeader: {
    marginBottom: SIZES.spacing,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    color: COLORS.primaryComponent,
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: SIZES.spacing,
  },
  monthTitle: {
    color: COLORS.White,
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing / 2,
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SIZES.spacing / 2,
  },
  weekDayText: {
    color: COLORS.White,
    opacity: 0.7,
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginBottom: 2,
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.spacing,
    paddingTop: SIZES.spacing,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
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
    color: COLORS.White,
    opacity: 0.8,
    fontSize: 10,
  },
});
