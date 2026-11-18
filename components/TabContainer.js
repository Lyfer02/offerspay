// TabContainer.js
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Animated,
  Dimensions 
} from 'react-native';
import { colors } from '../src/utils/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TabContainer = ({
  tabs,
  initialTab,
  onTabChange,
  containerStyle,
  tabStyle,
  tabTextStyle,
  activeTabStyle,
  activeTabTextStyle,
  variant = 'chip', // 'underline', 'pill', 'chip'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.name);
  const [tabLayouts, setTabLayouts] = useState({});
  const scrollViewRef = useRef(null);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tabName, index) => {
    setActiveTab(tabName);
    onTabChange?.(tabName);

    // Scroll to center the active tab
    if (scrollViewRef.current && tabLayouts[tabName]) {
      const tabLayout = tabLayouts[tabName];
      const scrollX = tabLayout.x - (SCREEN_WIDTH / 2) + (tabLayout.width / 2);
      scrollViewRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
    }

    // Animate indicator (for underline variant)
    if (variant === 'underline' && tabLayouts[tabName]) {
      Animated.parallel([
        Animated.spring(indicatorAnim, {
          toValue: tabLayouts[tabName].x,
          useNativeDriver: false,
          tension: 68,
          friction: 12,
        }),
        Animated.spring(indicatorWidth, {
          toValue: tabLayouts[tabName].width,
          useNativeDriver: false,
          tension: 68,
          friction: 12,
        }),
      ]).start();
    }
  };

  const handleLayout = (tabName, event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({ ...prev, [tabName]: { x, width } }));

    // Initialize indicator position for the first active tab
    if (tabName === activeTab && variant === 'underline') {
      indicatorAnim.setValue(x);
      indicatorWidth.setValue(width);
    }
  };

  // Render different tab variants
  const renderTabItem = (tab, index) => {
    const isFocused = activeTab === tab.name;

    switch (variant) {
      case 'pill':
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handleTabPress(tab.name, index)}
            onLayout={(e) => handleLayout(tab.name, e)}
            style={[
              styles.pillTab,
              tabStyle,
              isFocused && styles.pillTabActive,
              isFocused && activeTabStyle,
            ]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <Text
              allowFontScaling={false}

              style={[
                styles.pillTabText,
                tabTextStyle,
                isFocused && styles.pillTabTextActive,
                isFocused && activeTabTextStyle,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );

      case 'chip':
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handleTabPress(tab.name, index)}
            onLayout={(e) => handleLayout(tab.name, e)}
            style={[
              styles.chipTab,
              tabStyle,
              isFocused && styles.chipTabActive,
              isFocused && activeTabStyle,
            ]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <Text
            allowFontScaling={false}
              style={[
                styles.chipTabText,
                tabTextStyle,
                isFocused && styles.chipTabTextActive,
                isFocused && activeTabTextStyle,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );

      case 'underline':
      default:
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handleTabPress(tab.name, index)}
            onLayout={(e) => handleLayout(tab.name, e)}
            style={[
              styles.underlineTab,
              tabStyle,
            ]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
          >
            <Text
            allowFontScaling={false}
              style={[
                styles.underlineTabText,
                tabTextStyle,
                isFocused && styles.underlineTabTextActive,
                isFocused && activeTabTextStyle,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Tab Bar */}
      <View style={[
        styles.tabBarContainer,
        variant === 'underline' && styles.tabBarUnderline,
        variant === 'pill' && styles.tabBarPill,
        variant === 'chip' && styles.tabBarChip,
      ]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            variant === 'pill' && styles.scrollViewPill,
            variant === 'chip' && styles.scrollViewChip,
          ]}
          bounces={false}
        >
          {tabs.map((tab, index) => renderTabItem(tab, index))}
        </ScrollView>

        {/* Animated Indicator for underline variant */}
        {variant === 'underline' && (
          <Animated.View
            style={[
              styles.indicator,
              {
                left: indicatorAnim,
                width: indicatorWidth,
              },
            ]}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {tabs.find(tab => tab.name === activeTab)?.component?.()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },                                                              

  // Common Tab Bar Styles
  tabBarContainer: {
    padding:8,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 4,
  },

  // Underline Variant
  tabBarUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  underlineTab: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 4,
  },
  underlineTabText: {
    fontSize: 15,
    color: colors.gray,
    fontWeight: '500',
  },
  underlineTabTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.colorPrimary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Pill Variant
  tabBarPill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  scrollViewPill: {
    paddingHorizontal: 0,
    gap: 8,
  },
  pillTab: {
    height: 40,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  pillTabActive: {
    backgroundColor: colors.colorPrimary,
    elevation: 2,
    shadowColor: colors.colorPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pillTabText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
  pillTabTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  // Chip Variant
  tabBarChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  scrollViewChip: {
    backgroundColor:colors.white,
    paddingHorizontal: 0,
    gap: 8,
  },
  chipTab: {
    height: 36,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  chipTabActive: {
    backgroundColor: colors.colorPrimaryLite || '#E8F0FE',
    borderColor: colors.colorPrimary,
    borderWidth: 1,
  },
  chipTabText: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  chipTabTextActive: {
    color: colors.white,
    fontWeight: '700',
  },

  // Content Container
  contentContainer: {
    flex: 1,
  },
});

export default TabContainer;