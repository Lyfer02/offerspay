import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../src/utils/color';
import { useNavigation } from '@react-navigation/native';
import ProfileItem from '../../components/ProfileItem';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';// Optional: for gradient background
import { useAuth } from '../../navigation/AuthContext';
import { ErrorModalService } from '../../src/utils/modalService';
import { color } from '@rneui/base';
import LinearGradient from 'react-native-linear-gradient';
import IconComponent from '../../components/IconComponent';

const ProfileTab = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const goToMyEarning = () => {
    navigation.navigate('MyEarnings');
  };

  const goToAllContests = () => {
    navigation.navigate('AllContests');
  };

  const goToFlashDeals = () => {
    navigation.navigate('FlashDeals');
  };

  const goToMostSharedDeals = () => {
    navigation.navigate('MostSharedDeals');
  };

  const goToReferAndEarn = () => {
    navigation.navigate('ReferAndEarn');
  };

  const goToTelegramConfiguration = () => {
    navigation.navigate('TelegramConfiguration');
  };

  const goToTelegramBotPage = () => {
    navigation.navigate('TelegramBotPage');
  };

  const goToMyAccount = () => {
    navigation.navigate('MyAccount');
  };

  const sendEmail = () => {
    const email = 'admin@gmail.com';
    const subject = 'Hello from React Native';
    const body = 'This is a test email from React Native!';

    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(err => {
      console.error('An error occurred', err);
      Alert.alert('Error', 'Unable to send email');
    });
  };

  const callUs = () => {
    const phoneNumber = 'tel:+918787006325';

    Linking.openURL(phoneNumber).catch(err => {
      console.error('An error occurred', err);
      Alert.alert('Error', 'Unable to make the call');
    });
  };

  const openTelegram = async () => {
    const url = 'tg://';

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening Telegram: ', error.message);
      Alert.alert('Telegram Not Found');
    }
  };

  const handleLogout = () => {
    ErrorModalService.warning(
      'Are you sure you want to logout?',
      {
        title: 'Logout',
        showCancel: true,
        confirmText: 'Yes, Logout',
        cancelText: 'Cancel',
        onConfirm: async () => {
          await logout();
        },
      }
    );
  };


  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    <LinearGradient
     colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                 
    style={styles.headerContainer}>
          <View style={styles.profileSection}>
            <View style={[styles.profileImgContainer, defaultStyleSheet.shadowProvider]}>
              {user?.profileImage ? (
                <Image
                  style={styles.profileImage}
                  resizeMode="cover"
                  source={{ uri: user.profileImage }}
                />
              ) : (
                <View style={styles.initialsContainer}>
                  <Text 
                  allowFontScaling={false}
                  style={styles.initialsText}>
                    {getInitials(user?.name || user?.email)}
                  </Text>
                </View>
              )}
            </View>

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
              {user?.phone && (
                <Text 
                allowFontScaling={false}
                style={styles.userPhone} numberOfLines={1}>
                  📱 {user.phone}
                </Text>
              )}
            </View>

              
                {/* <TouchableOpacity 
                activeOpacity={0.9}
                onPress={handleLogout}
                style={
                  {justifyContent:'center',alignItems:'center'}
                }
                >
                <IconComponent 
                    name="logout" 
                    size={24} 
                    color={colors.white} 
                    family="material" 
                  />
                  <Text 
                  allowFontScaling={false}
                  style={styles.logoutBtnText}>
                    Logout
                  </Text>
                </TouchableOpacity> */}
             

          </View>

         {/* // Stats Cards - Optional */}
          {/* <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹0</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Referrals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Deals Shared</Text>
            </View>
          </View>*/}
        </LinearGradient>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.colorPrimary }}>
        
        {/* Enhanced Profile Header */}
 

        {/* Menu Items Container */}
        <View style={styles.profileItemsContainer}>
          <Text
          allowFontScaling={false}
          style={styles.sectionTitle}>Account</Text>
          <ProfileItem
            family="fontawesome"
            iconName="rupee"
            itemName="My Earnings"
            goTo={goToMyEarning}
          />
          <ProfileItem
            family="fontawesome"
            iconName="person"
            itemName="My Account"
            goTo={goToMyAccount}
          />

          <Text 
          allowFontScaling={false}
          style={styles.sectionTitle}>Deals & Offers</Text>
          <ProfileItem
            family="fontawesome"
            iconName="rupee"
            itemName="Flash Deals"
            goTo={goToFlashDeals}
          />
          <ProfileItem
            family="fontawesome"
            iconName="share"
            itemName="Most Shared Deals"
            goTo={goToMostSharedDeals}
          />

          <Text
          allowFontScaling={false}
          style={styles.sectionTitle}>Rewards</Text>
          <ProfileItem
            family="fontawesome"
            iconName="slideshare"
            itemName="Refer & Earn"
            goTo={goToReferAndEarn}
          />

          <Text 
          allowFontScaling={false}
          style={styles.sectionTitle}>Support</Text>
          <ProfileItem
            family="fontawesome"
            iconName="telegram"
            itemName="Join Telegram Channel"
            goTo={openTelegram}
          />
          <ProfileItem
            iconName="call"
            itemName="Call us at 8787006969"
            goTo={callUs}
          />
          <ProfileItem
            family="material"
            iconName="mail"
            itemName="Mail us at admin@gmail.com"
            goTo={() => {
              sendEmail();
            }}
          />

          {/* Logout Button */}
          <LinearGradient
           colors={[colors.colorPrimaryLite, colors.colorPrimary]}
           style={[styles.logoutBtn, defaultStyleSheet.shadowProvider]}
                    
          >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ paddingVertical:12 ,alignItems:'center',justifyContent:'center' }}
            onPress={handleLogout}>
            <Text 
            allowFontScaling={false}
            style={styles.logoutBtnText}>LOGOUT</Text>
          </TouchableOpacity>
          </LinearGradient>
          {/* App Version */}
          {/* <Text
          allowFontScaling={false}
          style={styles.versionText}>Version 1.0.0</Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProfileTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:color.white
  },
  headerContainer: {
    paddingHorizontal: 20,
    // paddingTop: 20,
    paddingVertical: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImgContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  initialsContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.colorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  userInfoContainer: {
    marginStart: 8,
    flex: 1,
  },
  userName: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight:'600',
  },
  userPhone: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  profileItemsContainer: {
    backgroundColor: colors.white,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray,
    marginTop: 16,
    marginHorizontal: 20,
    textTransform: 'uppercase',
  },
  logoutBtn: {
    backgroundColor: colors.red,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 20,
    elevation: 1,
  },
  logoutBtnText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 12,
    padding:8,
  },
});