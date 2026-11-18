import { StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform, TextInput, ScrollView, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { colors } from '../../src/utils/color';
import IconComponent from '../../components/IconComponent';
import TrendingStoresItem from '../../components/TrendingStoresItem';
import { storeService } from '../../api/services/stores.service';
import { storage } from '../../src/utils/storage';
import { isWeb, screenDimensions } from '../../src/utils/dimension';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const applyFilterAndReturn = (filter, items) => {
  const sortedItems = [...items];

  switch (filter) {
    case 'A-Z':
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case '% Profit':
    case 'Flat Profit':
      sortedItems.sort((a, b) => {
        const aEarn = parseFloat(a.earn.replace('₹', '')) || 0;
        const bEarn = parseFloat(b.earn.replace('₹', '')) || 0;
        return bEarn - aEarn;
      });
      break;
    default:
      break;
  }

  return sortedItems;
};

// Enhanced SearchBar with cross-platform support
const SearchBar = ({ value, onChangeText, onClearPress, placeholder, style }) => (
  <View style={[styles.searchBarContainer,]}>
    <View style={styles.searchIconContainer}>
      <IconComponent name="search" size={20} color={colors.black} />
    </View>

    <TextInput
      value={value}
      onChangeText={onChangeText}
      onChange={isWeb ? (e) => onChangeText(e.target.value) : undefined}
      placeholder={placeholder}
      allowFontScaling={false}
      placeholderTextColor={colors.black}
      style={[styles.searchInput, isWeb && { outline: 'none' }]}
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="never"
      returnKeyType="search"
    />

    {value ? (
      <TouchableOpacity onPress={onClearPress} style={styles.clearButton}>
        <IconComponent name="close-circle" size={20} color={colors.black} />
      </TouchableOpacity>
    ) : null}
  </View>
);

// Responsive grid without sections
const StoreGrid = ({ stores, renderItem, noResults, isLoading, onEndReached, hasNextPage, isLoadingMore, onRefresh, refreshing }) => {
  const { width } = useWindowDimensions();
  const [responsiveConfig, setResponsiveConfig] = useState({});

  useEffect(() => {
    const updateResponsiveConfig = async () => {
      const config = {
        columns: width > 1400 ? 6 : width > 1200 ? 5 : width > 900 ? 4 : width > 600 ? 3 : 2,
        padding: width > 1200 ? 24 : width > 800 ? 20 : 12,
        itemSpacing: width > 1200 ? 16 : width > 800 ? 12 : 8,
        cardMaxWidth: width > 600 ? 250 : 200,
      };
      setResponsiveConfig(config);
      await storage.setItem('gridConfig', JSON.stringify(config));
    };

    updateResponsiveConfig();
  }, [width]);

  const columns = responsiveConfig.columns || 2;
  const itemSpacing = responsiveConfig.itemSpacing || 8;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.colorPrimary} />
        <Text 
        allowFontScaling={false}
        style={styles.loadingText}>Loading stores...</Text>
      </View>
    );
  }

  const totalPadding = (responsiveConfig.padding || 12) * 2;
  const totalSpacing = itemSpacing * (columns - 1);
  const availableWidth = width - totalPadding - totalSpacing;
  const actualItemWidth = availableWidth / columns;

  if (noResults) {
    return (
      <View style={styles.noResultsContainer}>
        <IconComponent name="stores" size={64} color={colors.lightGray} />
        <Text 
        allowFontScaling={false}
        style={styles.noResultsTitle}>No stores found</Text>
        <Text 
        allowFontScaling={false}
        style={styles.noResultsSubtitle}>Try adjusting your search or filters</Text>
      </View>
    );
  }

  const renderRow = ({ item: rowData, index }) => {
    return (
      <View key={`row-${index}`} style={[styles.gridRow, { backgroundColor: colors.background }]}>
        {rowData.map((item, idx) => (
          <View
            key={item._id || `${index}-${idx}`}
            style={[
              styles.gridItem,
              {
                width: `${100 / columns}%`,
                paddingHorizontal: itemSpacing / 2,
                paddingVertical: itemSpacing / 2,
              },
            ]}
          >
            {renderItem({ item, containerWidth: actualItemWidth })}
          </View>
        ))}
        {/* Fill empty spaces in the last row */}
        {rowData.length < columns &&
          Array.from({ length: columns - rowData.length }).map((_, idx) => (
            <View
              key={`empty-${index}-${idx}`}
              style={[
                styles.gridItem,
                {
                  width: `${100 / columns}%`,
                  paddingHorizontal: itemSpacing / 2,
                  paddingVertical: itemSpacing / 2,
                },
              ]}
            />
          ))}
      </View>
    );
  };

  // Render footer with loading indicator
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.colorPrimary} />
        <Text allowFontScaling={false} style={styles.footerLoaderText}>
          Loading more stores...
        </Text>
      </View>
    );
  };

  // Convert flat array to rows
  const rows = [];
  for (let i = 0; i < stores.length; i += columns) {
    rows.push(stores.slice(i, i + columns));
  }

  return (
    <FlatList
      data={rows}
      keyExtractor={(item, index) => `row-${index}`}
      renderItem={renderRow}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        { padding: responsiveConfig.padding || 12 }
      ]}
      style={styles.flatList}
      onEndReached={hasNextPage ? onEndReached : null}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.colorPrimary, colors.colorPrimaryLite]}
          tintColor={colors.colorPrimary}
          title="Pull to refresh"
          titleColor={colors.gray}
        />
      }
    />
  );
};

// Filter chip
const FilterChip = ({ label, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.filterChipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text 
    allowFontScaling={false}
    style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Stores = () => {
  const [searchText, setSearchText] = useState('');
  const [storeData, setStoreData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { width } = useWindowDimensions();
  const selectedFilterRef = useRef(selectedFilter);

  useEffect(() => {
    selectedFilterRef.current = selectedFilter;
  }, [selectedFilter]);

  const filterOptions = [
    { label: 'All', value: '' },
    { label: 'A-Z', value: 'A-Z' },
    { label: 'High Earnings', value: '% Profit' },
    { label: 'Best Deals', value: 'Flat Profit' },
  ];

  const fetchAndProcessStores = useCallback(async (page = 1, searchQuery = '', shouldReplace = false, showLoading = true) => {
    if (page === 1) {
      if (showLoading) {
        setIsLoading(true);
      }
    } else {
      setIsLoadingMore(true);
    }
    
    setNoResults(false);
    
    try {
      const res = await storeService.list(page, { search: searchQuery });
      const apiData = res.data?.data;
      const fetchedData = apiData.storeData || [];

      // Update pagination state
      setHasNextPage(apiData.hasNextPage || false);
      setCurrentPage(apiData.currentPage || page);

      if (fetchedData.length === 0 && searchQuery && page === 1) {
        setNoResults(true);
        setStoreData([]);
        return;
      }

      const mappedData = fetchedData.map((item, index) => ({
        _id: item._id,
        id: ((apiData.currentPage - 1) * 10) + index + 1,
        name: item.name,
        image: { uri: item.image },
        earn: item.earn ? `₹${item.earn}` : '₹0',
        about: item.about,
        status: item.status,
        rating: item.rating || 0,
        new: undefined,
      }));

      // Replace or append data based on whether it's a new search/filter or pagination
      if (shouldReplace || page === 1) {
        setStoreData(applyFilterAndReturn(selectedFilterRef.current, mappedData));
      } else {
        // Append new data to existing data
        setStoreData(prevData => {
          const combined = [...prevData, ...mappedData];
          return applyFilterAndReturn(selectedFilterRef.current, combined);
        });
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchAndProcessStores(1, '', true);
    // Load saved filter
    storage.preferences.getFilterPreference().then(filter => {
      if (filter) setSelectedFilter(filter);
    });
  }, [fetchAndProcessStores]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    if (!searchText.trim()) return undefined;

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchAndProcessStores(1, searchText, true);
    }, 600);

    return () => clearTimeout(timer);
  }, [fetchAndProcessStores, searchText]);

  const handleClear = () => {
    setSearchText('');
    setNoResults(false);
    setCurrentPage(1);
    fetchAndProcessStores(1, '', true);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const applyFilter = (filter, items = storeData) => {
    const sortedItems = applyFilterAndReturn(filter, items);
    setStoreData(sortedItems);
  };

  const handleFilterSelect = async (filterOption) => {
    setSelectedFilter(filterOption);
    applyFilter(filterOption);
    await storage.preferences.setFilterPreference(filterOption);
    closeModal();
  };

  // Handle load more when reaching end of list
  const handleLoadMore = () => {
    if (!isLoadingMore && hasNextPage && !refreshing) {
      fetchAndProcessStores(currentPage + 1, searchText, false);
    }
  };

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasNextPage(false);
    
    try {
      await fetchAndProcessStores(1, searchText, true, false);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchAndProcessStores, searchText]);

  return (
    <SafeAreaProvider >
    <SafeAreaView style={styles.container}>
      {/* Search and Filter */}
      <LinearGradient
       colors={[colors.colorPrimaryLite, colors.colorPrimary]}
      style={[styles.searchSection, { paddingHorizontal: width > 1200 ? 24 : 16 }]}>
        <View style={styles.searchContainer}>
          <SearchBar
            style={styles.searchbar}
            placeholder="Search stores..."
            onChangeText={handleSearch}
            value={searchText}
            onClearPress={handleClear}
          />
          {width < 768 && (
            <TouchableOpacity
            activeOpacity={0.9}
              style={[styles.filterButton, selectedFilter && styles.filterButtonActive]}
              onPress={openModal}
            >
              <IconComponent name="filter" size={20} color={selectedFilter ? colors.white : colors.gray} />
              {selectedFilter && <View style={styles.filterIndicator} />}
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips (Desktop) */}
        {width > 768 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterChipsContainer}
            contentContainerStyle={styles.filterChipsContent}
          >
            {filterOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                isSelected={selectedFilter === option.value}
                onPress={() => handleFilterSelect(option.value)}
              />
            ))}
          </ScrollView>
        )}
      </LinearGradient>

      {/* Store Grid */}
      <StoreGrid
        stores={storeData}
        renderItem={({ item }) => <TrendingStoresItem item={item} />}
        noResults={noResults}
        isLoading={isLoading}
        onEndReached={handleLoadMore}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Filter Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, screenDimensions.isTablet ? styles.modalContentDesktop : {}]}>
                <View style={styles.modalHeader}>
                  <Text 
                  allowFontScaling={false}
                  style={styles.modalTitle}>Filter Options</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <IconComponent name="close" size={24} color={colors.gray} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  {filterOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        selectedFilter === option.value && styles.filterOptionSelected,
                      ]}
                      onPress={() => handleFilterSelect(option.value)}
                    >
                      <Text
                      allowFontScaling={false}
                        style={[
                          styles.filterOptionText,
                          selectedFilter === option.value && styles.filterOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {selectedFilter === option.value && (
                        <IconComponent name="checkmark-circle" size={20} color={colors.colorPrimary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchSection: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchbar: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: colors.colorPrimary,
    borderColor: colors.colorPrimary,
  },
  filterIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: colors.green,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  filterChipsContainer: {
    marginTop: 12,
  },
  filterChipsContent: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  filterChipSelected: {
    backgroundColor: colors.colorPrimary,
    borderColor: colors.colorPrimary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
    fontWeight: '500',
  },
  flatList: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    flexGrow: 1,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    paddingBottom: 4,
    backgroundColor: colors.white
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoaderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalContentDesktop: {
    margin: 50,
    borderRadius: 20,
    maxHeight: '80%',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.background || '#f8f9fa',
  },
  filterOptionSelected: {
    backgroundColor: colors.colorPrimary + '20',
    borderWidth: 2,
    borderColor: colors.colorPrimary,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  filterOptionTextSelected: {
    color: colors.colorPrimary,
    fontWeight: '600',
  },
});

export default Stores;