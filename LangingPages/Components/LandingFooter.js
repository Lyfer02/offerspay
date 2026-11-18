// src/screens/Landing/Components/LandingFooter.js
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../src/utils/color';
import { useNavigation } from '@react-navigation/native';

const LandingFooter = () => {
  const [isWideScreen, setIsWideScreen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const updateScreenWidth = () => {
      const { width } = Dimensions.get('window');
      setIsWideScreen(width > 1024);
    };

    updateScreenWidth();
    const subscription = Dimensions.addEventListener('change', updateScreenWidth);

    return () => subscription?.remove();
  }, []);

  const terms = () => navigation.navigate('Terms');
  const goToAboutUS = () => navigation.navigate('AboutUs');
  const goToPrivacy = () => navigation.navigate('Privacy');

  return (
    <View style={styles.BottomFooterContainer}>
      <View style={{ flexDirection: isWideScreen ? 'row' : 'column' }}>
        {/* Logo Section */}
        <View
          style={[
            styles.BottommLogoContainer,
            {
              borderRightWidth: isWideScreen ? 1 : 0,
              borderColor: colors.gray,
              alignItems: isWideScreen ? 'center' : 'flex-start',
              padding: 10,
              width: isWideScreen ? '25%' : '100%',
            },
          ]}
        >
          <Text style={styles.appName}>App Name</Text>
          <Text style={styles.hashtag}>#BharatKaEarningBuddy</Text>
        </View>

        {/* Company Links */}
        <View style={[styles.BottommLogoContainer, { paddingStart: 20, width: isWideScreen ? '25%' : '100%' }]}>
          <Text style={[styles.Aboutus, { color: colors.gray, fontWeight: 'bold' }]}>Company</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={goToAboutUS}>
            <Text style={styles.Aboutus}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={terms}>
            <Text style={styles.Aboutus}>Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={goToPrivacy}>
            <Text style={styles.Aboutus}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.Aboutus}>Careers</Text>
          <Text style={styles.Aboutus}>Mega Earning Festival</Text>
          <Text style={styles.Aboutus}>Summer Earning Festival</Text>
        </View>

        {/* Follow & Contact */}
        <View style={styles.FooterSecondHalfContainer}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.FollowUsContainer}>
              <Text style={[styles.Aboutus, { color: colors.gray, fontWeight: 'bold' }]}>Follow Us</Text>
              <View style={styles.iconContainer}>
                <Image style={styles.icon} source={require('../../src/assets/icons/instagram.png')} />
                <Image style={styles.icon} source={require('../../src/assets/icons/linkedin.png')} />
                <Image style={styles.icon} source={require('../../src/assets/icons/telegram.png')} />
                <Image style={styles.icon} source={require('../../src/assets/icons/facebook.png')} />
              </View>
            </View>

            <View style={styles.FollowUsContainer}>
              <Text style={[styles.Aboutus, { color: colors.gray, fontWeight: 'bold' }]}>Contact Us</Text>
              <Text style={styles.Aboutus}>Contact us - 083004455</Text>
              <Text style={styles.Aboutus}>Mail us - marcadeo@gmail.com</Text>
            </View>
          </View>

          {/* Download App */}
          <View style={styles.DownloadContainer}>
            <View
              style={{
                borderBottomWidth: isWideScreen ? 1 : 0,
                borderBottomColor: isWideScreen ? colors.gray : null,
                flexDirection: isWideScreen ? 'row' : 'column',
                alignItems: 'center',
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: colors.colorPrimary,
                  fontWeight: '700',
                  marginVertical: 4,
                }}
              >
                Download ExtraPe Now
              </Text>
              <View style={styles.GooglePlayContainer}>
                <Image style={styles.icon} source={require('../../src/assets/icons/google_play.png')} />
                <View style={{ margin: 5 }}>
                  <Text style={{ color: colors.white }}>GET IT ON</Text>
                  <Text style={styles.googlePlay}>Google Play</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LandingFooter;

const styles = StyleSheet.create({
  BottomFooterContainer: {
    width: '100%',
    backgroundColor: colors.white,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  appName: {
    color: colors.colorPrimary,
    fontWeight: 'bold',
    fontSize: 30,
    margin: 5,
  },
  hashtag: {
    fontSize: 16,
    color: colors.gray,
  },
  BottommLogoContainer: {
    marginVertical: 10,
  },
  Aboutus: {
    padding: 4,
    fontSize: 18,
    color: colors.black,
  },
  FooterSecondHalfContainer: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: colors.lightRed,
  },
  FollowUsContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
  iconContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
  },
  icon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    margin: 5,
  },
  DownloadContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    padding: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.white,
  },
  GooglePlayContainer: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 8,
    flexDirection: 'row',
    marginVertical: 4,
    height: 60,
    padding: 4,
  },
  googlePlay: {
    fontSize: 24,
    color: colors.white,
  },
});