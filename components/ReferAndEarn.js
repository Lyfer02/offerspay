import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../navigation/AuthContext';
import IconComponent from './IconComponent';
import { colors } from '../src/utils/color';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import { ErrorModalService } from '../src/utils/modalService';
import { referService } from '../api/services/refer.service';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { isWeb, useResponsive } from '../src/utils/dimension';
import { shareLink, shareToWhatsApp } from '../src/utils/commonFunctions_one';
import LinearGradient from 'react-native-linear-gradient';

const ReferAndEarn = () => {
  const navigation = useNavigation();
  const { user, isLoggedIn, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [referralData, setReferralData] = useState({
    image: null,
    referralCode: '',
    referralEarning: 0,
  });

  const {isDesktop}=useResponsive();
  /* ------------------------------------------------- */
  /*  JWT-expired handler                               */
  /* ------------------------------------------------- */
  const handleJwtExpired = useCallback(async () => {
    await logout();
    ErrorModalService.error('Your session has expired. Please log in again.');
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 1500);
  }, [logout, navigation]);

  /* ------------------------------------------------- */
  /*  Fetch Referral Data                               */
  /* ------------------------------------------------- */
  const fetchReferralData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (!isLoggedIn || !user?.id) {
        ErrorModalService.error('Please login to view referral details');
        navigation.navigate('Login');
        return;
      }

      // Replace with your actual API call
      const response = await referService.refer();
      
      if (response.data?.success) {
        setReferralData({
          image: response.data.data.image,
          referralCode: response.data.data.referralCode,
          referralEarning: response.data.data.referralEarning,
        });
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg?.toLowerCase() === 'jwt expired') {
        await handleJwtExpired();
        return;
      }
      ErrorModalService.error(msg || 'Failed to fetch referral data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [handleJwtExpired, isLoggedIn, navigation, user?.id]);

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  /* ------------------------------------------------- */
  /*  Copy referral code to clipboard                   */
  /* ------------------------------------------------- */
  const copyToClipboard = () => {
    if (!referralData.referralCode) {
      ErrorModalService.error('Referral code not available');
      return;
    }
    Clipboard.setString(referralData.referralCode);
    ErrorModalService.success('Referral code copied to clipboard')
   
  };

  /* ------------------------------------------------- */
  /*  Share referral code                               */
  /* ------------------------------------------------- */
  const shareReferralCode = async () => {
    if (!referralData.referralCode) {
      ErrorModalService.error('Referral code not available');
      return;
    }

    try {
      await Share.share({
        message: `Join me on OffersPay and start earning! Use my referral code: ${referralData.referralCode}\n\nDownload now: https://https://unfileredgadgets.com/`,
      });
    } catch (error) {
     // console.log('Error sharing: ', error.message);
    }
  };

  /* ------------------------------------------------- */
  /*  Share to WhatsApp                                 */
  /* ------------------------------------------------- */
  const title= "Shareing your data in whatsapp"
  const shareMessage = `🎉 Join me on OffersPay and start earning! Use my referral code: ${referralData.referralCode}\n\nDownload now: https://https://unfileredgadgets.com/`;
   const imageUrl = referralData.image
  // const shareToWhatsApp = async () => {
  //   // if (!referralData.referralCode) {
  //   //   ErrorModalService.error('Referral code not available');
  //   //   return;
  //   // }

  //   const message = `🎉 Join me on ScanKiya and start earning!\n\n✨ Use my referral code: *${referralData.referralCode}*\n\n💰 Earn up to 10% of your referrals' income!\n\n👉 Download now: https://www.scankiya.com`;
  //   const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

  //   try {
  //     await Linking.openURL(url);
  //   } catch (error) {
  //   //  console.log('Error opening WhatsApp: ', error.message);
  //     ErrorModalService.error('WhatsApp is not installed on your device');
  //   }
  // };

  /* ------------------------------------------------- */
  /*  Loading State                                     */
  /* ------------------------------------------------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.colorPrimary} />
          <Text style={styles.loadingText}>Loading referral details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ------------------------------------------------- */
  /*  Main Render                                       */
  /* ------------------------------------------------- */
  return (
    <SafeAreaProvider>
    <SafeAreaView style={{flex:1,backgroundColor:colors.white}}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchReferralData(true)}
            colors={[colors.colorPrimary]}
            tintColor={colors.colorPrimary}
          />
        }>
        {/* Header Image */}
        <View style={[styles.referImgContainer,{height:isDesktop? 350 : 220}]}>
          <Image
            source={
              referralData.image
                ? { uri: referralData.image }
                : require('../src/assets/refer_and_earn.jpg')
            }
            style={styles.referImg}
            resizeMethod='resize'
            resizeMode='cover'
          />
          <View style={styles.imageOverlay}>
            <Text allowFontScaling={false}
            numberOfLines={1} style={styles.overlayTitle}>Refer & Earn</Text>
            <Text allowFontScaling={false}
            numberOfLines={1} style={styles.overlaySubtitle}>
              Share your code and earn rewards
            </Text>
          </View>
        </View>

        

        {/* Referral Code Card */}
        
        <LinearGradient
                                    colors={[colors.white, colors.colorLight]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[styles.referralCodeCard,{width : isDesktop ? '70%' : '' },defaultStyleSheet.shadowProvider]}>
          <View style={styles.cardHeader}>
            <IconComponent
              name="gift-outline"
              size={24}
              color={colors.colorPrimary}
            />
            <Text allowFontScaling={false}
            numberOfLines={1} style={styles.cardHeaderText}>Your Referral Code</Text>
          </View>

          <View style={styles.codeContainer}>
            <View style={styles.codeBox}>
              <Text 
              allowFontScaling={true}
              style={styles.codeLabel}>CODE : </Text>
              <Text 
              allowFontScaling={true}
              style={styles.codeText}>
                 {referralData.referralCode || 'N/A'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.copyButton}>
              <IconComponent
                name="copy-outline"
                size={22}
                color={colors.colorPrimary}
              />
            </TouchableOpacity>
          </View>

          <Text 
          allowFontScaling={false}
          style={styles.shareInstructions}>
            Share this code with your friends to start earning!
          </Text>

          {/* Share Buttons */}
          <View style={styles.shareButtonsContainer}>
            <TouchableOpacity
            activeOpacity={0.9}
            style={{flex:1}}
              onPress={() => shareToWhatsApp(
                                shareMessage,
                                imageUrl ? [imageUrl] : null,
                                title
                              )}
             >
                  <LinearGradient
                                   colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                                    style={[
                                      defaultStyleSheet.whatsappButton,
                                      { 
                                        paddingVertical: 10,
                                        paddingHorizontal: 14,
                                      }
                                    ]}>

              <IconComponent
                name="logo-whatsapp"
                size={24}
                color={colors.white}
              />
              <Text allowFontScaling={false}
            numberOfLines={1}  style={styles.whatsappBtnText}>Share on </Text>

              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
            activeOpacity={0.9}
              onPress={() => shareLink(
                                title,
                                shareMessage,
                                imageUrl ? [imageUrl] : null
                              )}
              style={[styles.shareBtn, defaultStyleSheet.shadowProvider]}>
              <IconComponent
                name="share-social-outline"
                size={24}
                color={colors.colorPrimary}
              />
              <Text allowFontScaling={false}
            numberOfLines={1} style={styles.shareBtnText}>More Options</Text>
            </TouchableOpacity>
          </View>

          </LinearGradient>
        

        {/* Earnings Card */}
        <View style={[styles.earningsCard, defaultStyleSheet.shadowProvider]}>
          <View style={styles.earningsHeader}>
            <View style={styles.earningsIconContainer}>
              <IconComponent
                name="wallet-outline"
                size={32}
                color={colors.colorPrimary}
              />
            </View>
            <View style={styles.earningsContent}>
              <Text  
              allowFontScaling={false}
              style={styles.earningsLabel}>Total Referral Earnings</Text>
              <View style={styles.earningsAmountContainer}>
                <Image
                  style={styles.rupeesIcon}
                  source={require('../src/assets/rupee_icon.png')}
                />
                <Text 
                allowFontScaling={false}
                style={styles.earningsAmount}>
                  {referralData.referralEarning.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.seeMoreBtn}>
            <Text style={styles.seeMoreText}>View Earnings History</Text>
            <IconComponent
              name="arrow-forward"
              size={16}
              color={colors.colorPrimary}
            />
          </TouchableOpacity> */}
        </View>

        {/* How It Works */}
        <View style={[styles.howItWorksCard]}>
          <View style={styles.sectionHeader}>
            <IconComponent
              name="information-circle-outline"
              size={22}
              color={colors.colorPrimary}
            />
            <Text allowFontScaling={false}
            numberOfLines={1} style={styles.sectionTitle}>How It Works</Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                <Image
                  style={styles.stepIcon}
                  source={require('../src/assets/link.png')}
                />
              </View>
              <View style={styles.stepContent}>
                <Text allowFontScaling={false}
            numberOfLines={1} style={styles.stepTitle}>1. Share Your Code</Text>
                <Text  allowFontScaling={false}
             style={styles.stepDescription}>
                  Invite friends to join using your unique referral code
                </Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                <Image
                  style={styles.stepIcon}
                  source={require('../src/assets/link.png')}
                />
              </View>
              <View  style={styles.stepContent}>
                <Text allowFontScaling={false}
            numberOfLines={1} style={styles.stepTitle}>2. They Sign Up & Earn</Text>
                <Text style={styles.stepDescription} 
                allowFontScaling={false}
                >
                  Your friends register and start earning through the app
                </Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                <Image
                  style={styles.stepIcon}
                  source={require('../src/assets/rupee_refer.png')}
                />
              </View>
              <View style={styles.stepContent}>
                <Text allowFontScaling={false}
            numberOfLines={1} style={styles.stepTitle}>3. You Earn Together</Text>
                <Text allowFontScaling={false}
             style={styles.stepDescription}>
                  Receive up to 10% of your referrals' earnings automatically
                </Text>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity style={styles.termsLink}>
            <Text style={styles.termsText}>View Terms & Conditions</Text>
            <IconComponent
              name="chevron-forward"
              size={16}
              color={colors.colorPrimary}
            />
          </TouchableOpacity> */}
        </View>

        {/* Whom to Refer */}
        {!isDesktop && (<View style={[styles.whomToReferCard]}>
          <View style={styles.sectionHeader}>
            <IconComponent
              name="people-outline"
              size={22}
              color={colors.colorPrimary}
            />
            <Text allowFontScaling={false}
            numberOfLines={1}  style={styles.sectionTitle}>Whom to Refer?</Text>
          </View>

          <View style={styles.referTargetContainer}>
            <Image
              style={styles.referTargetIcon}
              source={require('../src/assets/link.png')}
            />
            <Text allowFontScaling={false}
            numberOfLines={1} style={styles.referTargetTitle}>
              Refer Across Your Network
            </Text>
            <Text allowFontScaling={false}
             style={styles.referTargetDescription}>
              Share with friends, family, colleagues, and social media followers.
              The more you share, the more you earn!
            </Text>
          </View>

          <View style={styles.benefitsContainer}>
            <Text allowFontScaling={false}
            numberOfLines={1}  style={styles.benefitsTitle}>Benefits:</Text>
            <View style={styles.benefitItem}>
              <IconComponent
                name="checkmark-circle"
                size={18}
                color={colors.colorPrimary}
              />
              <Text allowFontScaling={false}
            style={styles.benefitText}>Unlimited referrals</Text>
            </View>
            <View style={styles.benefitItem}>
              <IconComponent
                name="checkmark-circle"
                size={18}
                color={colors.colorPrimary}
              />
              <Text allowFontScaling={false}
            style={styles.benefitText}>Lifetime earnings</Text>
            </View>
            <View style={styles.benefitItem}>
              <IconComponent
                name="checkmark-circle"
                size={18}
                color={colors.colorPrimary}
              />
              <Text allowFontScaling={false}
             style={styles.benefitText}>Instant tracking</Text>
            </View>
          </View>
        </View>)}

        {/* Bottom Spacing */}
        {/* <View style={styles.bottomSpacing} /> */}
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ReferAndEarn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
  },

  /* Header Image */
  referImgContainer: {
    overflow: 'hidden',
    backgroundColor: colors.lightGreen,
    position: 'relative',
  },
  referImg: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  overlaySubtitle: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },

  /* Earnings Card */
  earningsCard: {
    backgroundColor: colors.white,
    margin: 8,
    marginVertical: 12,
    padding: 8,
    borderRadius: 8,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 28,
    backgroundColor: 'rgba(25,118,210,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  earningsContent: {
    flex: 1,
  },
  earningsLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  earningsAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeesIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.colorPrimary,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  seeMoreText: {
    fontSize: 14,
    color: colors.colorPrimary,
    fontWeight: '600',
    marginRight: 4,
  },

  /* Referral Code Card */
  referralCodeCard: {
    backgroundColor: colors.white,
    justifyContent:'center',
    alignContent:'center',
    padding: 20,
    borderRadius:8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginLeft: 4,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeBox: {
    flex: 1,
    flexDirection:'row',
    gap:2,
    alignContent:'center',
    alignItems:'center',
    textAlignVertical:'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal:10,
    paddingVertical :10,
        marginRight: 12,
  },
  codeLabel: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: 'bold',
  },
  codeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.colorPrimary,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 28,
    borderColor:colors.colorPrimary,
    borderWidth:1.5,
    backgroundColor: 'rgba(25,118,210,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareInstructions: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  shareButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorPrimary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  whatsappBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    gap: 8,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.colorPrimary,
  },

  /* How It Works */
  howItWorksCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginLeft: 4,
  },
  stepsContainer: {
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(25,118,210,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 28,
    height: 28,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: colors.gray,
  },
  stepDivider: {
    height: 20,
    width: 2,
    backgroundColor: '#E0E0E0',
    marginLeft: 23,
    marginVertical: 8,
  },
  termsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  termsText: {
    fontSize: 14,
    color: colors.colorPrimary,
    fontWeight: '600',
    marginRight: 4,
  },

  /* Whom to Refer */
  whomToReferCard: {
    backgroundColor: colors.white,
    marginBottom: 12,
    padding: 20,
    borderRadius: 16,
  },
  referTargetContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  referTargetIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  referTargetTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  referTargetDescription: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  benefitsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: colors.black,
    marginLeft: 8,
  },

  bottomSpacing: {
    height: 20,
  },
});