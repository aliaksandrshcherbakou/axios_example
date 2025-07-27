import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {COLORS, SIZES} from '@Constants/style.constants';
import {Button, Input} from '@ui-kitten/components';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {showSimpleAlert} from '../../utils/alert';

interface SignUpScreenProps {
  onBack: () => void;
  onSignIn: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({onBack, onSignIn}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const {signUp} = useAuth();

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
    } catch (error: any) {
      showSimpleAlert('Sign Up Failed', error.message);
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
            Create Account
          </Typography>
          <Typography element="body" style={styles.subtitle}>
            Start your habit tracking journey
          </Typography>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Typography element="body" style={styles.label}>
              Name
            </Typography>
            <Input
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              autoCapitalize="words"
              status={errors.name ? 'danger' : 'basic'}
            />
            {errors.name && (
              <Typography element="caption" style={styles.errorText}>
                {errors.name}
              </Typography>
            )}
          </View>

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
              placeholder="Create a password"
              secureTextEntry
              status={errors.password ? 'danger' : 'basic'}
            />
            {errors.password && (
              <Typography element="caption" style={styles.errorText}>
                {errors.password}
              </Typography>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Typography element="body" style={styles.label}>
              Confirm Password
            </Typography>
            <Input
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              status={errors.confirmPassword ? 'danger' : 'basic'}
            />
            {errors.confirmPassword && (
              <Typography element="caption" style={styles.errorText}>
                {errors.confirmPassword}
              </Typography>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Sign Up Button */}
          <Button style={[styles.button, styles.primaryButton]} onPress={handleSignUp} disabled={loading} size="large">
            <Typography element="button" style={styles.primaryButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Typography>
          </Button>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Typography element="body" style={styles.signInText}>
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={onSignIn}>
              <Typography element="body" style={styles.signInLink}>
                Sign In
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Typography element="caption" style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: COLORS.White,
    opacity: 0.8,
  },
  signInLink: {
    color: COLORS.primaryComponent,
    fontWeight: 'bold',
  },
  termsText: {
    textAlign: 'center',
    color: COLORS.White,
    opacity: 0.5,
    fontSize: 12,
    paddingHorizontal: SIZES.spacing,
  },
});

export default SignUpScreen;
