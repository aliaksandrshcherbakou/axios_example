import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import {Button} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({onSignIn, onSignUp}) => {
  const {signInAnonymous} = useAuth();

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymous();
    } catch (error: any) {
      console.error('Anonymous sign in error:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Typography element="h1" style={styles.title}>
            Free Hand
          </Typography>
          <Typography element="body" style={styles.subtitle}>
            Take control of your habits
          </Typography>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Typography element="h1" style={styles.iconText}>
              🎯
            </Typography>
          </View>

          <Typography element="h2" style={styles.welcomeText}>
            Welcome to your journey
          </Typography>

          <Typography element="body" style={styles.description}>
            Track your habits, build streaks, and achieve your goals with our simple and effective habit tracker.
          </Typography>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Sign Up Button */}
          <Button style={[styles.button, styles.primaryButton]} onPress={onSignUp} size="large">
            <Typography element="button" style={styles.primaryButtonText}>
              Get Started
            </Typography>
          </Button>

          {/* Sign In Button */}
          <Button style={[styles.button, styles.secondaryButton]} onPress={onSignIn} size="large">
            <Typography element="button" style={styles.secondaryButtonText}>
              I have an account
            </Typography>
          </Button>

          {/* Anonymous Button */}
          <Button style={[styles.button, styles.anonymousButton]} onPress={handleAnonymousSignIn} size="large">
            <Typography element="button" style={styles.anonymousButtonText}>
              Continue without account
            </Typography>
          </Button>

          {/* Footer */}
          <Typography element="caption" style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.spacing * 2,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: SIZES.spacing * 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primaryComponent,
    marginBottom: SIZES.spacing / 2,
  },
  subtitle: {
    color: COLORS.White,
    opacity: 0.8,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing,
  },
  iconContainer: {
    marginBottom: SIZES.spacing * 2,
  },
  iconText: {
    fontSize: 72,
    textAlign: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    color: COLORS.White,
    marginBottom: SIZES.spacing,
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    color: COLORS.White,
    opacity: 0.8,
    lineHeight: 22,
    paddingHorizontal: SIZES.spacing,
  },
  buttonContainer: {
    gap: SIZES.spacing,
  },
  button: {
    borderRadius: 12,
    paddingVertical: SIZES.spacing,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryComponent,
    borderColor: COLORS.primaryComponent,
  },
  primaryButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.White,
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: COLORS.White,
    fontWeight: 'bold',
    fontSize: 16,
  },
  anonymousButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  anonymousButtonText: {
    color: COLORS.White,
    opacity: 0.7,
    fontSize: 14,
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.White,
    opacity: 0.5,
    fontSize: 12,
    marginTop: SIZES.spacing,
    paddingHorizontal: SIZES.spacing,
  },
});

export default WelcomeScreen;
