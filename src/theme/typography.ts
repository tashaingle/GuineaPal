import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System'
});

type FontWeight = 
  | 'normal' | 'bold' 
  | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

interface TextStyleWithLineHeight extends TextStyle {
  lineHeight: number;
}

export const typography = {
  // Font families
  fonts: {
    regular: fontFamily,
    medium: fontFamily,
    bold: fontFamily,
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Font weights
  weights: {
    thin: '100' as FontWeight,
    extralight: '200' as FontWeight,
    light: '300' as FontWeight,
    normal: '400' as FontWeight,
    medium: '500' as FontWeight,
    semibold: '600' as FontWeight,
    bold: '700' as FontWeight,
    extrabold: '800' as FontWeight,
    black: '900' as FontWeight,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },

  // Predefined text styles
  textStyles: {
    h1: {
      fontSize: 30,
      fontWeight: '600' as FontWeight,
      lineHeight: 1.25,
    } as TextStyleWithLineHeight,
    h2: {
      fontSize: 24,
      fontWeight: '600' as FontWeight,
      lineHeight: 1.25,
    } as TextStyleWithLineHeight,
    h3: {
      fontSize: 20,
      fontWeight: '600' as FontWeight,
      lineHeight: 1.375,
    } as TextStyleWithLineHeight,
    h4: {
      fontSize: 18,
      fontWeight: '600' as FontWeight,
      lineHeight: 1.375,
    } as TextStyleWithLineHeight,
    body: {
      fontSize: 16,
      fontWeight: '400' as FontWeight,
      lineHeight: 1.5,
    } as TextStyleWithLineHeight,
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as FontWeight,
      lineHeight: 1.5,
    } as TextStyleWithLineHeight,
    caption: {
      fontSize: 12,
      fontWeight: '400' as FontWeight,
      lineHeight: 1.5,
    } as TextStyleWithLineHeight,
    button: {
      fontSize: 16,
      fontWeight: '600' as FontWeight,
      lineHeight: 1.25,
    } as TextStyleWithLineHeight,
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as FontWeight,
      lineHeight: 1.25,
    } as TextStyleWithLineHeight,
    label: {
      fontSize: 14,
      fontWeight: '500' as FontWeight,
      lineHeight: 1.25,
    } as TextStyleWithLineHeight,
  },
};

export default typography; 