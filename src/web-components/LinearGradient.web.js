// src/components/LinearGradient.web.js
import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ colors = [], start, end, locations, style, children, ...props }) => {
  // Default gradient: top-left → bottom-right (135deg)
  let angle = '135deg';

  if (start && end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    angle = `${Math.atan2(dy, dx) * 180 / Math.PI + 90}deg`;
  }

  // Build CSS gradient string
  let gradient = `linear-gradient(${angle}, `;
  colors.forEach((color, index) => {
    const position = locations && locations[index] !== undefined 
      ? `${(locations[index] * 100).toFixed(2)}%` 
      : colors.length === 2 
        ? (index === 0 ? '0%' : '100%')
        : `${(index / (colors.length - 1)) * 100}%`;
    gradient += `${color} ${position}${index < colors.length - 1 ? ', ' : ''}`;
  });
  gradient += ')';

  return (
    <View
      style={[
        style,
        {
          backgroundImage: gradient,
          // Fallback solid color if gradient fails (rare)
          backgroundColor: colors[0] || 'transparent',
        },
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default LinearGradient;