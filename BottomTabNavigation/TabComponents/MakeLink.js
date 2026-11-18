// src/screens/MakeLink.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Switch,
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import IconComponent from '../../components/IconComponent';
import AdvancedModeModal from '../../components/AdvancedModeModel';
import SuccessModal from '../../components/SuccessModal';
import AdvancedModeTab from '../../AdvancedMode/AdvancedModeTab';
import { colors } from '../../src/utils/color';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../navigation/AuthContext';
import ErrorModal from '../../components/ErrorModal';
import { trackingService } from '../../api/services/tracking.service';
import { useNavigation } from '@react-navigation/native';
import { ErrorModalService } from '../../src/utils/modalService';
import { isAndroid, isWeb, useResponsive } from '../../src/utils/dimension';
import LinearGradient from 'react-native-linear-gradient';

const MakeLink = () => {
  const navigation = useNavigation();
  const { user, isLoggedIn, logout } = useAuth();
  const [data,setData]=useState({
    link:'',
    name:'',
    logo:''
  })
  const {isDesktop}=useResponsive();
  const [isEnabled, setIsEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const [txtLink, setTxtLink] = useState('');
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [isMakingLink, setIsMakingLink] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const youtubeVideoId = 'dQw4w9WgXcQ';

  /* ------------------------------------------------- */
  /*  JWT-expired handler                               */
  /* ------------------------------------------------- */
  const handleJwtExpired = async () => {
    await logout();
    ErrorModalService.error('Your session has expired. Please log in again.');
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 1500);
  };
  /* ------------------------------------------------- */
  /*  Responsive layout                                 */
  /* ------------------------------------------------- */
  useEffect(() => {
    const update = () => {
      const { width } = Dimensions.get('window');
      setIsWideScreen(width > 768);
    };
    update();
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  /* ------------------------------------------------- */
  /*  UI helpers                                        */
  /* ------------------------------------------------- */
  const toggleSwitch = () => {
    if (!isEnabled) setShowModal(true);
    else setIsEnabled(false);
  };

  const handleModalSwitch = (enable) => setIsEnabled(enable);

  /* ------------------------------------------------- */
  /*  Generate link (MAIN FIX)                          */
  /* ------------------------------------------------- */
  const handleMakeLink = async () => {
    if (!txtLink.trim()) {
      ErrorModalService.error('Please enter a link');
      return;
    }

    setIsMakingLink(true);
    try {
      if (!isLoggedIn || !user?.id) {
        ErrorModalService.error('Please login to generate links');
        return;
      }

      const formData = { userID: user.id, link: txtLink.trim() };
      const response = await trackingService.generateLink(formData);
      const res = response.data?.data;

      if (!res) throw new Error('No tracking URL');

      setData({
        link : res.short_url,
        logo: res.logo,
        name : res.name
      });

      // setGeneratedLink(newLink);
      setTxtLink('');

      // SHOW SUCCESS MODAL
      setShowSuccessModal(true);
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg?.toLowerCase() === 'jwt expired') {
        await handleJwtExpired();
        return;
      }
      ErrorModalService.error(msg|| error?.message || 'Failed to generate link');
      console.log("This is error ", error?.message );
      
    } finally {
      setIsMakingLink(false);
    }
  };

  /* ------------------------------------------------- */
  /*  YouTube tutorial                                  */
  /* ------------------------------------------------- */
  const openYouTube = () => {
    Linking.openURL(`https://www.youtube.com/watch?v=${youtubeVideoId}`).catch(
      console.error
    );
  };
  const youtubeThumb = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

  //console.log("this is generated url ",generatedLink);
  
  /* ------------------------------------------------- */
  /*  Render                                            */
  /* ------------------------------------------------- */
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      {/* Header Card */}
      {!isWeb &&(
         <LinearGradient
                      colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                      style={styles.gradientHeader}
                    >
        <View style={[styles.headerCard, isWideScreen && styles.headerCardWide]}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <IconComponent
              name={isEnabled ? 'flash' : 'link-outline'}
              size={24}
              color={colors.colorPrimary}
            />
          </View>
          <View>
            <Text 
                  allowFontScaling={false} style={styles.headerTitle}>
              {isEnabled ? 'Advanced Mode' : 'Standard Mode'}
            </Text>
            <Text 
                  allowFontScaling={false} style={styles.headerSubtitle}>
              {isEnabled ? 'Access advanced features' : 'Simple link creation'}
            </Text>
          </View>
        </View>
        <Switch
          trackColor={{ false: '#E0E0E0', true: colors.colorPrimary }}
          thumbColor={isEnabled ? colors.white : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      </LinearGradient>
    )}

      {/* Modals */}
      <AdvancedModeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSwitch={handleModalSwitch}
      
      />

      {/* ---- SUCCESS MODAL (link is now guaranteed) ---- */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        data={data}           
      />
      {/* Standard Mode UI */}
      {!isEnabled && isAndroid && (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isWideScreen && styles.scrollContentWide,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.mainCard, isWideScreen && styles.mainCardWide]}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.titleIcon}>
                <IconComponent
                  name="create-outline"
                  size={28}
                  color={colors.colorPrimary}
                />
              </View>
              <Text 
                  allowFontScaling={false} 
              
              style={styles.cardTitle}>Create Your Earning Link</Text>
              <Text 
                  allowFontScaling={false} style={styles.cardDesc}>
                Paste a product link from our listed stores and convert it
                into a ready-to-share earning link.
              </Text>
            </View>

            {/* Input */}
            <View style={styles.inputSection}>
              <View
                style={[styles.inputWrap, txtLink && styles.inputWrapActive]}
              >
                <IconComponent
                  name={txtLink ? 'checkmark-circle' : 'link'}
                  size={24}
                  color={txtLink ? colors.colorPrimary : colors.gray}
                />
                <TextInput
                  style={styles.textInput}
                  allowFontScaling={false}
                  placeholder="Paste your product link here..."
                  placeholderTextColor={colors.gray}
                  value={txtLink}
                  onChangeText={setTxtLink}
                  multiline={Platform.OS === 'web'}
                  numberOfLines={Platform.OS === 'web' ? 2 : 1}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {txtLink ? (
                  <TouchableOpacity
                    onPress={() => setTxtLink('')}
                    hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                  >
                    <IconComponent
                      name="close-circle"
                      size={20}
                      color={colors.gray}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              {txtLink ? (
                <Text 
                  allowFontScaling={false} style={styles.charCount}>
                  {txtLink.length} characters
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.makeBtn,
                  (!txtLink || isMakingLink) && styles.makeBtnDisabled,
                ]}
                onPress={handleMakeLink}
                disabled={!txtLink || isMakingLink}
              >
                {isMakingLink ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <IconComponent
                      name="link"
                      size={20}
                      color={txtLink ? colors.white : colors.gray}
                    />
                    <Text 
                  allowFontScaling={false}
                      style={[
                        styles.makeBtnText,
                        !txtLink && styles.makeBtnTextDisabled,
                      ]}
                    >
                      Generate Earning Link
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Features */}
            <View style={styles.features}>
              <Text 
                  allowFontScaling={false} style={styles.featuresTitle}>Features:</Text>
              {[
                { icon: 'checkmark-circle', text: 'Instant link conversion' },
                { icon: 'cash-outline', text: 'Track your earnings' },
                { icon: 'shield-checkmark', text: 'Secure & reliable' },
              ].map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <IconComponent
                    name={f.icon}
                    size={18}
                    color={colors.colorPrimary}
                  />
                  <Text 
                  allowFontScaling={false} style={styles.featureText}>{f.text}</Text>
                </View>
              ))}
            </View>

            {/* Tutorial Video */}
            {/* <View style={styles.videoSection}>
              <View style={styles.videoHeader}>
                <IconComponent
                  name="play-circle-outline"
                  size={24}
                  color={colors.colorPrimary}
                />
                <Text 
                  allowFontScaling={false} style={styles.videoTitle}>How to Create Links</Text>
              </View>
              <TouchableOpacity style={styles.videoThumb} onPress={openYouTube}>
                <ImageBackground
                  source={{ uri: youtubeThumb }}
                  style={styles.thumbImg}
                  imageStyle={styles.thumbRadius}
                >
                  <View style={styles.thumbOverlay}>
                    <View style={styles.playIcon}>
                      <IconComponent
                        name="play"
                        size={32}
                        color={colors.white}
                      />
                    </View>
                    <View style={styles.badge}>
                      <IconComponent
                        name="logo-youtube"
                        size={16}
                        color={colors.white}
                      />
                      <Text 
                  allowFontScaling={false} style={styles.badgeText}>Watch Tutorial</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View> */}
          </View>
        </ScrollView>
      )}

      {/* Advanced Mode */}
      {isEnabled && <AdvancedModeTab />}
      {isDesktop && <AdvancedModeTab />}
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MakeLink;

/* ---------- Styles (unchanged) ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    }),
  },
  headerCardWide: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(25,118,210,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: { fontSize: 14, fontWeight: '700', color: colors.black, marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: colors.gray },

  scrollContent: { padding: 16, flexGrow: 1 },
  scrollContentWide: { alignItems: 'center' },

  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 0 },
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    }),
  },
  mainCardWide: { maxWidth: 800 },

  cardHeader: { alignItems: 'center', marginBottom: 32 },
  titleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(25,118,210,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.black, textAlign: 'center', marginBottom: 8 },
  cardDesc: { fontSize: 12, color: colors.gray, textAlign: 'center', paddingHorizontal: 16 },

  inputSection: { marginBottom: 32 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'web' ? 12 : 14,
  },
  inputWrapActive: {
    borderColor: colors.colorPrimary,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: { shadowColor: colors.colorPrimary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 2 },
      web: { boxShadow: `0 2px 8px ${colors.colorPrimary}20` },
    }),
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    minHeight: Platform.OS === 'web' ? 40 : undefined,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
  },
  charCount: { fontSize: 12, color: colors.gray, textAlign: 'right', marginTop: 8, marginRight: 4 },

  makeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    gap: 10,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'background-color 0.2s' },
      ios: { shadowColor: colors.colorPrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  makeBtnDisabled: {
    backgroundColor: '#E0E0E0',
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
      web: { boxShadow: 'none' },
    }),
  },
  makeBtnText: { fontSize: 14, fontWeight: '700', color: colors.white },
  makeBtnTextDisabled: { color: colors.gray },

  features: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16, marginBottom: 24 },
  featuresTitle: { fontSize: 14, fontWeight: '700', color: colors.black, marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureText: { fontSize: 12, color: colors.black },

  videoSection: { marginTop: 8 },
  videoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  videoTitle: { fontSize: 16, fontWeight: '700', color: colors.black },
  videoThumb: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  thumbRadius: { borderRadius: 16 },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: { color: colors.white, fontSize: 13, fontWeight: '600' },
});