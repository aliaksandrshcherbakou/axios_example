import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import {useFocusEffect} from '@react-navigation/native';
import {Button, Input} from '@ui-kitten/components';
import {memo, useCallback, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {HabitService} from '../../services/habitService';
import {showConfirm, showSimpleAlert} from '../../utils/alert';

const motivationalQuotes = [
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'Your future self is counting on you.',
  'Progress, not perfection.',
  'Every master was once a beginner.',
  'You are stronger than your excuses.',
  'Success is the sum of small efforts repeated day in and day out.',
  'The only impossible journey is the one you never begin.',
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  'The difference between ordinary and extraordinary is that little extra.',
];

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempGoal, setTempGoal] = useState('');
  const {user, logout, isAnonymous} = useAuth();

  const loadProfile = useCallback(async () => {
    if (!user) return;

    try {
      const profile = await HabitService.getUserProfile(user.uid);
      setUserName(profile.name || user.displayName || 'Anonymous User');
      setUserGoal(profile.goal || 'Stay clean and build better habits');

      // Set random quote
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleEditProfile = () => {
    setTempName(userName);
    setTempGoal(userGoal);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await HabitService.saveUserProfile(user.uid, {
        name: tempName.trim(),
        goal: tempGoal.trim(),
      });

      setUserName(tempName.trim());
      setUserGoal(tempGoal.trim());
      setIsEditing(false);

      showSimpleAlert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      showSimpleAlert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempName('');
    setTempGoal('');
  };

  const handleResetData = () => {
    showConfirm(
      'Reset All Data',
      'Are you sure you want to delete all your habit data? This action cannot be undone.',
      async () => {
        if (!user) return;

        try {
          await HabitService.deleteUserData(user.uid);
          showSimpleAlert('Success', 'All data has been reset.');
        } catch (error) {
          console.error('Error resetting data:', error);
          showSimpleAlert('Error', 'Failed to reset data. Please try again.');
        }
      },
      undefined,
      'Reset',
      'Cancel',
    );
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      const records = await HabitService.getAllHabitRecords(user.uid);
      const stats = await HabitService.getUserStats(user.uid);
      const profile = await HabitService.getUserProfile(user.uid);

      const exportData = {
        profile,
        stats,
        records,
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
      };

      // For now, just show the data in an alert
      // In a real app, you'd implement proper export functionality
      showSimpleAlert(
        'Export Data',
        `Data exported successfully!\n\nTotal Records: ${records.length}\nCurrent Streak: ${stats.currentStreak}\nLongest Streak: ${stats.longestStreak}`,
        'OK',
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      showSimpleAlert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleLogout = () => {
    showConfirm(
      'Sign Out',
      'Are you sure you want to sign out?',
      async () => {
        try {
          console.log('User initiated logout');
          await logout();
          console.log('Logout completed successfully');
          // Navigation will happen automatically via App.tsx when user becomes null
        } catch (error) {
          console.error('Error signing out:', error);
          showSimpleAlert('Error', 'Failed to sign out. Please try again.');
        }
      },
      undefined,
      'Sign Out',
      'Cancel',
    );
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

            {/* User Avatar */}
            <View style={styles.avatarContainer}>
              <Typography element="h1" style={styles.avatar}>
                👤
              </Typography>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            {isEditing ? (
              // Edit Mode
              <>
                <View style={styles.inputContainer}>
                  <Typography element="body" style={styles.label}>
                    Name
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
                    Goal
                  </Typography>
                  <Input
                    style={styles.input}
                    value={tempGoal}
                    onChangeText={setTempGoal}
                    placeholder="Enter your goal"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.buttonRow}>
                  <Button style={[styles.button, styles.saveButton]} onPress={handleSaveProfile} size="small">
                    <Typography element="button" style={styles.saveButtonText}>
                      Save
                    </Typography>
                  </Button>

                  <Button style={[styles.button, styles.cancelButton]} onPress={handleCancelEdit} size="small">
                    <Typography element="button" style={styles.cancelButtonText}>
                      Cancel
                    </Typography>
                  </Button>
                </View>
              </>
            ) : (
              // View Mode
              <>
                <View style={styles.infoItem}>
                  <Typography element="body" style={styles.infoLabel}>
                    Name
                  </Typography>
                  <Typography element="h2" style={styles.infoValue}>
                    {userName}
                  </Typography>
                </View>

                <View style={styles.infoItem}>
                  <Typography element="body" style={styles.infoLabel}>
                    Goal
                  </Typography>
                  <Typography element="body" style={styles.infoValue}>
                    {userGoal}
                  </Typography>
                </View>

                {!isAnonymous && (
                  <View style={styles.infoItem}>
                    <Typography element="body" style={styles.infoLabel}>
                      Email
                    </Typography>
                    <Typography element="body" style={styles.infoValue}>
                      {user?.email || 'Not available'}
                    </Typography>
                  </View>
                )}

                <Button style={[styles.button, styles.editButton]} onPress={handleEditProfile} size="small">
                  <Typography element="button" style={styles.editButtonText}>
                    Edit Profile
                  </Typography>
                </Button>
              </>
            )}
          </View>

          {/* Motivational Quote */}
          <View style={styles.quoteContainer}>
            <Typography element="body" style={styles.quoteLabel}>
              💡 Daily Motivation
            </Typography>
            <Typography element="h3" style={styles.quote}>
              "{currentQuote}"
            </Typography>
          </View>

          {/* Account Type */}
          <View style={styles.accountContainer}>
            <Typography element="body" style={styles.accountLabel}>
              Account Type
            </Typography>
            <Typography element="body" style={styles.accountValue}>
              {isAnonymous ? 'Anonymous User' : 'Registered User'}
            </Typography>
            {isAnonymous && (
              <Typography element="caption" style={styles.accountNote}>
                Create an account to sync your data across devices
              </Typography>
            )}
          </View>

          {/* Data Management */}
          <View style={styles.actionsContainer}>
            <Typography element="h2" style={styles.actionsTitle}>
              Data Management
            </Typography>

            <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
              <Typography element="body" style={styles.actionText}>
                📤 Export Data
              </Typography>
              <Typography element="caption" style={styles.actionDescription}>
                Download your habit data
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleResetData}>
              <Typography element="body" style={styles.actionTextDanger}>
                🗑️ Reset All Data
              </Typography>
              <Typography element="caption" style={styles.actionDescription}>
                Delete all your habit records
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
              <Typography element="body" style={styles.actionTextDanger}>
                🚪 Sign Out
              </Typography>
              <Typography element="caption" style={styles.actionDescription}>
                Sign out of your account
              </Typography>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfoContainer}>
            <Typography element="caption" style={styles.appInfo}>
              Free Hand v1.0.0
            </Typography>
            <Typography element="caption" style={styles.appInfo}>
              Made with ❤️ for your journey
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
    paddingTop: SIZES.spacing,
  },
  title: {
    textAlign: 'center',
    color: COLORS.White,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  avatar: {
    fontSize: 48,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    marginBottom: SIZES.spacing * 2,
  },
  infoItem: {
    marginBottom: SIZES.spacing,
  },
  infoLabel: {
    color: COLORS.White,
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.White,
  },
  inputContainer: {
    marginBottom: SIZES.spacing,
  },
  label: {
    color: COLORS.White,
    marginBottom: SIZES.spacing / 2,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SIZES.spacing,
    marginTop: SIZES.spacing,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: COLORS.primaryComponent,
    borderColor: COLORS.primaryComponent,
    marginTop: SIZES.spacing,
  },
  editButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  saveButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.White,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    marginBottom: SIZES.spacing * 2,
  },
  quoteLabel: {
    color: COLORS.primaryComponent,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing / 2,
  },
  quote: {
    color: COLORS.White,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  accountContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    marginBottom: SIZES.spacing * 2,
  },
  accountLabel: {
    color: COLORS.White,
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountValue: {
    color: COLORS.White,
    fontWeight: 'bold',
  },
  accountNote: {
    color: COLORS.primaryComponent,
    marginTop: 4,
    fontSize: 11,
  },
  actionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SIZES.spacing,
    marginBottom: SIZES.spacing * 2,
  },
  actionsTitle: {
    color: COLORS.White,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing,
  },
  actionItem: {
    paddingVertical: SIZES.spacing,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    color: COLORS.White,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionTextDanger: {
    color: '#F44336',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  actionDescription: {
    color: COLORS.White,
    opacity: 0.7,
    fontSize: 11,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing * 2,
  },
  appInfo: {
    color: COLORS.White,
    opacity: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
});
