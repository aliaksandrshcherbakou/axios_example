import {Dimensions, Platform} from 'react-native';

export const COLORS = {
  White: '#ffffff',
  MineShaft: 'black',
  HeavyMetal: 'black',
  primary: '#AD62D0',
  disabled: '#7D7D7D',
  textDisabled: '#6b6b6b',
  primaryComponent: '#ffa31a',
};

const spacing = 10;
const {width, height} = Dimensions.get('window');

export const SIZES = {
  spacing,
  width,
  height,
};

export const isIOS = Platform.OS === 'ios';

export const ITEM_SIZE = SIZES.width * 0.7;
export const ITEM_SPACING = (SIZES.width - ITEM_SIZE) / 2;
