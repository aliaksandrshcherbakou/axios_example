import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {memo, useCallback, useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';

const questions = [
  'Did you watch any adult content today?',
  'Have you fapped today?',
  'Did you give in to urges today?',
  'Have you broken your streak today?',
  'Did you relapse today?',
  'Have you watched any inappropriate content today?',
  'Did you lose control today?',
  'Have you fallen back into old habits today?',
];

const Main = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [todayAnswered, setTodayAnswered] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const checkTodayStatus = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const record = await AsyncStorage.getItem(`habit_${today}`);
      setTodayAnswered(!!record);
    } catch (error) {
      console.error('Error checking today status:', error);
    }
  }, []);

  const loadCurrentStreak = useCallback(async () => {
    try {
      const streak = await AsyncStorage.getItem('current_streak');
      setCurrentStreak(parseInt(streak || '0', 10));
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  }, []);

  useEffect(() => {
    checkTodayStatus();
    loadCurrentStreak();
    setRandomQuestion();
  }, [checkTodayStatus, loadCurrentStreak]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkTodayStatus();
      loadCurrentStreak();
    }, [checkTodayStatus, loadCurrentStreak]),
  );

  const setRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  const handleAnswer = async (fapped: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const timestamp = Date.now();

      const record = {
        date: today,
        fapped,
        timestamp,
      };

      // Save today's record
      await AsyncStorage.setItem(`habit_${today}`, JSON.stringify(record));

      // Update streak
      let newStreak = currentStreak;
      if (fapped) {
        newStreak = 0; // Reset streak
        Alert.alert('Streak Reset', "Don't worry, tomorrow is a new day. You've got this! 💪", [{text: 'OK'}]);
      } else {
        newStreak = currentStreak + 1;

        // Update longest streak if needed
        const currentLongest = parseInt((await AsyncStorage.getItem('longest_streak')) || '0', 10);
        if (newStreak > currentLongest) {
          await AsyncStorage.setItem('longest_streak', newStreak.toString());
        }

        if (newStreak > 0) {
          Alert.alert('Great Job!', `You're on a ${newStreak} day streak! Keep it up! 🔥`, [{text: 'Awesome!'}]);
        }
      }

      await AsyncStorage.setItem('current_streak', newStreak.toString());
      setCurrentStreak(newStreak);
      setTodayAnswered(true);

      // Set new random question for next time
      setRandomQuestion();
    } catch (error) {
      console.error('Error saving record:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
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
              <Typography element="button" fontWeight="bold" color={COLORS.White}>
                YES
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => handleAnswer(false)}>
              <Typography element="button" fontWeight="bold" color={COLORS.MineShaft}>
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
});
