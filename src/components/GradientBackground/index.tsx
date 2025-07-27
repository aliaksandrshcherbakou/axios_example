import {COLORS} from '@Constants/style.constants';
import {LinearGradient} from 'expo-linear-gradient';
import {ReactNode} from 'react';
import {ViewStyle} from 'react-native';

const GradientBackground = ({children, style}: {children: ReactNode; style?: ViewStyle}) => (
  <LinearGradient
    colors={[COLORS.HeavyMetal, COLORS.MineShaft]}
    locations={[0.1, 0.6]}
    style={{
      height: '100%',
      width: '100%',
      ...style,
    }}>
    {children}
  </LinearGradient>
);

export default GradientBackground;
