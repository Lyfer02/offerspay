import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../src/utils/color';
import {TermsAndConditions, todaysTopDeals} from './TrendingStoresItemData';
import DealsItem from './DealsItem';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import IconComponent from './IconComponent';
import ProductImageGallery from './ImageViewer';
import StarRating from './StarRating';
import {productService} from '../api/services/product.service';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { shareLink, shareToWhatsApp } from '../src/utils/commonFunctions_one';

const ProductDetails = ({route}) => {
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [isExtraWideScreen, setIsExtraWideScreen] = useState(false);
  const [termsConditions, setTermsConditions] = useState(true);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id = route.params?.item._id;
  const navigation = useNavigation();

  // Fetch product details by ID
  const fetchProductById = async productId => {
    if (!productId) {
      console.error('No product ID provided');
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await productService.getById(productId);
      const fetchedData = res.data?.data || null;

      //console.log("this is fetche product data",fetchedData);
     // console.log("this is fetched images",fetchedData.sliderImages)

      if (!fetchedData) {
        console.error('No product data found in response');
        setError('No product data found');
        setLoading(false);
        return;
      }

      const mappedData = {
        id: fetchedData.id || fetchedData._id || productId,
        name: fetchedData.name || 'Unknown Product',
        images: Array.isArray(fetchedData.sliderImages) && fetchedData.sliderImages.length > 0
  ? fetchedData.sliderImages.map(url => ({ uri: url }))
  : fetchedData.logo
    ? [{ uri: fetchedData.logo }]
    : [{ uri: 'https://via.placeholder.com/400' }],
        image: fetchedData.logo || '',
        offerDescription:
          Array.isArray(fetchedData.availableOffers) &&
          fetchedData.availableOffers.length > 0
            ? fetchedData.availableOffers
            : ['No offers available'],
        productDescription: fetchedData.description
          ? [String(fetchedData.description)]
          : ['No description available'],
        startingPrice: Number(fetchedData.startingPrice) || 0,
        sellingPrice: Number(fetchedData.sellingPrice) || 0,
        earningRate: String(fetchedData.earningRate) || '0',
        store:
          fetchedData.store &&
          typeof fetchedData.store === 'object' &&
          fetchedData.store.name
            ? fetchedData.store.name
            : 'Unknown Store',
        rating: Number(fetchedData.rating) || 3.2,
        categories: fetchedData.category
          ? typeof fetchedData.category === 'string'
            ? [fetchedData.category]
            : Array.isArray(fetchedData.category)
            ? fetchedData.category
            : ['Unknown Category']
          : ['Baby & kids', 'Fashion', 'superior', 'luggage', 'electronics', 'brand'],
        trackingSpeed: '24 Hours',
        confirmsIn: '90 Days',
        productUrl: fetchedData.productUrl || 'http://abcd.com',
        trackingUrl: fetchedData.trackingUrl || 'http://abcd.com/click?',
      };

      setProduct(mappedData);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to fetch product details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product on component mount
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  useEffect(() => {
    const updateScreenWidth = ({window}) => {
      const {width} = window;
      setIsWideScreen(width > 1024);
      setIsExtraWideScreen(width > 1600);
    };

    const {width} = Dimensions.get('window');
    setIsWideScreen(width > 1024);
    setIsExtraWideScreen(width > 1600);

    const subscription = Dimensions.addEventListener('change', updateScreenWidth);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: product ? product.name : 'Product Detail',
      headerTitleStyle: {
        fontSize: isWideScreen ? 20 : 16,
      },
    });
  }, [navigation, product, isWideScreen]);

  const showTermsAdConditions = () => {
    setTermsConditions(!termsConditions);
  };



 //console.log("thisis product",product);
 
  const title= "Sharing your data "
  const message = `🛍️ Check out this amazing product : ${product?.name || 'Store'} 💰 Earn ${product?.earnningRate  || 'cashback'}  % on every purchase!`;
 const imageUrl = product?.image;

 //console.log("this is data , ", title , message,imageUrl);
 

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.colorPrimary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <IconComponent
          name="alert-circle-outline"
          size={64}
          color={colors.gray}
        />
        <Text style={styles.errorText}>{error || 'No product data available'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchProductById(id)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate discount percentage
  const discountPercent = product.startingPrice > 0
    ? Math.round(((product.startingPrice - product.sellingPrice) / product.startingPrice) * 100)
    : 0;

  return (
    <SafeAreaProvider>
    <SafeAreaView style={defaultStyleSheet.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.contentWrapper}>
          <View style={styles.mainContainer}>
            {/* Product Card */}
            <View
              style={[
                styles.productCard,
                {flexDirection: isWideScreen ? 'row' : 'column'},
              ]}>
              {/* Image Gallery */}
              <View style={styles.imageContainer}>
                <ProductImageGallery
                  images={product.images}
                  isWideScreen={isWideScreen}
                  onShareReferral={()=>{shareLink(title,message,imageUrl? [imageUrl]:'null' )}}
                  onShareWhatsApp={()=>{shareToWhatsApp(message,imageUrl? [imageUrl]:'null' , title)}}
                />
              </View>

              {/* Product Info */}
              <View
                style={[
                  styles.productInfoContainer,
                  {flex: isWideScreen ? 1 : null},
                ]}>
                {/* Product Name */}
                <Text allowFontScaling={false}
                 style={styles.productName}>{product.name}</Text>

                {/* Store Info */}
                <View style={styles.storeContainer}>
                <View style={styles.storeLogoContainer}>
                    <Image
                      style={styles.storeLogo}
                      resizeMode='contain'
                      source={{uri: product.image}}
                      defaultSource={require('../src/assets/fallback_image.png')}
                      onError={error =>
                        console.log('Image loading error:', error.nativeEvent)
                      }
                    />
                  </View>
                  <Text  allowFontScaling={false}
                      numberOfLines={1} style={styles.storeName}>{product.store}</Text>
                  
                </View>

                {/* Rating */}
                {/* <View style={styles.ratingContainer}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingValue}>{product.rating}</Text>
                    <IconComponent
                      name="star"
                      size={14}
                      color={colors.white}
                      style={{marginLeft: 2}}
                    />
                  </View>
                  <Text style={styles.ratingCount}>239 Ratings</Text>
                </View> */}

                {/* Pricing Section */}
                <View style={styles.pricingSection}>
                  {/* Buy At Price */}
                  <View style={styles.priceBlock}>
                    <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.priceLabel}>Buy At</Text>
                    <View style={styles.priceRow}>
                      <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.sellingPrice}>
                        ₹{product.sellingPrice}
                      </Text>
                      <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.originalPrice}>
                        ₹{product.startingPrice}
                      </Text>
                    </View>
                    {discountPercent > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          {discountPercent}% OFF
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Divider */}
                  <View style={styles.priceDivider} />

                  {/* Earnings */}
                  <View style={styles.earningsBlock}>
                    <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.earningsLabel}>Your Earnings</Text>
                    <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.earningsValue}>
                      Upto {product.earningRate}%
                    </Text>
                  </View>
                </View>

                {/* Tracking Info */}
                <View style={styles.trackingContainer}>
                  <View style={styles.trackingItem}>
                    <View style={styles.trackingIconWrapper}>
                      <Image
                        style={styles.trackingIcon}
                        source={require('../src/assets/sand_clock.png')}
                      />
                    </View>
                    <View>
                      <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.trackingLabel}>Tracking Speed</Text>
                      <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.trackingValue}>
                        {product.trackingSpeed}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.trackingItem}>
                    <View style={styles.trackingIconWrapper}>
                      <Image
                        style={styles.trackingIcon}
                        source={require('../src/assets/verified.png')}
                      />
                    </View>
                    <View>
                      <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.trackingLabel}>Confirms In</Text>
                      <Text allowFontScaling={false}
                      numberOfLines={1} style={styles.trackingValue}>
                        {product.confirmsIn}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Share Button for Wide Screen */}
                {isWideScreen && (

                  <LinearGradient
                   colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                   style={styles.wideScreenShareButton}
                                                
                                      >
                  <TouchableOpacity
                    onPress={() =>
                      shareToWhatsApp(
                        message,
                        imageUrl ? [imageUrl] : 'null',
                        title,
                      )
                    }
                    activeOpacity={0.7}
                    style={[ {alignItems:'center', justifyContent:'center', flex: 1 ,flexDirection:'row',gap:8 ,}]}
            >
                    <IconComponent
                      name="logo-whatsapp"
                      size={22}
                      color={colors.white}
                    />
                    <Text 
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.shareButtonText}>Share To Earn</Text>
                  </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
            </View>

            {/* Applicable Offers */}
            <View style={styles.sectionCard}>
              <Text allowFontScaling={false}
              numberOfLines={1}
               style={styles.sectionTitle}>Applicable Offers</Text>
              {product.offerDescription &&
              Array.isArray(product.offerDescription) &&
              product.offerDescription.length > 0 ? (
                product.offerDescription.map((offer, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.checkmarkWrapper}>
                      <IconComponent
                        name="checkmark-circle"
                        size={20}
                        color={colors.colorPrimary}
                      />
                    </View>
                    <Text allowFontScaling={false}
              numberOfLines={1} style={styles.listText}>{String(offer)}</Text>
                  </View>
                ))
              ) : (
                <Text allowFontScaling={false}
                numberOfLines={1} style={styles.emptyText}>No offers available.</Text>
              )}
            </View>

            {/* Product Description */}
            <View style={styles.sectionCard}>
              <Text allowFontScaling={false}
              numberOfLines={1} style={styles.sectionTitle}>Product Description</Text>
              {product.productDescription &&
              Array.isArray(product.productDescription) &&
              product.productDescription.length > 0 ? (
                product.productDescription.map((desc, index) => (
                  <View key={index} style={styles.descriptionItem}>
                    <View style={styles.bulletWrapper}>
                      <View style={styles.bullet} />
                    </View>
                    <Text allowFontScaling={false}
              numberOfLines={1} style={styles.descriptionText}>{String(desc)}</Text>
                  </View>
                ))
              ) : (
                <Text allowFontScaling={false}
                numberOfLines={1} style={styles.emptyText}>No description available.</Text>
              )}
              <View style={styles.noteContainer}>
                <IconComponent
                  name="information-circle"
                  size={20}
                  color={colors.colorPrimary}
                  style={styles.noteIcon}
                />
                <View style={{flex: 1}}>
                  <Text allowFontScaling={false}
              numberOfLines={1} style={styles.noteLabel}>Note</Text>
                  <Text allowFontScaling={false} style={styles.noteText}>
                    Earnings may differ for New User and Old User purchases. The
                    value shown is tentative and can change with type of Purchase.
                  </Text>
                </View>
              </View>
            </View>

            {/* Terms and Conditions (for non-extra-wide screens) */}
            {!isExtraWideScreen && (
              <View style={styles.sectionCard}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={showTermsAdConditions}>
                  <View style={styles.termsHeader}>
                    <Text allowFontScaling={false}
              numberOfLines={1}  style={styles.termsTitle}>Terms And Conditions</Text>
                    <IconComponent
                      size={23}
                      name={termsConditions ? 'chevron-down' : 'chevron-up'}
                      color={colors.colorPrimary}
                    />
                  </View>
                </TouchableOpacity>
                {termsConditions && (
                  <View style={styles.termsContent}>
                    <ScrollView 
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      {TermsAndConditions.map((list, index) => (
                        <View key={index} style={styles.termsSection}>
                          <Text style={styles.termsHeading}>{list.heading}</Text>
                          {list.description.map((paragraph, paragraphIndex) => (
                            <Text
                              key={paragraphIndex}
                              style={styles.termsDescription}>
                              {paragraph}
                            </Text>
                          ))}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Sidebar for Extra Wide Screens */}
          {isExtraWideScreen && (
            <View style={styles.sidebar}>
              <Image
                style={styles.advertisementImage}
                source={require('../src/assets/demo_ad.png')}
              />
              <View style={styles.sectionCard}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={showTermsAdConditions}>
                  <View style={styles.termsHeader}>
                    <Text allowFontScaling={false}
              numberOfLines={1} style={styles.termsTitle}>Terms And Conditions</Text>
                    <IconComponent
                      size={23}
                      name={termsConditions ? 'chevron-down' : 'chevron-up'}
                      color={colors.colorPrimary}
                    />
                  </View>
                </TouchableOpacity>
                {termsConditions && (
                  <View style={styles.termsContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {TermsAndConditions.map((list, index) => (
                        <View key={index} style={styles.termsSection}>
                          <Text allowFontScaling={false}
              numberOfLines={1} style={styles.termsHeading}>{list.heading}</Text>
                          {list.description.map((paragraph, paragraphIndex) => (
                            <Text
                            allowFontScaling={false}
                              key={paragraphIndex}
                              style={styles.termsDescription}>
                              {paragraph}
                            </Text>
                          ))}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Share Buttons (Mobile Only) */}
      {!isWideScreen && (
        <View style={styles.bottomButtonContainer}>

<LinearGradient
                   colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                   style={styles.whatsappButton}>
          <TouchableOpacity
            onPress={()=>{
              shareToWhatsApp(message,imageUrl,title)
            }}
            activeOpacity={0.7}
            style={[ {alignItems:'center', justifyContent:'center', flex: 1 ,flexDirection:'row',gap:8 ,}]}
            
            >
            <IconComponent
              name="logo-whatsapp"
              size={22}
              color={colors.white}
            />
            <Text 
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.whatsappButtonText}>Share on WhatsApp</Text>
          </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            onPress={()=>{
              shareLink(title,message,imageUrl)
            }}
            activeOpacity={0.7}
            style={[styles.shareButton,styles.shareOutlineButton,{flex:1}]}>
            <IconComponent
              name="share-social-outline"
              size={24}
              color={colors.colorPrimary}
            />
            <Text style={styles.shareButtonText2}>Share</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.colorPrimary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  contentWrapper: {
    flexDirection: 'row',
  },
  mainContainer: {
    flex: 1,
    maxWidth: 1024,
    width: '100%',
  },
  sidebar: {
    marginLeft: 16,
    width: 350,
  },
  productCard: {
    padding: 8,
    minHeight: 450,
    borderRadius: 12,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }
    })
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor:colors.white,
    flex: 1,
  },
  productInfoContainer: {
    maxWidth: 600,
    width: '100%',
    paddingHorizontal: 8,
    paddingTop:4,
    ...(Platform.OS === 'web' && {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }),
  },
  productName: {
    fontSize: 16,
    color:colors.text,
    textAlign:'justify',
    fontWeight: '600',
    marginBottom: 4,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:8
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  storeLogoContainer: {
    height: 30,
    width: 30,
    borderRadius:15,
    overflow:'hidden'
  },
  storeLogo: {
    height: '100%',
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.colorPrimary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  ratingCount: {
    fontSize: 14,
    color: colors.gray,
  },
  pricingSection: {
    flexDirection: 'row',
    backgroundColor: colors.colorPrimary + '08',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  priceBlock: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  sellingPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  originalPrice: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.colorPrimary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  priceDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.gray + '30',
    marginHorizontal: 16,
  },
  earningsBlock: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 4,
  },
  earningsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.colorPrimary,
  },
  trackingContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  trackingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background || '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  trackingIconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingIcon: {
    height: 28,
    width: 28,
  },
  trackingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
  },
  trackingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  wideScreenShareButton: {
    backgroundColor: colors.colorPrimary,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto', // This pushes it to bottom
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 16,
    paddingLeft: 8,
    fontWeight: '700',
  },
  sectionCard: {
   
    borderRadius: 12,
    backgroundColor: colors.white,
    ...Platform.select({
      android: {
        elevation: 0,
        marginBottom: 4,
        padding: 8,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginBottom: 12,
        padding: 8,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: 12,
        padding: 16,
      }
    })
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    backgroundColor:colors.white,

  },
  listItem: {
    padding:6,
    flexDirection: 'row',
    backgroundColor:colors.white,
    alignItems: 'flex-start',
  },
  checkmarkWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    fontSize: 12,
    color: colors.black,
    flex: 1,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 12,
    color: colors.gray,
    fontStyle: 'italic',
  },
  descriptionItem: {
    flexDirection: 'row',
    marginVertical: 6,
    padding:6,
    alignItems: 'flex-start',
  },
  bulletWrapper: {
    marginRight: 10,
    marginTop: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.colorPrimary,
  },
  descriptionText: {
    fontSize: 12,
    color: colors.black,
    flex: 1,
    lineHeight: 22,
  },
  noteContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.colorPrimary + '08',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.colorPrimary,
    flexDirection: 'row',
  },
  noteIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: colors.black,
    lineHeight: 20,
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    flex: 1,
  },
  termsContent: {
    maxHeight: 500,
    marginTop: 12,
  },
  termsSection: {
    marginBottom: 16,
  },
  termsHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  termsDescription: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    marginBottom: 6,
  },
  advertisementImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  dealsContainer: {
    marginTop: 8,
    marginBottom: 80,
  },
  dealsHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginLeft: 10,
    marginBottom: 12,
  },
  dealsListContent: {
    paddingHorizontal: 10,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    padding:8,
    borderTopColor: colors.lightGray + '40',
    gap: 8,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }
    })
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: colors.colorPrimary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:12,
    paddingVertical: 8,
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
  whatsappButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  shareButton: {
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
   shareOutlineButton: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.colorPrimary,
    },
  shareButtonText2: {
    color: colors.colorPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});