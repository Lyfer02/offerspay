import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import IconComponent from './IconComponent';
import SearchStoreItem from './SearchStoreItem';
import { colors } from '../src/utils/color';
import { useNavigation } from '@react-navigation/native';
import { isWeb } from '../src/utils/dimension';

const { width: screenWidth } = Dimensions.get('window');

const SearchBar = ({
  value,
  onChangeText,
  onClearPress,
  placeholder,
  style,
  onStoreSelect,
  storeData = [],
  isLoading = false,
  noResults = false,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const navigation = useNavigation();
  useEffect(() => {
    // Handle click outside to close dropdown (web-specific)
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
        setIsFocused(false);
      }
    };

    if (isWeb) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  useEffect(() => {
    // Show dropdown when there's text and focused, or when loading/has results
    if (isFocused && (value?.length > 0 || isLoading)) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [value, isFocused, isLoading]);

  const handleInputChange = (text) => {
    onChangeText(text);
  };

  const handleStoreSelect = (store) => {
    //console.log("this is clicked  Store", store);
    
    if (store && onStoreSelect) {
      onStoreSelect(store);
      setIsDropdownVisible(false);
      setIsFocused(false);
      inputRef.current?.blur();
      // Clear the search input after selection
      onChangeText('');
       navigation?.navigate('TrendingStoresScreen', { store : store._id });
      
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value && value.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding dropdown to allow for store selection
    setTimeout(() => {
      setIsDropdownVisible(false);
      setIsFocused(false);
    }, 200);
  };

  const handleClear = () => {
    onClearPress();
    setIsDropdownVisible(false);
    inputRef.current?.focus();
  };

  const renderStoreItem = ({ item, index }) => (
    <TouchableOpacity 
      onPress={() => handleStoreSelect(item)}
      activeOpacity={0.7}
      style={[
        styles.itemTouchable,
        index === 0 && styles.firstItem,
        index === storeData.length - 1 && styles.lastItem
      ]}
    >
      <SearchStoreItem item={item} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="small" color={colors.colorPrimary} />
          <Text style={styles.emptyStateText}>Searching stores...</Text>
        </View>
      );
    }

    if (noResults && value?.length > 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <IconComponent name="search" size={32} color={colors.gray} />
          <Text style={styles.emptyStateText}>No stores found</Text>
          <Text style={styles.emptyStateSubtext}>Try searching with different keywords</Text>
        </View>
      );
    }

    if (value?.length === 0 && isFocused) {
      return (
        <View style={styles.emptyStateContainer}>
          <IconComponent name="search" size={32} color={colors.gray} />
          <Text style={styles.emptyStateText}>Start typing to search stores</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View ref={searchContainerRef} style={[styles.searchContainer, style]}>
      {/* Search Input */}
      <View style={[
        styles.searchBarContainer,
        isFocused && styles.searchBarFocused,
        isDropdownVisible && styles.searchBarWithDropdown
      ]}>
        <View style={styles.searchIconContainer}>
          <IconComponent 
            name="search" 
            size={20} 
            color={isFocused ? colors.colorPrimary : colors.gray} 
          />
        </View>
        
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        
        {value && value.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear} 
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <IconComponent name="close" size={16} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown Results */}
      {isDropdownVisible && (
        <View style={[
          styles.storeContainer,
          { width: Math.min(screenWidth - 40, 650) }
        ]}>
          {storeData.length > 0 ? (
            <>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsHeaderText}>
                  {storeData.length} store{storeData.length !== 1 ? 's' : ''} found
                </Text>
              </View>
              <FlatList
                data={storeData}
                renderItem={renderStoreItem}
                keyExtractor={(item) => item._id || item.id?.toString() || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
                maxToRenderPerBatch={10}
                windowSize={10}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </>
          ) : (
            renderEmptyState()
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    maxWidth: 650,
    zIndex: 1000,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    minHeight: 48,
    transition: Platform.OS === 'web' ? 'all 0.2s ease' : undefined,
  },
  searchBarFocused: {
    borderColor: colors.white,
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  searchBarWithDropdown: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  searchIconContainer: {
    marginRight: 12,
    padding: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    paddingVertical: 4,
    fontWeight: '400',
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeContainer: {
    position: 'absolute',
    top: 46, // Positioned right below the search bar
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    maxHeight: 400,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 999,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  resultsHeaderText: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.gray,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.7,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 8,
  },
  itemTouchable: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  firstItem: {
    paddingTop: 16,
  },
  lastItem: {
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginHorizontal: 16,
  },
});

export default SearchBar;