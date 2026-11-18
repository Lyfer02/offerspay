import React from 'react';
import { View } from 'react-native';
import { colors } from '../../utils/color';

const PrimaryGradientBackground = ({ children, style, ...props }) => {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundImage: `linear-gradient(90deg, ${colors.primaryGradient[0]}, ${colors.primaryGradient[1]})`,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default PrimaryGradientBackground;