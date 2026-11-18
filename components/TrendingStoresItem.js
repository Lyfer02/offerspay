import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../src/utils/color';
import IconComponent from './IconComponent';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import { storage } from '../src/utils/storage';
import { formatNumber } from '../src/utils/number';
import { shareLink, shareToWhatsApp } from '../src/utils/commonFunctions_one';
import LinearGradient from 'react-native-linear-gradient';

const TrendingStoresItem = ({ item, containerWidth }) => {
  const navigation = useNavigation();
  const { width: screenWidth } = useWindowDimensions();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const imageSource = item.image 
    ? (typeof item.image === 'string' ? { uri: item.image } : item.image)
    : require('../src/assets/fallback_image.png');
  
  const imageUrl = typeof item.image === 'string' ? item.image : null;
  
  // Responsive Config
  const getResponsiveConfig = () => {
    const effectiveWidth = containerWidth || screenWidth * 0.45;
    
    return {
      imageHeight: effectiveWidth > 200 ? 120 : effectiveWidth > 160 ? 100 : 85,
      fontSize: {
        title: effectiveWidth > 200 ? 16 : effectiveWidth > 160 ? 14 : 13,
        earn: effectiveWidth > 200 ? 14 : effectiveWidth > 160 ? 12 : 10,
        share: effectiveWidth > 200 ? 12 : effectiveWidth > 160 ? 12 : 11,
      },
      padding: effectiveWidth > 200 ? 14 : effectiveWidth > 160 ? 12 : 10,
      iconSize: {
        earn: effectiveWidth > 200 ? 14 : 12,
        whatsapp: effectiveWidth > 200 ? 20 : 18,
        share: effectiveWidth > 200 ? 16 : 14,
      },
      spacing: {
        marginBottom: effectiveWidth > 200 ? 6 : 6,
        buttonPadding: effectiveWidth > 200 ? 10 : 8,
      }
    };
  };

  const config = getResponsiveConfig();

  // Shimmer Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  // Press Animations
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 150,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 5,
    }).start();
  };

  // Navigation + Recently Viewed
  const goToTrendingStoresItem = async () => {
    try {
      const recentlyViewed = await storage.getItem('recentlyViewed');
      const recent = recentlyViewed ? JSON.parse(recentlyViewed) : [];
      const updatedRecent = [item, ...recent.filter(r => r._id !== item._id)].slice(0, 10);
      await storage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
    } catch (error) {
      console.error('Error storing recently viewed:', error);
    }

    navigation.navigate('TrendingStoresScreen', { store: item._id });
  };

  // Share Messages
  const shareMessage = `Check out ${item.name}!\n\nEarn up to ${formatNumber(item.earn)}%\nRating: ${item.rating}/5\n\nDownload the app and start earning!`;
  const title = `${item.name} - Great Deals Await!`;

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <Animated.View style={[styles.containerWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={goToTrendingStoresItem}
        style={[styles.touchableContainer, { minWidth: containerWidth }]}>
        
        <View style={[styles.cardWrapper, defaultStyleSheet.cardShadow]}>
          {/* NEW Badge with Enhanced Gradient */}
          {item.new === 'new' && (
            <View style={styles.newBadgeContainer}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53', '#FFD93D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </LinearGradient>
            </View>
          )}

          {/* Card Content */}
          <View style={[styles.trendingStoreContainer,]}>
            {/* Image with Glass Morphism Effect */}
            <View style={[styles.imageWrapper, { height: config.imageHeight, marginBottom: config.spacing.marginBottom }]}>
              <View style={styles.imageBackground}>
                <LinearGradient
                  colors={[colors.colorPrimary + '0D', colors.colorPrimary + '05']}
                  style={styles.imageBackdrop}
                />
                <Image
                  style={styles.image}
                  source={imageSource}
                  resizeMode="contain"
                  defaultSource={require('../src/assets/fallback_image.png')}
                />
              </View>
            </View>

            {/* Store Details */}
            <View style={[styles.detailsContainer, { marginBottom: config.spacing.marginBottom }]}>
              <Text 
                  allowFontScaling={false}
                style={[
                  styles.storeName, 
                  { 
                    fontSize: config.fontSize.title,
                    lineHeight: config.fontSize.title * 1.4,
                  }
                ]} 
                numberOfLines={2}>
                {item.name}
              </Text>


<View>






              {/* Earn Container with Premium Gradient */}
              <View style={styles.earnContainerWrapper}>
                <LinearGradient
                  colors={[colors.green + '1A', colors.green + '26']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.earnContainer, { marginTop: 4 }]}>
                  <View style={styles.earnIconWrapper}>
                    <LinearGradient
                      colors={[colors.green, colors.colorPrimary]}
                      style={styles.earnIconGradient}>
                      <IconComponent 
                        name="trending-up" 
                        size={config.iconSize.earn} 
                        color={colors.white} 
                        family="ionicons"
                      />
                    </LinearGradient>
                  </View>
                  <Text 
                  allowFontScaling={false} 
                  style={[styles.earnText, { fontSize: config.fontSize.earn, color: colors.colorPrimary }]}>
                    Earn Upto {item.earn}%
                  </Text>
                </LinearGradient>
              </View>

              {/* Enhanced Status Indicator */}
              {/* <View style={[styles.statusContainer, { marginTop: 8 }]}>
                <View style={styles.statusDotWrapper}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.status === 'active' ? colors.green : colors.colorWarning },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.statusDotPulse,
                      { 
                        backgroundColor: item.status === 'active' ? colors.green : colors.colorWarning,
                        opacity: shimmerAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 0],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.statusText, { fontSize: config.fontSize.earn - 1, color: colors.gray }]}>
                  {item.status === 'active' ? 'Available Now' : 'Limited Stock'}
                </Text>
              </View> */}
            </View>

            {/* Enhanced Share Buttons */}
            <View style={[styles.shareContainer, { paddingHorizontal: config.spacing.marginBottom , paddingTop : config.spacing.marginBottom}]}>
              {/* WhatsApp Share with Gradient */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => shareToWhatsApp(
                  shareMessage,
                  imageUrl ? [imageUrl] : null,
                  title
                )}
                style={[styles.buttonWrapper, { flex: 1 }]}>
                <LinearGradient
                  colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                  style={[
                    styles.whatsappButton,
                    { 
                      paddingVertical: config.spacing.buttonPadding,
                      paddingHorizontal: config.spacing.buttonPadding + 4,
                    }
                  ]}>
                  <IconComponent name="logo-whatsapp" size={config.iconSize.whatsapp} color={colors.white} />
                  <Text 
                  allowFontScaling={false}
                  style={[styles.whatsappText, { fontSize: config.fontSize.share }]}>
                    Share
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Generic Share with Glass Effect */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => shareLink(
                  title,
                  shareMessage,
                  imageUrl ? [imageUrl] : null
                )}
                style={styles.shareButtonWrapper}>
                <View style={[
                  styles.glassShareButton,
                  { 
                    width: config.spacing.buttonPadding * 4.5,
                    height: config.spacing.buttonPadding * 4.5,
                  }
                ]}>
                  <LinearGradient
                    colors={[colors.colorPrimary + '1A', colors.colorPrimary + '0D']}
                    style={styles.glassGradient}>
                    <IconComponent name="share-social-outline" size={config.iconSize.share} color={colors.colorPrimary} />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>

            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TrendingStoresItem;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    margin: 4,
  },
  touchableContainer: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderColor: 'rgba(0,0,0,0.04)',
  },
  newBadgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 18,
  },
  newBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  trendingStoreContainer: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  imageWrapper: {
    width: '100%',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  imageBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  storeName: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: colors.black,
    paddingHorizontal: 4,
  },
  earnContainerWrapper: {
    width: '100%',
  },
  earnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom:8,
    justifyContent: 'center',
  },
  earnIconWrapper: {
    marginRight: 8,
  },
  earnIconGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnText: {
    fontWeight: '600',
    color: colors.colorPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDotWrapper: {
    position: 'relative',
    marginRight: 6,
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    zIndex: 2,
  },
  statusDotPulse: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  shareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth:1,
    borderStyle:'dashed',
    borderTopColor:colors.gray,
    width: '100%',
    gap: 10,
  },
  buttonWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  whatsappButton: {
    flexDirection: 'row',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    gap:4
  },
  whatsappText: {
    color: colors.white,
    fontWeight: '600',
  },
  shareButtonWrapper: {
    borderRadius: 25,
  },
  glassShareButton: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.colorPrimary,
  },
  glassGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});