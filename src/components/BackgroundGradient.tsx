import React from 'react';
import {ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BackgroundGradient: React.FC<{
  start?: {x: number; y: number};
  end?: {x: number; y: number};
  height?: number;
  colors: string[];
  children?: React.ReactNode;
  style?: ViewStyle;
}> = ({height, colors, children, style, ...rest}) => (
  <LinearGradient colors={colors} style={[{height}, style]} {...rest}>
    {children}
  </LinearGradient>
);

export default BackgroundGradient;
