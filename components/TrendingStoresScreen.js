import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Share,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../src/utils/color';
import IconComponent from './IconComponent';
import { storeService } from '../api/services/stores.service';
import { isAndroid, useResponsive } from '../src/utils/dimension';
import { storage } from '../src/utils/storage';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { shareLink, shareToWhatsApp } from '../src/utils/commonFunctions_one';

const TrendingStoresScreen = ({ route }) => {
  const storeId = route.params?.store?._id || route.params?.store || null;
  const navigation = useNavigation();
  const { width, isMobile, isTablet, isDesktop } = useResponsive();
  const scrollViewRef = useRef(null);
  const tabScrollRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const tabPositionY = useRef(new Animated.Value(0)).current;
  const [activeSection, setActiveSection] = useState(0);
  const [tabLayout, setTabLayout] = useState(null);
  const [rates, setRates] = useState(true);
  const [aboutBrand, setAboutBrand] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [imageUrl,setImageUrl]=useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const ratesAnim = useRef(new Animated.Value(1)).current;
  const aboutAnim = useRef(new Animated.Value(1)).current;

  // Get responsive dimensions
  const getResponsiveValue = useCallback((mobile, tablet, desktop) => {
    if (isDesktop) return desktop;
    if (isTablet) return tablet;
    return mobile;
  }, [isDesktop, isTablet]);

  const checkFavoriteStatus = useCallback(async (favoriteStoreId) => {
    try {
      const favorites = await storage.getItem('favoriteStores');
      if (favorites) {
        const favList = JSON.parse(favorites);
        setIsFavorite(favList.includes(favoriteStoreId));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, []);

  const fetchStoreById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await storeService.getById(id);
      const fetchedData = res.data?.data;
      
      if (!fetchedData) {
        throw new Error('No store data found');
      }
      //setImageUrl(fetchedData.image)
      const mappedData = {
        _id: fetchedData._id,
        name: fetchedData.name || 'Unnamed Store',
        image: { uri: fetchedData.image || '' },
        earn: fetchedData.earn ? `₹${fetchedData.earn}` : '₹0',
        trackingSpeed: fetchedData.trackingSpeed || 'N/A',
        confirmation: fetchedData.confirmation || 'N/A',
        earningRates: fetchedData.earningRates || [],
        about: fetchedData.about || 'No description available.',
        termsAndConditions: fetchedData.termsAndConditions || [],
        status: fetchedData.status || 'active',
        rating: fetchedData.rating || 0,
      };

      setStoreData(mappedData);
     {isAndroid && navigation.setOptions({ 
        title: mappedData.name,
        headerTitleStyle: {
          fontSize: getResponsiveValue(16, 18, 20),
        },
      });}
      
      await checkFavoriteStatus(mappedData._id);
    } catch (error) {
      console.error('Failed to fetch store:', error);
      setError('Failed to load store details');
    } finally {
      setIsLoading(false);
    }
  }, [checkFavoriteStatus, getResponsiveValue, navigation]);

  const toggleFavorite = async () => {
    try {
      const favorites = await storage.getItem('favoriteStores');
      let favList = favorites ? JSON.parse(favorites) : [];
      
      if (isFavorite) {
        favList = favList.filter(id => id !== storeData._id);
      } else {
        favList.push(storeData._id);
      }
      
      await storage.setItem('favoriteStores', JSON.stringify(favList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchStoreById(storeId);
    }
  }, [fetchStoreById, storeId]);

  const toggleEarningRates = () => {
    const toValue = rates ? 0 : 1;
    Animated.spring(ratesAnim, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    setRates(!rates);
  };

  const toggleAboutBrand = () => {
    const toValue = aboutBrand ? 0 : 1;
    Animated.spring(aboutAnim, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    setAboutBrand(!aboutBrand);
  };

  const tabs = [
    { id: 0, title: 'Earning Rates', ref: section1Ref },
    { id: 1, title: 'About the Brand', ref: section2Ref },
    { id: 2, title: 'Terms & Conditions', ref: section3Ref },
  ];

  const scrollToSection = (sectionRef, index) => {
    setActiveSection(index);

    const tabOffset = index * getResponsiveValue(120, 150, 200) - (width - 150) / 2;
    if (Platform.OS !== 'web') {
      tabScrollRef.current?.scrollTo({ x: Math.max(0, tabOffset), animated: true });
    }

    if (Platform.OS === 'web') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      sectionRef.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          const offset = y - (tabLayout?.height || 0) - 80;
          scrollViewRef.current?.scrollTo({ y: Math.max(0, offset), animated: true });
        },
        () => {},
      );
    }
  };

  const handleScroll = Platform.OS === 'web'
    ? undefined
    : Animated.event(
        [{ nativeEvent: { contentOffset: { y: tabPositionY } } }],
        {
          useNativeDriver: false,
          listener: event => {
            const scrollY = event.nativeEvent.contentOffset.y;
            section1Ref.current?.measureLayout(
              scrollViewRef.current,
              (x1, y1) => {
                section2Ref.current?.measureLayout(
                  scrollViewRef.current,
                  (x2, y2) => {
                    section3Ref.current?.measureLayout(
                      scrollViewRef.current,
                      (x3, y3) => {
                        const threshold = getResponsiveValue(250, 300, 400);
                        if (scrollY >= y3 - threshold) {
                          setActiveSection(2);
                        } else if (scrollY >= y2 - threshold) {
                          setActiveSection(1);
                        } else {
                          setActiveSection(0);
                        }
                      },
                      () => {},
                    );
                  },
                  () => {},
                );
              },
              () => {},
            );
          },
        },
      );

  // const shareReferralLink = async () => {
  //   try {
  //     await Share.share({
  //       message: `🛍️ Check out this amazing store: ${storeData?.name || 'Store'}\n💰 Earn ${storeData?.earn || 'cashback'} on every purchase!`,
  //       title: `${storeData?.name || 'Store'} - Cashback Store`,
  //     });
  //   } catch (error) {
  //     console.log('Error sharing the link: ', error.message);
  //   }
  // };

  // const shareToWhatsApp = async () => {
  //   const message = `🛍️ Check out this amazing store: *${storeData?.name || 'Store'}*\n💰 Earn ${storeData?.earn || 'cashback'} on every purchase!`;
  //   const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  //   try {
  //     await Linking.openURL(url);
  //   } catch (error) {
  //     console.log('Error opening WhatsApp: ', error.message);
  //   }
  // };

  if (isLoading) {
    return (
      <SafeAreaView style={{backgroundColor:colors.white,flex:1}}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.colorPrimary} />
          <Text
          allowFontScaling={false}
          style={[styles.loadingText, { fontSize: getResponsiveValue(16, 18, 20) }]}>
            Loading store details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !storeData) {
    return (
      <SafeAreaView style={{backgroundColor:colors.white,flex:1}}>
        <View style={styles.errorContainer}>
          <IconComponent 
            name="alert-circle-outline" 
            size={getResponsiveValue(48, 56, 64)} 
            color={colors.red} 
          />
          <Text
          allowFontScaling={false}
          style={[styles.errorText, { fontSize: getResponsiveValue(16, 18, 20) }]}>
            {error || 'No store data available'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => storeId && fetchStoreById(storeId)}
          >
            <Text 
            allowFontScaling={false}
            style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  const title= "Shareing your data in whatsapp"
  const message = `🛍️ Check out this amazing store: *${storeData?.name || 'Store'}*\n💰 Earn ${storeData?.earn  || 'cashback'}  % on every purchase!`;
 const imageUrl = storeData?.image.uri;



 
 

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex:1,}}>
      <ScrollView
        ref={scrollViewRef}
        style={{backgroundColor:colors.white}}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={[
          styles.heroSection,
          {
            flexDirection: isMobile ? 'column' : 'row',
            padding: getResponsiveValue(16, 24, 32),
          }
         ]}>
          {/* Left: Store Image & Basic Info */}
          <View style={[
            styles.storeInfoCard,
            {
              width: isMobile ? '100%' : getResponsiveValue('100%', 350, 400),
              marginBottom: 0,
              marginRight: isMobile ? 0 : 24,
              
            }
          ]}>
            <View style={styles.imageWrapper}>
              <Image
              resizeMode='contain'
                style={[
                  styles.storeImage,
                  {
                    height: getResponsiveValue(160, 160, 180),
                  }
                ]}
                source={storeData.image}
                defaultSource={require('../src/assets/fallback_image.png')}
              />
              {/* <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={toggleFavorite}
                accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                accessibilityRole="button"
              >
                <Animated.View
                  style={{
                    transform: [{ scale: isFavorite ? 1.1 : 1 }],
                  }}
                >
                  <IconComponent
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={26}
                    color={isFavorite ? colors.red : colors.gray}
                  />
                </Animated.View>
              </TouchableOpacity> */}
            </View>

      
           
            <Text 
            
            allowFontScaling={false}
            style={[
              styles.storeName,
              { fontSize: getResponsiveValue(20, 28, 32) }
            ]}>
              {storeData.name}
            </Text>

            

           
            
            <View style={styles.earnBadge}>
              {/* <IconComponent
                name="currency-rupee"
                size={20}
                color={colors.colorPrimary}
                  family="fontawesome"
              /> */}
              <Text
              
            allowFontScaling={false}
              style={styles.earnLabel}>You Earn: </Text>
              <Text 
              
            allowFontScaling={false}
            style={styles.earnAmount}>{storeData.earn} %</Text>
            </View>
            
            <View style={styles.statusBadge}>
              <IconComponent
                name="checkmark-circle"
                size={16}
                color={colors.green}
              />
              <Text 
            allowFontScaling={false}
              style={styles.statusText}>Missing Earnings Not Allowed</Text>
            </View>

            {/* Rating if available */}
            {/* {storeData.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingValue}>{storeData.rating.toFixed(1)}</Text>
                <IconComponent
                  name="star"
                  size={18}
                  color={colors.colorPrimary}
                />
                <Text style={styles.ratingText}>Store Rating</Text>
              </View>
            )} */}
          </View>

          {/* Right: Details & Actions */}
          <View style={[
            styles.detailsCard,
            {
              flex: isMobile ? 0 : 1,
              padding: getResponsiveValue(8, 24, 28),
            }
          ]}>
            {/* Categories */}
            {/* <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconComponent
                  name="pricetags-outline"
                  size={20}
                  color={colors.colorPrimary}
                />
                <Text style={[
                  styles.sectionHeading,
                  { fontSize: getResponsiveValue(16, 18, 20) }
                ]}>
                  Categories
                </Text>
              </View>
              <View style={styles.categoryGrid}>
                {['Baby & Kids', 'Fashion', 'Superior', 'Luggage', 'Electronics', 'Brand'].map(
                  (category, index) => (
                    <View key={index} style={styles.categoryChip}>
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                  ),
                )}
              </View>
            </View> */}

            {/* Tracking Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <IconComponent
                  name="time-outline"
                  size={20}
                  color={colors.colorPrimary}
                />
                <Text allowFontScaling={false}
                style={[
                  styles.sectionHeading,
                  { fontSize: getResponsiveValue(14, 18, 20) }
                ]}>
                  Tracking Information
                </Text>
              </View>
              <View style={[
                styles.trackingGrid,
                {
                  flexDirection: 'row',
                  gap: getResponsiveValue(4, 16, 20),
                }
              ]}>
                <View style={styles.trackingCard}>
                  <Image
                    style={styles.trackingIcon}
                    source={require('../src/assets/verified_time.png')}
                  />
                  <Text
                  
             allowFontScaling={false}
                  style={styles.trackingLabel}>Tracking Speed</Text>
                  <Text
                  
             allowFontScaling={false}
                  style={styles.trackingValue}>{storeData.trackingSpeed}</Text>
                </View>
                <View style={styles.trackingCard}>
                  <Image
                    style={styles.trackingIcon}
                    source={require('../src/assets/verified.png')}
                  />
                  <Text 
             allowFontScaling={false} style={styles.trackingLabel}>Confirms In</Text>
                  <Text 
             allowFontScaling={false} style={styles.trackingValue}>{storeData.confirmation}</Text>
                </View>
              </View>
            </View>

            {/* Share Buttons (Desktop/Tablet) */}
            {!isMobile && (
              <View style={styles.shareSection}>
                <LinearGradient
                     colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                     style={[styles.actionButton]}
                              
                    >
                <TouchableOpacity
                activeOpacity={0.9}
                  onPress={()=>{
                    shareToWhatsApp(message,imageUrl? [imageUrl]:'null' , title)
                  }}
                  style={[ {alignItems:'center', justifyContent:'center', flex: 1 ,flexDirection:'row',gap:8 ,}]}
                  accessibilityLabel="Share via WhatsApp"
                  accessibilityRole="button"
                >
                  <IconComponent name="logo-whatsapp" size={22} color={colors.white} />
                  <Text 
                  numberOfLines={1}
                allowFontScaling={false} style={styles.actionButtonText}>Share on WhatsApp</Text>
                </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity
                  onPress={()=>{
                    shareLink(title,message,imageUrl? [imageUrl]:'null' )
                  }}
                  style={[styles.actionButton, styles.shareOutlineButton]}
                  accessibilityLabel="Share referral link"
                  accessibilityRole="button"
                >
                  <IconComponent
                    name="share-social-outline"
                    size={22}
                    color={colors.colorPrimary}
                  />
                  <Text 
                  numberOfLines={1}
            allowFontScaling={false} style={[styles.actionButtonText, { color: colors.colorPrimary }]}>
                    Share Link
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
         </View>

         {/* Sticky Tab Navigation */}
         <View
          style={[
            styles.tabBar,
            { paddingVertical: getResponsiveValue(0, 12, 14) }
          ]}
          onLayout={event => setTabLayout(event.nativeEvent.layout)}
         >
          <ScrollView
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {tabs.map((tab, index) => (

              <TouchableOpacity
                key={tab.id}
                onPress={() => scrollToSection(tab.ref, index)}
                style={[
                  styles.tabItem,
                  activeSection === index && styles.tabItemActive,
                  {
                    paddingHorizontal: getResponsiveValue(18, 22, 26),
                    paddingVertical: getResponsiveValue(10, 12, 14),
                  }
                ]}
                accessibilityLabel={tab.title}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeSection === index }}
              >
                <Text
                
            allowFontScaling={false}
                  style={[
                    styles.tabLabel,
                    activeSection === index && styles.tabLabelActive,
                    { fontSize: getResponsiveValue(12, 15, 16) }
                  ]}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Sections */}
        <View style={[
          styles.contentContainer,
          { 
            padding: getResponsiveValue(16, 24, 32),
            maxWidth: 1200,
            alignSelf: 'center',
            width: '100%',
          }
        ]}>
          {/* Earning Rates Section */}
          <View ref={section1Ref} style={styles.contentSection}>
            <TouchableOpacity
            activeOpacity={0.9}
              onPress={toggleEarningRates}
              style={styles.collapsibleHeader}
              accessibilityLabel={rates ? 'Collapse Earning Rates' : 'Expand Earning Rates'}
              accessibilityRole="button"
            >
              <View style={styles.headerLeft}>
                <IconComponent
                  name="cash-outline"
                  size={24}
                  color={colors.colorPrimary}
                />
                <Text 
                
            allowFontScaling={false}
                style={[
                  styles.contentTitle,
                  { fontSize: getResponsiveValue(14, 16, 16) }
                ]}>
                  Earning Rates
                </Text>
              </View>
              <IconComponent
                size={24}
                name={rates ? 'chevron-down' : 'chevron-up'}
                color={colors.colorPrimary}
              />
            </TouchableOpacity>
            
            <Animated.View 
              style={{
                maxHeight: ratesAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 2000],
                }),
                opacity: ratesAnim,
                overflow: 'hidden',
              }}
            >
              {rates && storeData.earningRates.length > 0 && (
                <View style={styles.contentCard}>
                  <View style={styles.tableHeader}>
                    <Text 
            allowFontScaling={false} style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
                    <Text  
            allowFontScaling={false} style={styles.tableHeaderText}>Rate</Text>
                  </View>
                  {storeData.earningRates.map((rate, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.tableRow,
                        index === storeData.earningRates.length - 1 && styles.tableRowLast
                      ]}
                    >
                      <Text  
            allowFontScaling={false} style={[styles.tableDescription, { flex: 2 }]}>
                        {rate.description}
                      </Text>
                      <View  
            allowFontScaling={false} style={styles.rateBadge}>
                        <Text  
            allowFontScaling={false} style={styles.rateText}>{rate.rate}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          </View>

          {/* About the Brand Section */}
          <View ref={section2Ref} style={styles.contentSection}>
            <TouchableOpacity
            activeOpacity={0.9}
              onPress={toggleAboutBrand}
              style={styles.collapsibleHeader}
              accessibilityLabel={aboutBrand ? 'Collapse About the Brand' : 'Expand About the Brand'}
              accessibilityRole="button"
            >
              <View style={styles.headerLeft}>
                <IconComponent
                  name="information-circle-outline"
                  size={24}
                  color={colors.colorPrimary}
                />
                <Text 
                  allowFontScaling={false} style={[
                  styles.contentTitle,
                  { fontSize: getResponsiveValue(14, 16, 16) }
                ]}>
                  About the Brand
                </Text>
              </View>
              <IconComponent
                size={24}
                name={aboutBrand ? 'chevron-down' : 'chevron-up'}
                color={colors.colorPrimary}
              />
            </TouchableOpacity>
            
            <Animated.View 
              style={{
                maxHeight: aboutAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 2000],
                }),
                opacity: aboutAnim,
                overflow: 'hidden',
              }}
            >
              {aboutBrand && (
                <View style={styles.contentCard}>
                  <Text 
            allowFontScaling={false} style={styles.bodyText}>{storeData.about}</Text>
                </View>
              )}
            </Animated.View>
          </View>

          {/* Terms & Conditions Section */}
          <View ref={section3Ref} style={styles.contentSection}>
            <View style={styles.staticHeader}>
              <View style={styles.headerLeft}>
                <IconComponent
                  name="document-text-outline"
                  size={24}
                  color={colors.colorPrimary}
                />
                <Text 
            allowFontScaling={false} style={[
                  styles.contentTitle,
                  { fontSize: getResponsiveValue(14, 16, 16) }
                ]}>
                  Terms & Conditions
                </Text>
              </View>
            </View>
            <View style={styles.contentCard}>
              {storeData.termsAndConditions.length > 0 ? (
                <View style={styles.termsList}>
                  {storeData.termsAndConditions.map((term, index) => (
                    <View key={index} style={styles.termItem}>
                      <View style={styles.termBullet}>
                        <Text 
            allowFontScaling={false} style={styles.termBulletText}>{index + 1}</Text>
                      </View>
                      <Text  
            allowFontScaling={false}style={styles.termText}>{term}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text  
                allowFontScaling={false} style={styles.emptyText}>No terms and conditions available.</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Share Buttons (Mobile) */}
      {isMobile && (
        <View style={[
          styles.bottomActions,
          { padding: getResponsiveValue(8, 16, 20) }
        ]}>
          <LinearGradient
                     colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                     style={[styles.actionButton]}
                              
                    >
          <TouchableOpacity
             onPress={()=>{
              console.log("this is imgurl", imageUrl);
              
              shareToWhatsApp(message,imageUrl? [imageUrl]:'null' , title)
            }}
            style={[ {alignItems:'center', justifyContent:'center', flex: 1 ,flexDirection:'row',gap:8 ,}]}
            accessibilityLabel="Share via WhatsApp"
            accessibilityRole="button"
          >
            <IconComponent name="logo-whatsapp" size={22} color={colors.white} />
            <Text 
            allowFontScaling={false} style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={()=>{
              shareLink(title,message,imageUrl? [imageUrl]:'null' )
            }}
            style={[styles.actionButton, styles.shareOutlineButton, { flex: 1 }]}
            accessibilityLabel="Share referral link"
            accessibilityRole="button"
          >
            <IconComponent name="share-social-outline" size={22} color={colors.colorPrimary} />
            <Text 
            allowFontScaling={false} style={[styles.actionButtonText, { color: colors.colorPrimary }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: colors.gray,
    textAlign: 'center',
    marginTop: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.colorPrimary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  heroSection: {
    maxWidth:1200,
    backgroundColor: colors.white,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 4 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 12,
    //   },
    //   android: {
    //     elevation: 4,
    //   },
    //   web: {
    //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    //   },
    // }),
  },
  storeInfoCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  storeImage: {
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    backgroundColor: colors.white,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  storeName: {
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 2,
  },
  earnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 4,
  },
  earnLabel: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 6,
    fontWeight: '500',
  },
  earnAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.colorPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  ratingText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        // elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionHeading: {
    fontWeight: '700',
    color: colors.black,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  categoryText: {
    fontSize: 13,
    color: colors.colorPrimary,
    fontWeight: '600',
  },
  trackingGrid: {
    width: '100%',
  },
  trackingCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    minWidth: 140,
  },
  trackingIcon: {
    width: 20,
    height: 20,
    marginBottom: 8,
  },
  trackingLabel: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
    textAlign: 'center',
  },
  trackingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
  },
  shareSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  whatsappButton: {
    backgroundColor: colors.colorPrimary,
  },
  shareOutlineButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.colorPrimary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: colors.white,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        // elevation: 1,
      },
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  tabScrollContent: {
    paddingHorizontal: 12,
    gap: 10,
  },
  tabItem: {
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
  },
  tabItemActive: {
    backgroundColor: colors.colorPrimary,
    transform: [{ scale: 1.02 }],
    ...Platform.select({
      ios: {
        shadowColor: colors.colorPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: `0 2px 8px ${colors.colorPrimary}40`,
      },
    }),
  },
  tabLabel: {
    fontWeight: '500',
    color: colors.gray,
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: '700',
  },
  contentContainer: {
    marginTop: 16,
  },
  contentSection: {
    marginBottom: 10,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  staticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  contentTitle: {
    fontWeight: '700',
    color: colors.black,
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical:8
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.08,
    //     shadowRadius: 8,
    //   },
    //   android: {
    //     elevation: 3,
    //   },
    //   web: {
    //     boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    //   },
    // }),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.black,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableDescription: {
    fontSize: 12,
    color: colors.black,
    lineHeight: 20,
    paddingRight: 12,
  },
  rateBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  rateText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.green,
  },
  bodyText: {
    fontSize: 12,
    color: colors.black,
    lineHeight: 26,
    paddingStart:4,
    textAlign: 'justify',
  },
  termsList: {
    gap: 16,
    paddingStart:4
  },
  termItem: {
    flexDirection: 'row',
    alignContent:'center',
    alignItems:'center',
    gap: 12,
  },
  termBullet: {
    backgroundColor: colors.colorPrimary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  termBulletText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  termText: {
    flex: 1,
    fontSize: 12,
    color: colors.black,
    lineHeight: 22,
    textAlign: 'justify',
  },
  emptyText: {
    fontSize: 12,
    color: colors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.08)',
      },
    }),

  }
});

export default TrendingStoresScreen;
  
