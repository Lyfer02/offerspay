import { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenDimensions = {
  width,
  height,
  isTablet: width >= 768,
  isDesktop: width >= 1024,
  isMobile: width < 768,
  
  // Breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  }
};

export const getScreenType = () => {
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
};

export const isWeb = Platform.OS === 'web';
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

// Hook for responsive design
export const useResponsive = () => {
  const [dimensions, setDimensions] =useState(screenDimensions);
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        ...window,
        isTablet: window.width >= 768,
        isDesktop: window.width >= 1024,
        isMobile: window.width < 768,
        breakpoints: {
          mobile: 768,
          tablet: 1024,
          desktop: 1200
        }
      });
    });
    
    return () => subscription?.remove();
  }, []);
  
  return dimensions;
};