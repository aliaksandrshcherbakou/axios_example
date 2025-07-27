import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import {Button, Input} from '@ui-kitten/components';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {showSimpleAlert} from '../../utils/alert';

interface SignInScreenProps {
  onBack: () => void;
  onSignUp: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({onBack, onSignUp}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const {signIn} = useAuth();

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (error: any) {
      showSimpleAlert('Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Typography element="h2" style={styles.backText}>
              ‹
            </Typography>
          </TouchableOpacity>

          <Typography element="h1" style={styles.title}>
            Welcome Back
          </Typography>
          <Typography element="body" style={styles.subtitle}>
            Sign in to continue your journey
          </Typography>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Typography element="body" style={styles.label}>
              Email
            </Typography>
            <Input
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              status={errors.email ? 'danger' : 'basic'}
            />
            {errors.email && (
              <Typography element="caption" style={styles.errorText}>
                {errors.email}
              </Typography>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Typography element="body" style={styles.label}>
              Password
            </Typography>
            <Input
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              status={errors.password ? 'danger' : 'basic'}
            />
            {errors.password && (
              <Typography element="caption" style={styles.errorText}>
                {errors.password}
              </Typography>
            )}
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Typography element="caption" style={styles.forgotPasswordText}>
              Forgot your password?
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Sign In Button */}
          <Button style={[styles.button, styles.primaryButton]} onPress={handleSignIn} disabled={loading} size="large">
            <Typography element="button" style={styles.primaryButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Typography>
          </Button>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Typography element="body" style={styles.signUpText}>
              Don't have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={onSignUp}>
              <Typography element="body" style={styles.signUpLink}>
                Sign Up
              </Typography>
            </TouchableOpacity>
          </View>
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
    marginTop: SIZES.spacing * 2,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: SIZES.spacing / 2,
    marginBottom: SIZES.spacing,
  },
  backText: {
    fontSize: 32,
    color: COLORS.White,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.White,
    marginBottom: SIZES.spacing / 2,
  },
  subtitle: {
    color: COLORS.White,
    opacity: 0.8,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: SIZES.spacing * 1.5,
  },
  label: {
    color: COLORS.White,
    marginBottom: SIZES.spacing / 2,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: SIZES.spacing / 2,
    fontSize: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SIZES.spacing / 2,
  },
  forgotPasswordText: {
    color: COLORS.primaryComponent,
    fontSize: 14,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: COLORS.White,
    opacity: 0.8,
  },
  signUpLink: {
    color: COLORS.primaryComponent,
    fontWeight: 'bold',
  },
});

export default SignInScreen;
