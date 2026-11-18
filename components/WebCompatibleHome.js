import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef, useEffect, useContext} from 'react';
import {colors} from '../src/utils/color';
import IconComponent from './IconComponent';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import ConfirmationDialog from './ConfirmationDialog';
import {useNavigation} from '@react-navigation/native';
import LandingFooter from '../LangingPages/Components/LandingFooter';
import RenderStack from './RenderStack';
import SearchBar from './SearchBar';
import SidePanelComponent from './SidePanelComponent';
import AuthContext from '../navigation/AuthContext';
import { storeService } from '../api/services/stores.service';
// SearchBar component with dropdown functionality

const WebCompatibleHome = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('Home');
    const [storeData, setStoreData] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const { logout} = useContext(AuthContext);
  const handleSearch = text => {
    setSearchText(text);
  };


  const fetchAndProcessStores = async (page = 1, searchQuery = '') => {
      try {
        const res = await storeService.list(page, { search: searchQuery });
       // console.log("this is res", res);
  
        const fetchedData = res.data?.data.storeData || [];
  
        if (fetchedData.length === 0 && page > 1) {
          return fetchAndProcessStores(page - 1, searchQuery); // Recursively call with previous page
        }
  
        const mappedData = fetchedData.map((item, index) => ({
          _id: item._id,
          id: ((res.data.data.currentPage - 1) * 10) + index + 1,
          name: item.name,
          image: { uri: item.image },
          earn: item.earn ? `₹${item.earn}` : '₹0',
          about: item.about,
          status: item.status,
          rating: item.rating || 0,
          new: index === 0 ? 'new' : undefined,
        }));
        setStoreData(mappedData);
  
      } catch (error) {
        console.error('Failed to fetch stores:', error);
        // toast.error("Failed to fetch stores");
      }
    };

  const handleClear = () => {
    setSearchText('');
  };

  const handleStoreSelect = store => {
    setSelectedStore(store); // Store selected store if needed for other purposes
    navigation.navigate('TrendingStoresScreen', {store}); // Navigate to TrendingStoresScreen
  };

  const handleMyEarnings = () => {
    setSelectedScreen('My Earnings');
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const logoutUser = async () => {
    const success = await logout();
    if (success) {
      // Navigate to Login screen after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
    goToLogin();
  };

  const handleLogout = () => {
    // Show logout confirmation dialog
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    // Close the dialog and proceed with logout
    setLogoutDialogVisible(false);
    logoutUser();
  };

  const cancelLogout = () => {
    // Simply close the dialog
    setLogoutDialogVisible(false);
  };

  const sideMenuItems = [
    {
      name: 'Home',
      icon: 'home',
      family: 'ionicons',
    },
    {
      name: 'Converter',
      icon: 'link',
      family: 'fontawesome',
    },
    {
      name: 'Store',
      icon: 'store',
      family: 'fontawesome',
    },
    {
      name: 'My Account',
      icon: 'person',
      family: 'ionicons',
    },
    {
      name: 'My Earnings',
      icon: 'rupee-sign',
      family: 'fontawesome',
    },
    {
      name: 'My Activity',
      icon: 'biking',
      family: 'fontawesome',
    },
    {
      name: 'Contests',
      icon: 'gamepad',
      family: 'fontawesome',
    },
    {
      name: 'Flash Deals',
      icon: 'rupee-sign',
      family: 'fontawesome',
    },
    {
      name: 'Most Shared Deals',
      icon: 'share',
      family: 'fontawesome',
    },
    {
      name: 'Refer and Earn',
      icon: 'slideshare',
      family: 'fontawesome',
    },
    {
      name: 'Telegram',
      icon: 'telegram',
      family: 'fontawesome',
    },
  ];

  // const handleScreenChange = (screenName) => {
  //   setSelectedScreen(screenName);
  // };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <ConfirmationDialog
        visible={logoutDialogVisible}
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
      <View
        style={[styles.TopHeaderContainer, defaultStyleSheet.shadowProvider]}>
        <View style={{overflow: 'hidden'}}>
          <Image
            style={{
              width: 150,
              height: 50,
              resizeMode: 'stretch',
              borderRadius:8,
            }}
            source={require('../src/assets/app_logo.png')}
          />
        </View>
        {/* <Text style={styles.appNamae}>Extra Pay</Text> */}

        <View style={styles.searchBarWrapper}>
          <SearchBar
            style={styles.searchbar}
            placeholder="Search Stores"
            onChangeText={handleSearch}
            value={searchText}
            onClearPress={handleClear}
            onStoreSelect={handleStoreSelect}
            navigation={navigation} // Pass navigation prop here
          />
        </View>

        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              handleMyEarnings();
            }}
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <IconComponent
              name={'wallet'}
              size={22}
              color={colors.colorPrimary}
              family={'fontawesome'}
              style={{margin: 5}}
            />
            <Text style={{fontSize: 18}}>Earnings $0.00</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              handleLogout();
            }}
            style={{
              marginHorizontal: 20,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <IconComponent name={'log-out'} size={28} color={colors.red} />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.MainContainer}>
          <View style={[styles.SidePanel, defaultStyleSheet.shadowProvider]}>
            {/* <View style={{alignItems: 'center'}}>
              <IconComponent
                name={'person'}
                color={colors.colorPrimary}
                size={50}
                family={'material'}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  marginBottom:5,
                  paddingBottom:10,}}>
                Aviral Yadav
              </Text>
            </View> */}

            <View
              style={[
                {
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 30,
                  marginBottom: 10,
                },
                defaultStyleSheet.shadowProvider,
              ]}>
              <View
                style={[
                  styles.profileImgContainer,
                  defaultStyleSheet.shadowProvider,
                ]}>
                <Image
                  style={{height: '100%', width: '100%'}}
                  // Ensures the image takes up the entire view size
                  resizeMode="contain" // Ensures the image fills the view while maintaining aspect ratio
                  source={require('../src/assets/profile_placeholder.png')}
                />
              </View>
              <View style={{marginStart: 8, flex: 1}}>
                <Text style={{fontWeight: '600', fontSize: 18}}>
                  {' '}
                  Aviral yadav
                </Text>
                <Text style={{fontWeight: '400', fontSize: 16}}>
                  {' '}
                  xyz@gmail.com
                </Text>
              </View>
            </View>

            <View style={{flex: 1, paddingVertical: 10}}>
              {sideMenuItems.map(item => (
                <SidePanelComponent
                  key={item.name}
                  ComponentName={item.name}
                  IconColor={colors.colorPrimary}
                  IconFamilyName={item.family}
                  IconName={item.icon}
                  isSelected={selectedScreen === item.name}
                  onPress={() => setSelectedScreen(item.name)}
                />
              ))}
            </View>
          </View>

          <View style={styles.screenViewer}>
            <RenderStack
              selectedScreen={selectedScreen}
              onScreenChange={newScreen => setSelectedScreen(newScreen)}
            />
          </View>
        </View>

        <LandingFooter />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  appNamae: {
    color: colors.colorPrimary,
    fontWeight: 'bold',
    fontSize: 30,
    margin: 5,
  },
  BottomFooterContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    paddingTop: 20,
  },
  MainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  SidePanel: {
    width: '25%',
    maxWidth: 250,
    marginVertical: 20,
    marginStart: 30,
    borderRadius: 8,
    height: 'fit-content',
    overflow: 'hidden',
  },
  profileImgContainer: {
    height: 80,
    width: 80,
    borderRadius: 50, // Makes the view circular
    overflow: 'hidden', // Ensures content fits within the circular boundary
    justifyContent: 'center', // Centers the image vertically
    alignItems: 'center',
    padding: 5,
    // Centers the image horizontally
  },
  TopHeaderContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1000,
  },
  searchBarWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    position: 'relative',
  },

  profileImg: {
    height: 200,
    width: 200,
    margin: 5,
  },

  screenViewer: {
    flex: 1,
    position: 'relative',
    margin: 8,
    padding: 8,
    height: 920,
  },

  BottommLogoContainer: {
    width: '25%',
    height: 300,
    marginVertical: 10,
  },
  Aboutus: {
    padding: 4,
    fontSize: 18,
  },
  FooterSecondHalfContainer: {
    flex: 1,
    height: 100,
    backgroundColor: colors.black,
    marginVertical: 10,
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
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    height: 150,
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  GooglePlayContainer: {
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: 8,
    flexDirection: 'row',
    height: 60,
    padding: 4,
  },
  googlePlay: {
    fontSize: 24,
    color: colors.white,
  },
});

export default WebCompatibleHome;
