import React, { useEffect, useState } from 'react';
import { 
  Dimensions,
  Image, 
  ImageBackground, 
  Linking, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { colors } from '../src/utils/color';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import IconComponent from '../components/IconComponent';
import {faqs, partnersList } from '../components/TrendingStoresItemData';
import SliderComponent from './Components/SliderComponent';
import LandingHeader from './Components/LandingHeader';
import { useNavigation } from '@react-navigation/native';
import LandingFooter from './Components/LandingFooter';
import { useAuth } from '../navigation/AuthContext';

const Landing = () => {
  const [isWideScreen, setIsWideScreen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.replace('MainTabs');
    }
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    const updateScreenWidth = () => {
      const { width } = Dimensions.get('window');
      setIsWideScreen(width > 1024);
    };

    // Check initial width
    updateScreenWidth();

    // Add event listener for dimension changes
    Dimensions.addEventListener('change', updateScreenWidth);

    // Cleanup listener
    return () => {
      Dimensions.removeEventListener('change', updateScreenWidth);
    };
  }, []);

  const features = [
    {
      id: 1,
      iconname: 'pricetag',
      family: 'ionicons',
      title: '1. Find Deals',
      description: 'Browse and find exciting deals from various retailers.'
    },
    {
      id: 2,
      iconname: 'link',
      family: 'ionicons',
      title: '2. Convert Into Earning Links',
      description: 'Convert normal retailer links into ExtraPe Earning links using our converter tool.'
    },
    {
      id: 3,
      iconname: 'rupee-sign',
      family: 'fontawesome',
      title: '3. Share & Earn',
      description: 'Share deals on WhatsApp, Facebook, Telegram etc and earn money online easily.'
    }
  ];
  
  const youtubeVideoId = 'dQw4w9WgXcQ';

  const openYouTubeLink = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
    Linking.openURL(youtubeUrl).catch(err => console.error('Failed to open YouTube link', err));
  };

  const youtubeThumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

  const [openFAQId, setOpenFAQId] = useState(null);

  const toggleFAQDescription = (id) => {
    setOpenFAQId(openFAQId === id ? null : id);
  };
  return (
    <ScrollView >
      <View>
        {/* Header */}
        <LandingHeader />
       
       
        

        {/* Top Background Image */}
        <View style={{width:'100%'}}>
          <Image
            style={styles.backgroundTopImage}
            source={require('../src/assets/backgroundTop.png')}
          />
          { isWideScreen && <View style={{
            position:'absolute'
          }}>
          <Text style={{
            fontSize: 50,
            fontWeight: '700',
            textAlign: 'centre',
            color:colors.white,
            margin: 50,
            maxWidth:600,
          }}>
            Join ExtraPe
            Affiliate Marketing
            platform & Earn Upto Rs. 50,000+ Every Month!
          </Text>
        </View>}
        </View>

        {/* Main Headline */}
       { !isWideScreen && <View >
          <Text style={{
            fontSize: 50,
            fontWeight: '700',
            textAlign: 'centre',
            margin: 50,
            maxWidth:800,
          }}>
            Join Marcadeo
            Affiliate Marketing
            platform & Earn Upto Rs. 50,000+ Every Month!
          </Text>
        </View>}

        {/* How It Works Section */}
        <View style={styles.howItWorksContainer}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            padding: 20,
          }}>
            How it Works?
          </Text>
   
          <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.youtubeContainer}
            onPress={openYouTubeLink}
          >
            <ImageBackground
              source={{uri: youtubeThumbnailUrl}}
              style={styles.youtubeThumbnail}
            >
              <View style={styles.iconContainer}>
                <IconComponent
                  name='play'
                  size={28}
                  color={colors.white}
                />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Earnings Section */}
        <View style={styles.amountContainer}>
          <Text style={{
            fontSize: 30,
            fontWeight: '600',
            textAlign: 'justify',
            margin: 25,
          }}>
            How much can you earn in a month
          </Text>
          <View style={[styles.sliderContainer, defaultStyleSheet.shadowProvider]}>
            <Text style={{width:isWideScreen? 1024 : '100%', 
  textAlign:'center',
  borderBottomWidth:2,
  borderStyle:'dashed',
  padding:10,
  fontSize:18,
  marginVertical:8,
  marginHorizontal:4

            }}>Choose no of orders</Text>

            
            <SliderComponent amount={75}/>
            <SliderComponent amount={35}/>
            <SliderComponent amount={60}/>
            <SliderComponent amount={55}/>
            <SliderComponent amount={82}/>

            <View style={styles.totalAmountcontainer}>
              <Text style={{fontSize: 20, fontWeight: '500'}}>Amount : 40000</Text>
            </View>
          </View>
        </View>

        {/* How to Earn Section */}
        <View style={styles.howToEarnContainer}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            padding: 20,
          }}>
            How to earn?
          </Text>

          <View style={[
          styles.featuresContainer, 
          { 
            flexDirection: isWideScreen ? 'row' : 'column',
            flexWrap: isWideScreen ? 'wrap' : 'nowrap',
            justifyContent: isWideScreen ? 'center' : 'center'
          }
        ]}>
            {features.map((feature) => (
              <View key={feature.id} style={styles.howToEarnContent}>
                <View style={{
                  borderRadius: 50,
                  padding: 10,
                  backgroundColor: colors.colorPrimary,
                }}>
                  <IconComponent
                    name={feature.iconname}
                    size={46}
                    color={colors.white}
                    family={feature.family}
                  />
                </View>

                <Text style={styles.howToearnText}>{feature.title}</Text>
                <Text style={styles.howToearnText}>{feature.description}</Text>
              </View>
            ))}
          </View>

          {/* Partners Section */}
          <View style={styles.partnerContainer}>
            <Text style={{fontSize: 22, fontWeight: '600', padding: 10}}>
              Our Partners
            </Text>

            <View style={{
              margin: 10,
              flexDirection: 'row'
            }}>
              {partnersList.map((list) => (
                <View key={list.id} style={{margin: 10}}>
                  <Image 
                    style={{height: 60, width: 120, resizeMode: 'contain'}}
                    source={list.image}
                    resizeMethod='resize'
                  />
                </View>
              ))}
            </View>

            <Text style={{
              fontSize: 18, 
              fontWeight: '600', 
              padding: 10, 
              color: colors.gray
            }}>
              500+ more
            </Text>
          </View>

          {/* FAQ Section */}
<View style={styles.faqContainer}>
  <Text style={{ fontSize: 32, fontWeight: '700', textAlign: 'center' }}>
    FAQ
  </Text>

  {faqs.map((list, index) => (
    <View 
      key={list.id ||index }
      style={{
        borderBottomColor: colors.black,
        borderBottomWidth: 1.5
      }}
    > 
      <TouchableOpacity 
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          width: '100%', 
          alignItems: 'center',
          padding: 5
        }}
        onPress={() => toggleFAQDescription(index)}
      >
        <Text style={{
          fontSize: 18, 
          fontWeight: '400', 
          margin: 10,
          flex: 1
        }}>
          {list.question}
        </Text>
        <IconComponent 
          name={openFAQId === index ? 'chevron-up' : 'chevron-down'}
          size={28}
        />
      </TouchableOpacity>
      
      {openFAQId === index && (
        <Text style={{
          fontSize: 18, 
          fontWeight: '200', 
          margin: 10, 
          flex: 1
        }}>
          {list.answer}
        </Text>
      )}
    </View>
  ))}
</View>
            

           
         


        </View>
        <LandingFooter />
      </View>
    </ScrollView>
  );
};

export default Landing;

const styles = StyleSheet.create({
 
 
 
  backgroundTopImage: {
    aspectRatio:9/3,
    resizeMode: 'cover',
  },
  howItWorksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    padding: 20,
    borderTopLeftRadius:'-50%',
    backgroundColor:colors.colorPrimaryLite,
  },
  youtubeContainer: {
    width: 500,
    maxWidth: 900,
    maxHeight: 400,
    minHeight: 250,
    backgroundColor: colors.lightRed,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
    overflow: 'hidden',
  },
  youtubeThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  amountContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  sliderContainer: {
    borderRadius:12,
    padding: 10,
    margin:10,
  },
  totalAmountcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: colors.lightGreen,
    alignSelf: 'center',
    padding: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  howToEarnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  howToEarnContent: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    maxWidth: 450,
  },
  howToearnText: {
    fontSize: 18,
    margin: 8,
    textAlign: 'center',
  },
  partnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  faqContainer: {
    padding: 10,
    margin: 50,
    width:'100%',
    maxWidth:1600,
  }
});