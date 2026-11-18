import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DollarSign, Image, LogOut, Menu } from 'lucide-react-native';
import { useAuth } from '../../navigation/AuthContext';
import { colors } from '../../src/utils/color';
import SearchBar from '../SearchBar';
import { useNavigation } from '@react-navigation/native';
import { storeService } from '../../api/services/stores.service';
import LinearGradient from 'react-native-linear-gradient';

const Header = ({ onToggleSidebar, onNavigateToEarnings, showMenuButton }) => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceTimer = useRef(null);

  const handleLogout = async () => {
    const result = await logout();
    if (!result.success) {
      console.error('Logout failed:', result.error);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const handleMyEarnings = () => {
    if (onNavigateToEarnings) {
      onNavigateToEarnings();
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleClear = () => {
    setSearchText('');
    setStoreData([]);
    setNoResults(false);
    setIsLoading(false);
  };

  const handleStoreSelect = (store) => {
    setSearchText('');
    setStoreData([]);
    setNoResults(false);
    navigation.navigate('TrendingStoresScreen', { store });
  };

  const fetchAndProcessStores = useCallback(async (page = 1, searchQuery = '') => {
    if (!searchQuery.trim()) {
      setStoreData([]);
      setNoResults(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);
    
    try {
      const res = await storeService.list(page, { search: searchQuery });
      const fetchedData = res.data?.data.storeData || [];

      if (fetchedData.length === 0 && page > 1) {
        return fetchAndProcessStores(page - 1, searchQuery);
      }

      if (fetchedData.length === 0 && searchQuery) {
        setNoResults(true);
        setStoreData([]);
      } else {
        const mappedData = fetchedData.map((item, index) => ({
          _id: item._id,
          id: ((res.data.data.currentPage - 1) * 10) + index + 1,
          name: item.name,
          image: item.image ? { uri: item.image } : null,
          earn: item.earn ? `₹${item.earn}` : '₹0',
          about: item.about,
          status: item.status,
          rating: item.rating || 0,
          new: index === 0 && page === 1 ? 'new' : undefined,
          description: item.about || '',
        }));

        setStoreData(mappedData);
        setNoResults(false);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      setStoreData([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchText.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchAndProcessStores(1, searchText);
      }, 300); // Reduced debounce time for better UX
    } else {
      setStoreData([]);
      setNoResults(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [fetchAndProcessStores, searchText]);

  return (

    <LinearGradient
    
                  colors={[colors.colorPrimaryLite, colors.colorPrimary]}
    style={styles.header}>
      {showMenuButton && (
        <TouchableOpacity onPress={onToggleSidebar} style={styles.menuButton}>
          <Menu size={24} color={colors.white} />
        </TouchableOpacity>
      )}
        {/* ✅ App logo + name */}
  <View style={styles.logoWrapper}>
    {/* <Image
      source={require('../../src/assets/logo_app.png')}
      style={styles.logo}
      resizeMode="contain"
    
    /> */}
    <Text style={styles.appName}>OffersPay</Text>
  </View>

      <View style={styles.searchBarWrapper}>
        <SearchBar
          style={styles.searchBar}
          placeholder="Search stores..."
          onChangeText={handleSearch}
          value={searchText}
          onClearPress={handleClear}
          onStoreSelect={handleStoreSelect}
          storeData={storeData}
          isLoading={isLoading}
          noResults={noResults}
        />
      </View>

      <View style={styles.headerContent}>
        {/* <TouchableOpacity onPress={handleMyEarnings} style={styles.earningsButton}>
          <DollarSign size={20} color={colors.white} />
          <Text style={styles.earningsText}>
            ${user.earnings || '0.00'}
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color={colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  logoWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 16,
},
logo: {
  width: 100,
  height: 36,
  marginRight: 8,
},
appName: {
  color: colors.white,
  fontSize:22,
  fontWeight: '700',
},
  header: {
    height: 80,
    backgroundColor: colors.colorPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 100, // Ensure header is above other content
  },
  menuButton: {
    padding: 12,
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchBarWrapper: {
    flex: 1,
    marginHorizontal: 16,
    zIndex: 1001, // Ensure search dropdown appears above everything
  },
  searchBar: {
    // The SearchBar component handles its own styling
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  earningsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 100,
  },
  earningsText: {
    color: colors.white,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: colors.white,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Header;