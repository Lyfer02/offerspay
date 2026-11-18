import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { isWeb, useResponsive } from '../../src/utils/dimension';
import { colors } from '../../src/utils/color';
import IconComponent from '../IconComponent';
import DateFilterModal from '../DateFilterComponent';
import { useAuth } from '../../navigation/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { trackingService } from '../../api/services/tracking.service';
import { ErrorModalService } from '../../src/utils/modalService';
import ClickHistoryItem from '../ClickHistoryItem';

const ClickHistory = () => {
  const dimensions = useResponsive();
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate available width considering side panel (30% for desktop)
  const availableWidth = useMemo(() => {
    const screenWidth = dimensions.width;
    
    if (dimensions.isDesktop) {
      // Desktop: 30% side panel, 70% content area
      return screenWidth * 0.70;
    }
    
    return screenWidth;
  }, [dimensions]);

  // Calculate number of columns based on available width
  const numColumns = useMemo(() => {
    if (!isWeb) return 1; // Always 1 column on mobile apps
    
    const width = availableWidth;
    
    // More granular breakpoints considering 70% width for desktop
    if (width >= 1200) return 4; // Large content area
    if (width >= 900) return 3;  // Medium content area
    if (width >= 600) return 2;  // Tablet
    
    return 1; // Mobile
  }, [availableWidth]);

  // Gap between items
  const gap = 16;

  // 🔒 Handle JWT expired
  const handleJwtExpired = useCallback(async () => {
    await logout();
    ErrorModalService.error('Your session has expired. Please log in again.');
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 1500);
  }, [logout, navigation]);

  // 🧠 Formatters - memoized
  const formatDate = useCallback((date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  // 🌐 API call with improved error handling
  const getClickApi = useCallback(async (startDate = new Date(), endDate = new Date()) => {
    if (!user?.id) {
      ErrorModalService.error('Please log in first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await trackingService.clicks(1, {
        aid: user?.id,
        fromDate: startDate,
        toDate: endDate,
      });

    
      const apiData = response?.data?.data?.clicks || [];
      
      
      setHistoryData(apiData);
      setFilteredData(apiData);

    } catch (error) {
      console.error("Click API error:", error.response?.data || error);
      const msg = error?.response?.data?.message;
      
      if (msg?.toLowerCase() === 'jwt expired') {
        await handleJwtExpired();
        return;
      }

      const errorMessage = msg || 'Failed to fetch clicks';
      setError(errorMessage);
      ErrorModalService.error(errorMessage);
      
      setHistoryData([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, handleJwtExpired]);


 
  

  // 🎯 Default fetch (today) - only on mount
  useEffect(() => {
    getClickApi(new Date(), new Date());
  }, [getClickApi]);

  // 🔍 Local search filter - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let filtered = historyData;
      
      if (searchText.trim()) {
        const lowerSearch = searchText.toLowerCase();
        filtered = filtered.filter((item) =>
          item?.offer?.name?.toLowerCase().includes(lowerSearch) ||
          item?.store?.name?.toLowerCase().includes(lowerSearch) ||
          item?.shortUrl?.toLowerCase().includes(lowerSearch)
        );
      }
      
      setFilteredData(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, historyData]);

  // 📅 Date apply handler
  const handleDateApply = useCallback(() => {
    setShowDateFilter(false);
    getClickApi(fromDate, toDate);
  }, [fromDate, toDate, getClickApi]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getClickApi(fromDate, toDate);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, fromDate, toDate, getClickApi]);

  // 📋 Handle copy link
  const handleCopyLink = useCallback(async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      ErrorModalService.success('Link copied to clipboard!');
    } catch (error) {
      ErrorModalService.error('Failed to copy link');
    }
  }, []);

  // 🔗 Handle link press
  const handleLinkPress = useCallback(async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      ErrorModalService.error('Failed to open link');
    }
  }, []);

  // Responsive styles with enhanced UI
  const responsiveStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      padding: isWeb ? 24 : 16,
    },
    headerCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: isWeb ? 24 : 0,
      marginBottom: 20,
      // shadowColor: colors.black,
      // shadowOffset: { width: 0, height: 4 },
      // shadowOpacity: 0.08,
      // shadowRadius: 2,
      // elevation: 1,
    },
    statsRow: {
      flexDirection: isWeb ? 'row' : 'column',
      alignItems: isWeb ? 'center' : 'flex-start',
      marginBottom: 10,
      gap: 12,
    },
    statsBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f7ff',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      gap: 10,
    },
    statsIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.colorPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsContent: {
      flex: 1,
    },
    statsLabel: {
      fontSize: 12,
      color: '#64748b',
      fontWeight: '500',
      marginBottom: 2,
    },
    statsValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.colorPrimary,
    },
    dateRangeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      gap: 8,
    },
    dateRangeText: {
      fontSize: 13,
      color: '#475569',
      fontWeight: '500',
    },
    filtersRow: {
      flexDirection: 'column',
      gap: 12,
    },
    datePickerRow: {
      flexDirection: 'row',
      gap: 10,
    },
    dateInputWrapper: {
      flex: 1,
      minWidth: isWeb ? 140 : undefined,
    },
    dateInputLabel: {
      fontSize: 12,
      color: '#64748b',
      fontWeight: '600',
      marginBottom: 6,
      marginLeft: 2,
    },
    dateInput: {
      borderWidth: 1.5,
      borderColor: '#e2e8f0',
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
      backgroundColor: colors.white,
      color: colors.black,
      fontWeight: '500',
    },
    searchWrapper: {
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#e2e8f0',
      borderRadius: 10,
      paddingHorizontal: 14,
      backgroundColor: colors.white,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      padding: 12,
      fontSize: 14,
      color: colors.black,
    },
    listContainer: {
      flex: 1,
    },
    gridColumnWrapper: {
      justifyContent: 'flex-start',
      gap: gap,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyIconWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#f1f5f9',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    emptyText: {
      fontSize: 14,
      color: '#64748b',
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: 24,
    },
    retryButton: {
      marginTop: 20,
      backgroundColor: colors.colorPrimary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
      shadowColor: colors.colorPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    retryButtonText: {
      color: colors.white,
      fontWeight: '700',
      fontSize: 14,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
  }), [gap]);

  // 📦 Render history item - now uses external component
  const renderHistoryItem = useCallback(
    ({ item }) => (
      <ClickHistoryItem
        item={item}
        formatDate={formatDate}
        formatTime={formatTime}
        handleLinkPress={handleLinkPress}
        handleCopyLink={handleCopyLink}
        numColumns={numColumns}
        gap={gap}
      />
    ),
    [formatDate, formatTime, handleLinkPress, handleCopyLink, numColumns, gap]
  );

  // 🚫 Empty state
  const renderEmptyState = useCallback(() => (
    <View style={responsiveStyles.emptyContainer}>
      <View style={responsiveStyles.emptyIconWrapper}>
        <IconComponent name="link" size={48} color="#cbd5e1" />
      </View>
      <Text
      
      allowFontScaling={false}
      style={responsiveStyles.emptyText}>
        {error ? error : 'No clicks found for the selected period.\nTry adjusting your date range or search filters.'}
      </Text>
      {error && (
        <TouchableOpacity
          onPress={() => getClickApi(fromDate, toDate)}
          style={responsiveStyles.retryButton}
          activeOpacity={0.8}
        >
          <Text
          
      allowFontScaling={false} style={responsiveStyles.retryButtonText}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ), [responsiveStyles, error, getClickApi, fromDate, toDate]);

  // ⏳ Loading state
  const renderLoadingState = useCallback(() => (
    <View
    style={responsiveStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.colorPrimary} />
      <Text 
      allowFontScaling={false}
      style={responsiveStyles.loadingText}>Loading clicks...</Text>
    </View>
  ), [responsiveStyles]);

  // 🔑 Key extractor
  const keyExtractor = useCallback((item, index) => 
    item._id || `click-${index}`, []
  );

  return (

    <View style={responsiveStyles.container}>
      {/* Enhanced Header Card */}
      <View style={responsiveStyles.headerCard}>
        {/* Stats Row */}
        <View style={responsiveStyles.statsRow}>
          <View style={responsiveStyles.statsBox}>
            <View style={responsiveStyles.statsIconWrapper}>
              <IconComponent name="link" size={20} color={colors.white} />
            </View>
            <View style={responsiveStyles.statsContent}>
              <Text
      allowFontScaling={false}
               style={responsiveStyles.statsLabel}>Total Clicks</Text>
              <Text
      allowFontScaling={false} style={responsiveStyles.statsValue}>{filteredData.length}</Text>
            </View>
          </View>

          <View style={responsiveStyles.dateRangeBox}>
            <IconComponent name="calendar" size={16} color="#64748b" />
            <Text
      allowFontScaling={false} style={responsiveStyles.dateRangeText}>
              {formatDate(fromDate)} - {formatDate(toDate)}
            </Text>
          </View>
        </View>

        {/* Filters Row */}
        <View style={responsiveStyles.filtersRow}>
          <View style={responsiveStyles.datePickerRow}>
            <View style={responsiveStyles.dateInputWrapper}>
              <Text 
            allowFontScaling={false} style={responsiveStyles.dateInputLabel}>From Date</Text>
              <TouchableOpacity onPress={() => setShowDateFilter(true)}>
                <TextInput
                allowFontScaling={false}
                  style={responsiveStyles.dateInput}
                  value={formatDate(fromDate)}
                  editable={false}
                  placeholder="Select date"
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>

            <View style={responsiveStyles.dateInputWrapper}>
              <Text 
              
            allowFontScaling={false}
              style={responsiveStyles.dateInputLabel}>To Date</Text>
              <TouchableOpacity onPress={() => setShowDateFilter(true)}>
                <TextInput
                allowFontScaling={false}
                  style={responsiveStyles.dateInput}
                  value={formatDate(toDate)}
                  editable={false}
                  placeholder="Select date"
                  pointerEvents="none"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={responsiveStyles.searchWrapper}>
            <Text
            
      allowFontScaling={false} style={responsiveStyles.dateInputLabel}>Search</Text>
            <View style={responsiveStyles.searchInputContainer}>
              <IconComponent 
                name="search" 
                size={18} 
                color="#94a3b8" 
                style={responsiveStyles.searchIcon}
              />
              <TextInput
                style={responsiveStyles.searchInput}
                placeholder="Search by offer, store, or URL..."
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>
        </View>
      </View>

      {/* List Container */}
      <View style={responsiveStyles.listContainer}>
        {isLoading ? (
          renderLoadingState()
        ) : filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={renderHistoryItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={!isWeb}
            key={numColumns}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? responsiveStyles.gridColumnWrapper : undefined}
          />
        ) : (
          renderEmptyState()
        )}
      </View>

      <DateFilterModal
        isVisible={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        onApply={handleDateApply}
        formatDate={formatDate}
      />
    </View>
  );
};

export default ClickHistory;