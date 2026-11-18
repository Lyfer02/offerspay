import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Image,
} from 'react-native';
import { colors } from '../src/utils/color';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import IconButton from './IconButton';
import { shareLink, shareToWhatsApp } from '../src/utils/commonFunctions_one';
import { ErrorModalService } from '../src/utils/modalService';
import LinearGradient from 'react-native-linear-gradient';
import IconComponent from './IconComponent';

const DealsItem = ({
  item,
  showDescription = true,
  widthMultiplier = 0.9,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const maxCardWidth = 320;
  const containerWidth = Math.min(
    screenWidth * widthMultiplier,
    maxCardWidth
  );

  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  const goToProductDetails = () => {
    navigation.navigate('ProductDetailsScreen', { item });
  };

  const message = `Check out this amazing deal: ${item.name}\n\nStarting at Rs.${item.startingPrice}\nEarn up to ₹${item.earningRate}% on every order!\n\nLink: ${item.productUrl}`;

  const copyToClipboard = () => {
    Clipboard.setString(item.productUrl || '');
    ErrorModalService.success('Link copied to clipboard!');
  };

  const imageSource =
    item.sliderImages?.length
      ? { uri: item.sliderImages[0] }
      : item.logo
      ? { uri: item.logo }
      : require('../src/assets/fallback_image.png');

  // Press Animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 150,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={goToProductDetails}
        style={[
          styles.cardContainer,
          {
            width: containerWidth,
          },
          defaultStyleSheet.cardShadow,
        ]}>
        <View style={styles.cardInner}>
          {/* Floating Action Buttons with Glass Effect */}
          <View style={styles.actionIconsContainer}>
            <TouchableOpacity
            
            activeOpacity={0.8}
              onPress={() => shareToWhatsApp(message, item.sliderImages?.[0] ? [item.sliderImages[0]] : null)}
              style={styles.actionButton}>
              <LinearGradient
                colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                style={styles.actionButtonGradient}>
                <IconComponent
                  name="logo-whatsapp"
                  size={20}
                  color={colors.white}
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
            activeOpacity={0.8}
              onPress={copyToClipboard}
              style={styles.actionButton}>
              <View style={styles.glassButton}>
                <IconComponent
                  name="copy-outline"
                  size={18}
                  color={colors.colorPrimary}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
            
            activeOpacity={0.8}
              onPress={() => shareLink('Amazing Deal!', message, item.sliderImages?.[0] ? [item.sliderImages[0]] : null)}
              style={styles.actionButton}>
              <View style={styles.glassButton}>
                <IconComponent
                  name="share-social-outline"
                  size={18}
                  color={colors.colorPrimary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Product Image with Enhanced Styling */}
          <View style={styles.imageContainer}>
            <LinearGradient
              colors={[colors.colorPrimary + '08', colors.colorPrimary + '14']}
              style={styles.imageBackdrop}
            />
            <Image
              style={styles.productImage}
              source={imageSource}
              resizeMode='contain'
              defaultSource={require('../src/assets/fallback_image.png')}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Corner Decoration */}
            {/* <View style={styles.imageCornerDecor}>
              <LinearGradient
                colors={[colors.colorPrimaryLite, colors.transparent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cornerGradient}
              />
            </View> */}
          </View>

          {/* Product Info Section */}
          <View style={styles.infoSection}>
            {/* Product Name with Premium Styling */}
            <View style={styles.nameContainer}>
              <Text 
               allowFontScaling={false}
              style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              {/* <View style={styles.nameUnderline}>
                <LinearGradient
                  colors={[colors.colorPrimary, colors.colorPrimaryLite, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.underlineGradient}
                />
              </View> */}
            </View>

            {/* Description with Better Spacing */}
            {showDescription && (
              <View style={styles.descriptionContainer}>
                <Text
                allowFontScaling={false}
                numberOfLines={2} style={styles.descriptionText}>
                  {item.description || 'Exclusive deal with amazing benefits. Shop now and earn rewards!'}
                </Text>
              </View>
            )}

            {/* Enhanced Price and Earning Section */}
            <View style={styles.bottomSection}>
             

             

              {/* Earning Card with Premium Styling */}
              <View style={styles.earningCard}>
                <LinearGradient
                  colors={[colors.green + '14', colors.green + '1F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.earningCardGradient}>
                  {/* Premium Badge */}
                  {/* <View style={styles.premiumBadge}>
                    <LinearGradient
                      colors={[colors.premiumPrimary, colors.premiumSecondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.badgeGradient}>
                      <IconComponent
                        name="star"
                        size={10}
                        color={colors.white}
                        family="ionicons"
                      />
                      <Text 
                      allowFontScaling={false}
                      style={styles.badgeText}>PREMIUM</Text>
                    </LinearGradient>
                  </View> */}

                  {/* Earning Value */}
                  <View style={styles.earningValueWrapper}>
                    {/* <View style={styles.earningIconCircle}>
                      <LinearGradient
                        colors={[colors.green, colors.colorPrimary]}
                        style={styles.iconCircleGradient}>
                        <IconComponent
                          name="trending-up"
                          size={14}
                          color={colors.white}
                          family="ionicons"
                        />
                      </LinearGradient>
                    </View> */}
                    <View style={{flexDirection :'row',justifyContent:'center'
                      ,alignItems:'center'
                      }}>
                      <Text 
                      allowFontScaling={false}
                      style={styles.earningLabel}>Earn Upto </Text>
                      <Text 
                      allowFontScaling={false} style={styles.earningValue}>₹ {item.earningRate}%</Text>
                    </View>
                  </View>

                  <Text 
                  allowFontScaling={false}
                  style={styles.earningSubtext}>On every order</Text>
                </LinearGradient>
              </View>

               {/* Divider with Gradient */}
               {/* <View style={styles.dividerWrapper}>
                <LinearGradient
                  colors={[colors.transparent, colors.gray, colors.transparent]}
                  style={styles.dividerGradient}
                />
              </View> */}


               {/* Price Card */}
               <View style={styles.priceCard}>
                <LinearGradient
                  colors={[colors.colorPrimary + '0D', colors.colorPrimary + '05']}
                  style={styles.priceCardGradient}>
                  {/* <View style={styles.priceIconWrapper}>
                    <IconComponent
                      name="pricetag"
                      size={16}
                      color={colors.colorPrimary}
                      family="ionicons"
                    />
                  </View> */}
                  <View style={{flex:1, alignSelf:'center', justifyContent:'center',alignItems:'center', alignContent:'center'}}>
                    <Text 
                    allowFontScaling={false}
                    style={styles.priceLabel}> Price</Text>
                    <Text
                    allowFontScaling={false}
                    style={styles.priceValue}>₹ {item.startingPrice}</Text>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Call to Action Button */}
          {/* <TouchableOpacity
            activeOpacity={0.9}
            onPress={goToProductDetails}
            style={styles.ctaButtonWrapper}>
            <LinearGradient
              colors={[colors.colorPrimary, colors.colorPrimaryLite]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>View Deal</Text>
              <IconComponent
                name="arrow-forward"
                size={18}
                color={colors.white}
                family="ionicons"
              />
            </LinearGradient>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default DealsItem;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.white,
    overflow: 'hidden',
    // borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardInner: {
    borderRadius: 20,
  },
  actionIconsContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    gap: 8,
  },
  actionButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButton: {
    width: 42,
    height: 42,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.colorPrimaryLite + '26',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  imageBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  productImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imageCornerDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
  },
  cornerGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  infoSection: {
    paddingTop: 6,
  },
  nameContainer: {
    marginBottom: 4,
    paddingHorizontal:8
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 0.3,
  },
  nameUnderline: {
    marginTop: 4,
    height: 2,
    width: 40,
  },
  underlineGradient: {
    height: '100%',
    width: '100%',
  },
  descriptionContainer: {
    paddingBottom: 8,
    paddingHorizontal:8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    borderStyle:'dashed'
  },
  descriptionText: {
    fontSize: 12,
    textAlign:'justify',
    color: colors.text,
  },
  bottomSection: {
    flexDirection: 'row',padding:8,
    gap:8,
    alignItems: 'center',
  },
  priceCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  priceCardGradient: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 104, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '600',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.colorPrimary,
  },
  dividerWrapper: {
    width: 1,
    height: 40,
    marginHorizontal: 12,
  },
  dividerGradient: {
    width: '100%',
    height: '100%',
  },
  earningCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  earningCardGradient: {
    padding: 8,
    alignItems: 'center',
  },
  premiumBadge: {
    marginBottom: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  earningValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  earningIconCircle: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconCircleGradient: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningLabel: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600',
  },
  earningValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.colorPrimary,
  },
  earningSubtext: {
    fontSize: 10,
    color: colors.gray,
    fontWeight: '600',
  },
  ctaButtonWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.colorPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
});