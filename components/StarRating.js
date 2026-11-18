import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You can use any icon library
import IconComponent from './IconComponent';

const StarRating = ({ rating, maxStars = 5, starSize = 24, filledColor = '#FFD700', emptyColor = '#C0C0C0' }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => (
        <IconComponent
          key={index}
          name={index < rating ? 'star' : 'star-outline'}
          size={starSize}
          color={index < rating ? filledColor : emptyColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default StarRating;
