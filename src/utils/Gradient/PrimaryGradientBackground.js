import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../utils/color';

const PrimaryGradientBackground = ({ children, style, ...props }) => {
  return (
    <LinearGradient
      colors={colors.primaryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[{ flex: 1 }, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default PrimaryGradientBackground;