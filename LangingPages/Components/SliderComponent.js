import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const SliderComponent = ({ amount = 52 }) => {
  const [value, setValue] = useState(amount);
  const [sliderWidth, setSliderWidth] = useState(Dimensions.get('window').width * 0.8);

  // Update slider width when screen size changes
  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = Dimensions.get('window').width;
      // Calculate slider width as 80% of screen width, with a max of 900
      setSliderWidth(Math.min(screenWidth * 0.8, 900));
    };

    // Add event listener for dimension changes
    Dimensions.addEventListener('change', updateWidth);

    // Initial setup
    updateWidth();

    // Cleanup listener
    return () => {
      // For newer React Native versions
      Dimensions.removeEventListener('change', updateWidth);
    };
  }, []);

  // Update the value when amount prop changes
  useEffect(() => {
    setValue(amount);
  }, [amount]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <View style={styles.container}>
      <Slider
        style={[styles.slider, { width: sliderWidth }]}
        minimumValue={0}
        maximumValue={100}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#005f6b"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#005f6b"
      />
      <Text style={styles.value}>{Math.round(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  slider: {
    height: 40,
  },
  value: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

export default SliderComponent;