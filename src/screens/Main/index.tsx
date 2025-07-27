import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import {useFocusEffect} from '@react-navigation/native';
import {memo, useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {HabitService} from '../../services/habitService';
import {HabitRecord} from '../../types';
import {showSimpleAlert} from '../../utils/alert';

const questions = [
  'Did you fap today?',
  'Did you watch porn today?',
  'Did you give in to temptation today?',
  'Did you break your streak today?',
  'Did you fail your goal today?',
];

const Main = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayAnswered, setTodayAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const {user} = useAuth();

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Check if today is already answered
      const todayRecord = await HabitService.getHabitRecord(user.uid, today);
      setTodayAnswered(!!todayRecord);

      // Get user stats
      const stats = await HabitService.getUserStats(user.uid);
      setCurrentStreak(stats.currentStreak);

      // Set random question
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleAnswer = async (fapped: boolean) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Create habit record
      const record: HabitRecord = {
        date: today,
        fapped: fapped,
        timestamp: new Date().toISOString(),
      };

      // Save the record
      await HabitService.saveHabitRecord(user.uid, record);

      // Get all records to calculate new streak
      const allRecords = await HabitService.getAllHabitRecords(user.uid);
      const stats = HabitService.calculateStats(allRecords);

      // Update user stats
      await HabitService.saveUserStats(user.uid, {
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
      });

      // Update local state
      setCurrentStreak(stats.currentStreak);
      setTodayAnswered(true);

      // Show appropriate message
      if (fapped) {
        showSimpleAlert('Streak Reset', "Don't worry, tomorrow is a new day. You've got this! 💪", 'OK');
      } else {
        if (stats.currentStreak > 0) {
          showSimpleAlert('Great Job!', `You're on a ${stats.currentStreak} day streak! Keep it up! 🔥`, 'Awesome!');
        }
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      showSimpleAlert('Error', 'Failed to save your answer. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.content}>
        {/* Streak Display */}
        <View style={styles.streakContainer}>
          <Typography element="h1" style={styles.streakText}>
            🔥 {currentStreak}
          </Typography>
          <Typography element="body" style={styles.streakLabel}>
            days clean
          </Typography>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Typography element="h2" style={styles.question}>
            {currentQuestion}
          </Typography>
        </View>

        {/* Buttons or Completed State */}
        {todayAnswered ? (
          <View style={styles.completedContainer}>
            <Typography element="h3" style={styles.completedText}>
              ✅ Done for today
            </Typography>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={() => handleAnswer(true)}>
              <Typography element="button" fontWeight="bold" style={styles.yesButtonText}>
                YES
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => handleAnswer(false)}>
              <Typography element="button" fontWeight="bold" style={styles.noButtonText}>
                NO
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </GradientBackground>
    </SafeAreaView>
  );
};

export default memo(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.spacing,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: SIZES.spacing * 3,
  },
  streakText: {
    textAlign: 'center',
    color: COLORS.primaryComponent,
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 56,
  },
  streakLabel: {
    textAlign: 'center',
    color: COLORS.White,
    opacity: 0.8,
    marginTop: 4,
  },
  questionContainer: {
    paddingHorizontal: SIZES.spacing * 2,
    marginBottom: SIZES.spacing * 4,
  },
  question: {
    textAlign: 'center',
    lineHeight: 28,
    color: COLORS.White,
  },
  buttonContainer: {
    justifyContent: 'center',
    gap: SIZES.spacing * 2,
    width: '100%',
    paddingHorizontal: SIZES.spacing * 2,
    paddingTop: SIZES.spacing * 2,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: SIZES.spacing,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noButton: {
    backgroundColor: '#ffa31a',
    borderColor: '#ffa31a',
  },
  yesButton: {
    backgroundColor: '#292929',
    borderColor: '#292929',
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing,
  },
  completedText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  yesButtonText: {
    color: COLORS.White,
  },
  noButtonText: {
    color: COLORS.MineShaft,
  },
});
