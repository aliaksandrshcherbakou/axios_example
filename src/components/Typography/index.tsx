import * as React from 'react';
import {LayoutChangeEvent, StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {COLORS} from '../../constants/style.constants';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'body' | 'button' | 'caption';
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const getFontSize = (element?: TypographyElement): number => {
  const fontSizes: Record<TypographyElement, number> = {
    h1: 32,
    h2: 20,
    h3: 16,
    body: 14,
    button: 16,
    caption: 10,
  };

  return element ? fontSizes[element] || 14 : 14;
};

const getFontFamily = (element?: TypographyElement): string => {
  const fontFamilies: Record<TypographyElement, string> = {
    h1: 'Rubik-Bold',
    h2: 'Rubik-SemiBold',
    h3: 'Rubik-SemiBold',
    body: 'Rubik-Regular',
    button: 'Rubik-Regular',
    caption: 'Rubik-Regular',
  };

  return element ? fontFamilies[element] || 'Rubik-Regular' : 'Rubik-Regular';
};

const getFontWeight = (element?: TypographyElement): FontWeight => {
  const fontWeights: Record<TypographyElement, FontWeight> = {
    h1: '700',
    h2: '600',
    h3: '500',
    body: 'normal',
    button: 'normal',
    caption: 'normal',
  };

  return element ? fontWeights[element] || 'normal' : 'normal';
};

const getLineHeight = (element?: TypographyElement): number => {
  const lineHeights: Record<TypographyElement, number> = {
    h1: 40,
    h2: 26,
    h3: 22,
    body: 20,
    button: 20,
    caption: 16,
  };

  return element ? lineHeights[element] || 26 : 26; // Default line height
};

type Props = {
  element?: TypographyElement;
  fontSize?: number;
  fontWeight?: FontWeight;
  lineHeight?: number;
  fontFamily?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  color?: TextStyle['color'];
};

const Typography: React.FunctionComponent<Props> = props => {
  const {children, onLayout, style} = props;
  const styles = useStyles({props: {...props}});

  return (
    <Text style={StyleSheet.flatten([styles.main, style])} onLayout={onLayout}>
      {children}
    </Text>
  );
};

const useStyles = ({props}: {props: Props}) =>
  StyleSheet.create({
    main: {
      fontSize: props.fontSize ? props.fontSize : getFontSize(props.element),
      fontFamily: props.fontFamily ? props.fontFamily : getFontFamily(props.element),
      fontWeight: props.fontWeight ? props.fontWeight : getFontWeight(props.element),
      lineHeight: props.lineHeight ? props.lineHeight : getLineHeight(props.element),
      color: props.color ? props.color : COLORS.White,
    },
  });

export default Typography;
