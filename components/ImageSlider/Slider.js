// Slider.js - Smooth Circular Infinite Scroll with Proper Peek
import { FlatList, View, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import SliderItem from './SliderItem';
import { colors } from '../../src/utils/color';
import { bannerService } from '../../api/services/banner.service';
import { useResponsive } from '../../src/utils/dimension.js';

const Slider = ({banners =[]}) => {
  const flatlistRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  //const [banners, setBanners] = useState([]);
  const [circularBanners, setCircularBanners] = useState([]);
  const isScrollingRef = useRef(false);
  const { width: screenWidth, isDesktop } = useResponsive();
  
  // Account for side panel on desktop (300px width)
  const SIDE_PANEL_WIDTH = isDesktop ? 300 : 0;
  const availableWidth = screenWidth - SIDE_PANEL_WIDTH;
  
  // Width with padding for peek effect
  const slideWidth = isDesktop 
    ? Math.min(availableWidth * 0.7, 1200) 
    : availableWidth * 0.75;
  const PEEK_AMOUNT = 10;

  useEffect(() => {
    if (banners.length > 0) {
      const circular = [
        banners[banners.length - 1], // Last banner for left peek
        ...banners,
        banners[0], // First banner for right peek
      ];
      setCircularBanners(circular);
    } else {
      setCircularBanners([]);
    }
  }, [banners]);

  // Initialize: Start at index 1 (first actual banner, after cloned last)
  useEffect(() => {
    if (circularBanners.length > 0) {
      setTimeout(() => {
        flatlistRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
        setActiveIndex(0); // Display index for dots
      }, 100);
    }
  }, [circularBanners.length]);

  // Smooth circular scroll to next index
  const scrollToNext = useCallback(() => {
    if (banners.length <= 1 || isScrollingRef.current) return;

    isScrollingRef.current = true;
    
    setActiveIndex((prevIndex) => {
      const nextDisplayIndex = (prevIndex + 1) % banners.length;
      const nextScrollIndex = nextDisplayIndex + 1; // Offset by 1 due to cloned last at start
      
      flatlistRef.current?.scrollToIndex({
        index: nextScrollIndex,
        animated: true,
      });
      
      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
      
      return nextDisplayIndex;
    });
  }, [banners.length]);

  // Auto scroll with circular logic
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (banners.length > 1) {
      intervalRef.current = setInterval(() => {
        scrollToNext();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners.length, scrollToNext]);

  // Handle manual scroll with circular wrap
  const handleScroll = (event) => {
    if (isScrollingRef.current) return;

    const scrollPosition = event.nativeEvent.contentOffset.x;
    const scrollIndex = Math.round(scrollPosition / (slideWidth + PEEK_AMOUNT));
    
    // Convert scroll index to display index (0-based for original banners)
    let displayIndex = scrollIndex - 1; // Subtract 1 for cloned last at start
    
    if (displayIndex >= 0 && displayIndex < banners.length) {
      setActiveIndex(displayIndex);
    }
  };

  // Handle momentum scroll end - wrap around seamlessly
  const handleMomentumScrollEnd = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const scrollIndex = Math.round(scrollPosition / (slideWidth + PEEK_AMOUNT));
    
    // If scrolled to cloned last banner (index 0), jump to real last (without animation)
    if (scrollIndex === 0) {
      setTimeout(() => {
        flatlistRef.current?.scrollToIndex({
          index: banners.length, // Real last banner position
          animated: false,
        });
        setActiveIndex(banners.length - 1);
      }, 50);
    }
    // If scrolled to cloned first banner (last index), jump to real first
    else if (scrollIndex === circularBanners.length - 1) {
      setTimeout(() => {
        flatlistRef.current?.scrollToIndex({
          index: 1, // Real first banner position
          animated: false,
        });
        setActiveIndex(0);
      }, 50);
    }
    
    isScrollingRef.current = false;
  };

  // Dot indicators (based on original banner count)
  const renderDotIndicator = () => {
    if (banners.length === 0) return null;
    
    const dotWidth = availableWidth / banners.length;
    const maxDotSize = Math.min(8, dotWidth / 3);

    return (
      <View style={styles.dotsWrapper}>
        {banners.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              {
                width: activeIndex === index ? maxDotSize +10 :maxDotSize,
                height: maxDotSize,
                margin: maxDotSize / 2,
                backgroundColor: activeIndex === index ? colors.black : 'transparent',
                borderColor: activeIndex === index ? colors.white : colors.green,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // Handle scroll to index failed
  const onScrollToIndexFailed = useCallback((info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 100));
    wait.then(() => {
      if (flatlistRef.current && info.index >= 0 && info.index < circularBanners.length) {
        flatlistRef.current?.scrollToIndex({
          index: info.index,
          animated: false,
        });
      }
    });
  }, [circularBanners.length]);

  if (circularBanners.length === 0) {
    return <View style={{ height: 200 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={circularBanners}
        renderItem={({ item, index }) => (
          <SliderItem item={item} slideWidth={slideWidth} />
        )}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={slideWidth + PEEK_AMOUNT}
        contentContainerStyle={{
          paddingHorizontal: (availableWidth - slideWidth) / 2 - PEEK_AMOUNT / 2,
        }}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        getItemLayout={(data, index) => ({
          length: slideWidth + PEEK_AMOUNT,
          offset: (slideWidth + PEEK_AMOUNT) * index,
          index,
        })}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
      <View style={styles.dotContainer}>
        {renderDotIndicator()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    paddingVertical: 10,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dot: {
    borderRadius: 4,
    borderWidth: 1,
  },
});

export default Slider;