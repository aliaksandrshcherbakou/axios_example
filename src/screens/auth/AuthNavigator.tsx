import React, {useEffect, useState} from 'react';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import WelcomeScreen from './WelcomeScreen';

type AuthScreens = 'welcome' | 'signin' | 'signup';

const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreens>('welcome');

  // Reset to welcome screen when component mounts (e.g., after logout)
  useEffect(() => {
    setCurrentScreen('welcome');
  }, []);

  const showWelcome = () => setCurrentScreen('welcome');
  const showSignIn = () => setCurrentScreen('signin');
  const showSignUp = () => setCurrentScreen('signup');

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen onSignIn={showSignIn} onSignUp={showSignUp} />;

    case 'signin':
      return <SignInScreen onBack={showWelcome} onSignUp={showSignUp} />;

    case 'signup':
      return <SignUpScreen onBack={showWelcome} onSignIn={showSignIn} />;

    default:
      return <WelcomeScreen onSignIn={showSignIn} onSignUp={showSignUp} />;
  }
};

export default AuthNavigator;
