import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Input} from '@ui-kitten/components';
import {memo, useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [goal, setGoal] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempGoal, setTempGoal] = useState('');

  const motivationalQuotes = [
    'The strongest people are not those who show strength in front of us, but those who win battles we know nothing about.',
    'Your current situation is not your final destination. The best is yet to come.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    'The pain of discipline weighs ounces, but the pain of regret weighs tons.',
    "You don't have to be great to get started, but you have to get started to be great.",
    'Every moment is a fresh beginning.',
    'The only impossible journey is the one you never begin.',
    "Believe you can and you're halfway there.",
    "It's not about perfect. It's about effort.",
    'Fall seven times, stand up eight.',
  ];

  useEffect(() => {
    loadProfile();
    setRandomQuote();
  }, []);

  const loadProfile = async () => {
    try {
      const savedName = await AsyncStorage.getItem('user_name');
      const savedGoal = await AsyncStorage.getItem('user_goal');

      setUserName(savedName || 'Anonymous');
      setGoal(savedGoal || 'Stay clean and focused');
      setTempName(savedName || '');
      setTempGoal(savedGoal || '');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const setRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivationalQuote(motivationalQuotes[randomIndex]);
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('user_name', tempName || 'Anonymous');
      await AsyncStorage.setItem('user_goal', tempGoal || 'Stay clean and focused');

      setUserName(tempName || 'Anonymous');
      setGoal(tempGoal || 'Stay clean and focused');
      setIsEditing(false);

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const resetData = () => {
    Alert.alert('Reset All Data', 'Are you sure you want to delete all your progress? This action cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            const keys = await AsyncStorage.getAllKeys();
            const habitKeys = keys.filter(
              key => key.startsWith('habit_') || key === 'current_streak' || key === 'longest_streak',
            );
            await AsyncStorage.multiRemove(habitKeys);
            Alert.alert('Success', 'All progress data has been reset.');
          } catch (error) {
            console.error('Error resetting data:', error);
            Alert.alert('Error', 'Failed to reset data. Please try again.');
          }
        },
      },
    ]);
  };

  const exportData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const habitKeys = keys.filter(key => key.startsWith('habit_'));
      const records = await AsyncStorage.multiGet(habitKeys);
      const currentStreak = await AsyncStorage.getItem('current_streak');
      const longestStreak = await AsyncStorage.getItem('longest_streak');

      const exportData = {
        records: records.map(([key, value]) => JSON.parse(value || '{}')),
        currentStreak: parseInt(currentStreak || '0', 10),
        longestStreak: parseInt(longestStreak || '0', 10),
        exportDate: new Date().toISOString(),
      };

      Alert.alert(
        'Data Export',
        `Found ${exportData.records.length} records\nCurrent Streak: ${exportData.currentStreak}\nBest Streak: ${exportData.longestStreak}`,
        [{text: 'OK'}],
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Typography element="h1" style={styles.title}>
              Profile
            </Typography>
          </View>

          {/* User Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Typography element="h2" style={styles.cardTitle}>
                User Information
              </Typography>
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
                <Typography element="body" style={styles.editText}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Typography>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <>
                <View style={styles.inputContainer}>
                  <Typography element="body" style={styles.label}>
                    Name:
                  </Typography>
                  <Input
                    style={styles.input}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Enter your name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Typography element="body" style={styles.label}>
                    Goal:
                  </Typography>
                  <Input
                    style={styles.input}
                    value={tempGoal}
                    onChangeText={setTempGoal}
                    placeholder="Enter your goal"
                    multiline
                  />
                </View>

                <Button style={styles.saveButton} onPress={saveProfile}>
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Typography element="body" style={styles.label}>
                    Name:
                  </Typography>
                  <Typography element="body" style={styles.value}>
                    {userName}
                  </Typography>
                </View>

                <View style={styles.infoRow}>
                  <Typography element="body" style={styles.label}>
                    Goal:
                  </Typography>
                  <Typography element="body" style={styles.value}>
                    {goal}
                  </Typography>
                </View>
              </>
            )}
          </View>

          {/* Motivation Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Typography element="h2" style={styles.cardTitle}>
                Daily Motivation
              </Typography>
              <TouchableOpacity onPress={setRandomQuote} style={styles.refreshButton}>
                <Typography element="body" style={styles.refreshText}>
                  🔄
                </Typography>
              </TouchableOpacity>
            </View>

            <Typography element="body" style={styles.quote}>
              "{motivationalQuote}"
            </Typography>
          </View>

          {/* Achievements Card */}
          <View style={styles.card}>
            <Typography element="h2" style={styles.cardTitle}>
              Achievements
            </Typography>

            <View style={styles.achievementGrid}>
              <View style={styles.achievement}>
                <Typography element="h3" style={styles.achievementEmoji}>
                  🎯
                </Typography>
                <Typography element="caption" style={styles.achievementText}>
                  First Day
                </Typography>
              </View>

              <View style={styles.achievement}>
                <Typography element="h3" style={styles.achievementEmoji}>
                  🔥
                </Typography>
                <Typography element="caption" style={styles.achievementText}>
                  Week Warrior
                </Typography>
              </View>

              <View style={styles.achievement}>
                <Typography element="h3" style={styles.achievementEmoji}>
                  💪
                </Typography>
                <Typography element="caption" style={styles.achievementText}>
                  Month Master
                </Typography>
              </View>

              <View style={styles.achievement}>
                <Typography element="h3" style={styles.achievementEmoji}>
                  👑
                </Typography>
                <Typography element="caption" style={styles.achievementText}>
                  Year Champion
                </Typography>
              </View>
            </View>
          </View>

          {/* Data Management Card */}
          <View style={styles.card}>
            <Typography element="h2" style={styles.cardTitle}>
              Data Management
            </Typography>

            <TouchableOpacity style={[styles.actionButton, styles.exportButton]} onPress={exportData}>
              <Typography element="body" fontWeight="bold" color={COLORS.MineShaft}>
                Export Data
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={resetData}>
              <Typography element="body" fontWeight="bold" color={COLORS.MineShaft}>
                Reset All Data
              </Typography>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Typography element="caption" style={styles.appInfoText}>
              Version 1.0.0
            </Typography>
            <Typography element="caption" style={styles.appInfoText}>
              Built with 💜 for your journey
            </Typography>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default memo(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.spacing,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  title: {
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    marginBottom: SIZES.spacing,
    gap: SIZES.spacing,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  cardTitle: {
    color: COLORS.primaryComponent,
  },
  editButton: {
    padding: 4,
  },
  editText: {
    color: COLORS.primaryComponent,
  },
  refreshButton: {
    padding: 4,
  },
  refreshText: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: SIZES.spacing,
  },
  label: {
    marginBottom: 4,
    opacity: 0.8,
  },
  value: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing / 2,
  },
  saveButton: {
    backgroundColor: COLORS.primaryComponent,
    borderColor: COLORS.primaryComponent,
    marginTop: SIZES.spacing,
  },
  quote: {
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievement: {
    width: '22%',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  achievementEmoji: {
    fontSize: 24,
    marginBottom: 4,
    lineHeight: 40,
  },
  achievementText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  actionButton: {
    marginBottom: SIZES.spacing / 2,
    padding: SIZES.spacing,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButton: {
    backgroundColor: COLORS.primaryComponent,
    borderColor: COLORS.primaryComponent,
  },
  resetButton: {
    backgroundColor: COLORS.primaryComponent,
    borderColor: COLORS.primaryComponent,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing * 2,
  },
  appInfoText: {
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 4,
  },
});
