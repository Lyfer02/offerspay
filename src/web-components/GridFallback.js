import React from 'react';
import { View } from 'react-native';

export const FlatGrid = ({ data, renderItem, itemDimension, spacing, style }) => {
  const items = data.map((item, index) => renderItem({ item, index }));
  
  return (
    <View style={[{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing,
      gap: spacing
    }, style]}>
      {items.map((item, index) => (
        <View key={index} style={{ width: itemDimension }}>
          {item}
        </View>
      ))}
    </View>
  );
};

export const SectionGrid = FlatGrid;

export default { FlatGrid, SectionGrid };