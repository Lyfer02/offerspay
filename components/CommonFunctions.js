import { Dimensions } from 'react-native';

export const isScreenWidthGreaterThan1200 = () => {
  const screenWidth = Dimensions.get('window').width;
  return screenWidth > 1200;
};