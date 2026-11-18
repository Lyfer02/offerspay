// Home.js - Fixed collapsible header gap issue
import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../../src/utils/color';
import { useNavigation } from '@react-navigation/native';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import Slider from '../../components/ImageSlider/Slider';
import TrendingStoresItem from '../../components/TrendingStoresItem';
import DealsItem from '../../components/DealsItem';
import IconComponent from '../../components/IconComponent';
import { homeService } from '../../api/services/home.service';
import { storeService } from '../../api/services/stores.service';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../navigation/AuthContext';
import { ErrorModalService } from '../../src/utils/modalService';
import storage from '../../src/utils/storage';
import { authService } from '../../api/services/auth.service';
import LinearGradient from 'react-native-linear-gradient';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { isAndroid, isIOS, isWeb } from '../../src/utils/dimension';
import { LoadingService } from '../../src/utils/loadingService';

const HEADER_EXPANDED_HEIGHT = 180;
const HEADER_COLLAPSED_HEIGHT = 115;
const REFER_BANNER_HEIGHT = 100;

const Home = () => {
  const navigation = useNavigation();
  const [banners, setBanners] = useState([]);
  const { isLoggedIn, user, logout } = useAuth();
  const [stores, setStores] = useState([]);
  const [sections, setSections] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const topTabVisible = width <= 1024;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Header Animation - Height reduces smoothly
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      Extrapolation.CLAMP
    );

    return { height };
  });

  // Refer & Earn Animation - Fades and slides out
  const animatedReferStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 80],
      [0, -REFER_BANNER_HEIGHT],
      Extrapolation.CLAMP
    );

    // Instantly hide when scrolled past threshold
    const display = scrollY.value > 70 ? 'none' : 'flex';

    return {
      transform: [{ translateY }],
      display,
    };
  });

  // Search bar expands slightly when scrolled
  const animatedSearchStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 50],
      [1, 1.02],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const goToReferAndEarn = () => navigation.navigate('ReferAndEarn');
  const goToMyEarnings = () => navigation.navigate('MyEarnings');
  const goToAllStores = () => navigation.navigate('Store');
  const goToNotification =()=> navigation.navigate('Notifications');
 

  const handleJwtExpired = useCallback(async () => {
    await logout();
    ErrorModalService.error('Your session has expired. Please log in again.');
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 1500);
  }, [logout, navigation]);

  const updateFcmTokenOnServer = useCallback(async () => {
    try {
      const fcmToken = await storage.getItem('fcmToken');
      if (fcmToken && isLoggedIn) {
        await authService.updateFcmToken({ token: fcmToken });
      }
    } catch (error) {
      if (error?.response?.data?.message?.toLowerCase() === 'jwt expired') {
        await handleJwtExpired();
      }
    }
  }, [isLoggedIn, handleJwtExpired]);

  const getHomeData = useCallback(async () => {
    try {
      const response = await homeService.home();
      const data = response?.data?.data;
      setTotalBalance(data?.wallet?.balance || 0);
      setStores(data?.storelist || []);
      setBanners(data?.banners || []);

      const storeGroups = data?.stores || {};
      const mappedSections = Object.keys(storeGroups).map((key) => ({
        title: `${key} Deals`,
        data: storeGroups[key],
        storeId: storeGroups[key][0]?.store?._id || null // Extract storeId from first product
      }));
      setSections(mappedSections);
    } catch (error) {
      if (error?.response?.data?.message?.toLowerCase() === 'jwt expired') {
        await handleJwtExpired();
      } else {
        ErrorModalService.error('Failed to load data');
      }
    }
  }, [handleJwtExpired]);

  const fetchStores = useCallback(async () => {
    try {
      const res = await storeService.list();
      setStores(res?.data?.data?.storeData || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  }, []);

  const onRefresh = async () => {
    LoadingService.show("Refreshing Data ...")
    try {
      await Promise.all([
        getHomeData(),
        updateFcmTokenOnServer(),
        fetchStores(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      LoadingService.hide()
    }
  };

  useEffect(() => {
    getHomeData();
    updateFcmTokenOnServer();
    fetchStores();
  }, [getHomeData, updateFcmTokenOnServer, fetchStores]);

  // Calculate proper padding based on platform
  const getContentPaddingTop = () => {
    if (!topTabVisible) return 0;
    
    // Platform-specific adjustments
    if (isAndroid) {
      return HEADER_EXPANDED_HEIGHT ;
    } else if (isIOS) {
      return HEADER_EXPANDED_HEIGHT ;
    } else if (isWeb) {
      return HEADER_EXPANDED_HEIGHT ;
    }
    
    return HEADER_EXPANDED_HEIGHT;
  };

  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{flex:1,backgroundColor:colors.white}}>

     

        {/* Collapsible Header */}
        {topTabVisible && (
          <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
            <LinearGradient
              colors={[colors.colorPrimaryLite, colors.colorPrimary]}
              style={styles.gradientHeader}
            >
              {/* Top Row - Logo & Wallet */}
              <View style={styles.headerRow}>
                <View style={styles.logoUserContainer}>
                  <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={()=>{onRefresh()}}
                  style={styles.logoContainer}>
                    <Image
                      style={styles.logoImage}
                      source={require('../../src/assets/icon.png')}
                    />
                  </TouchableOpacity>
                  <View style={styles.userInfoContainer}>
                    <Text 
                    allowFontScaling={false}
                    style={styles.userName} numberOfLines={1}>
                      {user?.name || 'Guest User'}
                    </Text>
                    <Text 
                    allowFontScaling={false}
                    style={styles.userEmail} numberOfLines={1}>
                      {user?.email || 'guest@example.com'}
                    </Text>
                  </View>
                </View>


                {/* <TouchableOpacity
                  onPress={goToNotification}
                  activeOpacity={0.7}
                >
                  <IconComponent 
                    name="notifications" 
                    size={22} 
                    color={colors.white} 
                    family="ionicons" 
                  />
               
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.balanceButton}
                  onPress={goToMyEarnings}
                  activeOpacity={0.7}
                >
                  <IconComponent 
                    name="wallet" 
                    size={22} 
                    color={colors.white} 
                    family="ionicons" 
                  />
                  <Text 
                  allowFontScaling={false}
                  style={styles.balanceText}> {totalBalance}</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <Animated.View style={animatedSearchStyle}>
                <TouchableOpacity
                  style={[styles.searchContainer, defaultStyleSheet.shadowProvider]}
                  onPress={goToAllStores}
                  activeOpacity={0.7}
                >
                  <IconComponent 
                    name="search" 
                    size={22} 
                    color={colors.black} 
                    family="ionicons" 
                  />
                  <Text  
                  allowFontScaling={false}
                  style={styles.searchText}>Search for Stores</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Refer & Earn - Collapses on scroll */}
              <Animated.View style={[styles.referWrapper, animatedReferStyle]}>
                <TouchableOpacity
                  style={[styles.referContainer]}
                  onPress={goToReferAndEarn}
                  activeOpacity={0.8}
                >
                  <View style={styles.referIconWrapper}>
                    <IconComponent 
                      name="gift" 
                      size={28} 
                      color={colors.white} 
                      family="ionicons" 
                    />
                  </View>
                  <View style={styles.referTextContainer}>
                    <Text 
                    allowFontScaling={false}
                    style={styles.referTitle}>Refer & Earn</Text>
                    <Text
                    allowFontScaling={false}
                    style={styles.referSubtitle}>
                      Invite friends and get rewards
                    </Text>
                  </View>
                  <IconComponent 
                    name="arrow-forward-ios" 
                    size={18} 
                    color={colors.colorPrimary} 
                    family="material" 
                  />
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Scrollable Content - Using FlatList */}
        <Animated.FlatList
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: getContentPaddingTop(),
          }}
          data={[{ key: 'content' }]}
          renderItem={() => (
            <>
              {/* Banner Slider */}
              <View style={styles.sliderWrapper}>
                <Slider banners={banners}/>
              </View>

              {/* Trending Stores - Horizontal */}
              <View style={styles.sectionContainer}>
              <LinearGradient
                                  colors={[colors.white , '#f9f9f9' ]}
                                  start={{x:1,y:0}}
                                  end={{x:0,y:0}}
                                  style={{padding:8}}>
                <View style={styles.sectionHeader}>

                  <View>
                    <Text 
                    allowFontScaling={false}
                    style={styles.sectionTitle}>Trending Stores</Text>
                    <Text style={styles.sectionSubtitle}
                    allowFontScaling={false}
                    >
                      Shop from top brands
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={goToAllStores}
                    style={styles.seeAllButton}
                  >
                    <Text style={styles.seeAllText}
                    allowFontScaling={false}>See All</Text>
                    <IconComponent 
                      name="arrow-forward-ios" 
                      size={14} 
                      color={colors.colorPrimary} 
                      family="material" 
                    />
                  </TouchableOpacity>
                </View>
                

                <FlatList
                  data={stores}
                  renderItem={({ item }) => (
                    <TrendingStoresItem item={item} containerWidth={160} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={styles.storesListContainer}
                />
                </LinearGradient>
              </View>

              {/* Dynamic Deal Sections */}
              {sections.map((section, idx) => (
  <View key={idx} style={styles.sectionContainer}>
    <LinearGradient
      colors={[colors.white, '#efefef']}
      style={{padding:8}}>

      <View style={styles.sectionHeader}>
        <View>
          <Text 
            allowFontScaling={false}
            style={styles.sectionTitle}>{section.title}</Text>
          <Text 
            allowFontScaling={false}
            style={styles.sectionSubtitle}>
            Best deals for you
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => 
            navigation.navigate('FlashDeals', { 
              storeId: section.storeId, // Pass storeId
              storeName: section.title.replace(' Deals', '') // Optional: Pass store name for display
            })
          }
          style={styles.seeAllButton}
        >
          <Text
            allowFontScaling={false}
            style={styles.seeAllText}>See All</Text>
          <IconComponent 
            name="arrow-forward-ios" 
            size={14} 
            color={colors.colorPrimary} 
            family="material" 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={section.data}
        renderItem={({ item }) => (
          <DealsItem 
            item={item} 
            showDescription={true} 
            widthMultiplier={0.7} 
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.dealsListContainer}
      />
    </LinearGradient>
  </View>
))}

              
            </>
          )}
          keyExtractor={(item) => item.key}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },

  gradientHeader: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  logoUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    marginRight: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 26,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  userEmail: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
  },
  balanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor:colors.colorPrimaryLite,
    borderRadius: 4,
    marginLeft:2,
    gap: 2,
  },
  balanceText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  searchContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderColor: colors.lightGray,
    marginBottom: 8,
  },
  searchText: {
    fontSize: 14,
    marginLeft: 4,
    color: colors.black,
    fontWeight: '500',
  },
  referWrapper: {
    overflow: 'hidden',
  },
  referContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 14,
    elevation: 3,
  },
  referIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.colorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  referTextContainer: {
    flex: 1,
  },
  referTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.colorPrimary,
  },
  referSubtitle: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '500',
  },
  sliderWrapper: {
    width: '100%',
    backgroundColor: colors.white,
  },
  sectionContainer: {
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
    padding:2
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.colorPrimary,
  },
  storesListContainer: {
    paddingVertical: 8,
    paddingLeft: 4,
  },
  dealsListContainer: {
    paddingVertical: 8,
    paddingRight: 16,
  },
});

export default Home;