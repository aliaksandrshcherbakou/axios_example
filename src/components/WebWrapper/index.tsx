import {COLORS} from '@Constants/style.constants';
import {ReactNode} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

interface WebWrapperProps {
  children: ReactNode;
  maxWidth?: number;
}

const WebWrapper = ({children, maxWidth = 480}: WebWrapperProps) => {
  const screenWidth = Dimensions.get('window').width;
  const isWeb = screenWidth > 768; // Consider as web if screen is wider than tablet

  if (!isWeb) {
    return <>{children}</>;
  }

  return (
    <View style={styles.webContainer}>
      <View style={[styles.webContent, {maxWidth}]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: COLORS.HeavyMetal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webContent: {
    flex: 1,
    width: '100%',
    maxHeight: 800, // Mobile-like height constraint
    backgroundColor: COLORS.HeavyMetal,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});

export default WebWrapper;
