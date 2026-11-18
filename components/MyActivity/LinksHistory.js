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
import LinkHistoryItem from '../LinkHistoryItem';

const LinkHistory = () => {
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
    if (width >= 1200) return 3; // Large content area
    if (width >= 900) return 2;  // Medium content area
    if (width >= 600) return 2;  // Tablet
    
    return 1; // Mobile
  }, [availableWidth]);

  // Gap between items
  const gap = 15;

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
  const getShortLinkApi = useCallback(async (startDate = new Date(), endDate = new Date()) => {
    if (!user?.id) {
      ErrorModalService.error('Please log in first.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await trackingService.shortLinks(1, {
        userId : user?.id,
        fromDate: startDate,
        toDate: endDate,
      });

      const apiData = response?.data?.data?.shortLinks || [];
      setHistoryData(apiData);
      setFilteredData(apiData);
    //  console.log("this is api data ",filteredData);

    } catch (error) {
      const msg = error?.response?.data?.message;
      
      if (msg?.toLowerCase() === 'jwt expired') {
        await handleJwtExpired();
        return;
      }

      const errorMessage = msg || 'Failed to fetch short links';
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
    getShortLinkApi(new Date(), new Date());
  }, [getShortLinkApi]);

  // 🔍 Local search filter - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let filtered = historyData;
      
      if (searchText.trim()) {
        const lowerSearch = searchText.toLowerCase();
        filtered = filtered.filter((item) =>
          item?.offer?.name?.toLowerCase().includes(lowerSearch) ||
          item?.store?.name?.toLowerCase().includes(lowerSearch) ||
          item?.shortCode?.toLowerCase().includes(lowerSearch) ||
          item?.shortUrl?.toLowerCase().includes(lowerSearch)
        );
      }
      
      setFilteredData(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, historyData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getShortLinkApi(fromDate, toDate);
    }, 300);
  
    return () => clearTimeout(timer);
  }, [searchText, fromDate, toDate, getShortLinkApi]);

  // 🗓️ Apply date filter
  const handleDateApply = useCallback(async () => {
    setShowDateFilter(false);
    await getShortLinkApi(fromDate, toDate);
  }, [fromDate, toDate, getShortLinkApi]);

  // 🔗 Handle link press with better error handling
  const handleLinkPress = useCallback((url) => {
    if (!url) {
      ErrorModalService.error('Invalid link URL');
      return;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          ErrorModalService.error('Cannot open this link');
        }
      })
      .catch((err) => {
        console.error('Failed to open URL:', err);
        ErrorModalService.error('Failed to open link');
      });
  }, []);

  // 📋 Copy to clipboard (web-compatible)
  const handleCopyLink = useCallback((url) => {
    if (isWeb) {
      navigator.clipboard.writeText(url)
        .then(() => ErrorModalService.success('Link copied to clipboard!'))
        .catch(() => ErrorModalService.error('Failed to copy link'));
    } else {
      ErrorModalService.info('Copy feature available on web');
    }
  }, []);

  // 🎨 Responsive styles - memoized
  const responsiveStyles = useMemo(() => {
    const isDesktop = dimensions.isDesktop;
    const isTablet = dimensions.isTablet;

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: isDesktop ? 20 : isTablet ? 15 : 10,
      },
      header: {
        flexDirection: isDesktop ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: isDesktop ? 'center' : 'stretch',
        marginBottom: 20,
        gap: isDesktop ? 0 : 10,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        flexWrap: 'wrap',
      },
      totalText: {
        fontSize: isDesktop ? 18 : 14,
        fontWeight: 'bold',
        color: colors.black,
      },
      dateRangeText: {
        fontSize: isDesktop ? 14 : 12,
        color: colors.gray,
      },
      headerRight: {
        flexDirection: isDesktop ? 'row' : 'column',
        alignItems: isDesktop ? 'center' : 'stretch',
        gap: 10,
      },
      datePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      },
      dateInput: {
        borderWidth: 1,
        borderColor: colors.text,
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 12,
        color:colors.text,
        backgroundColor: colors.white,
        minWidth: isDesktop ? 120 : 100,
        ...(isWeb && { cursor: 'pointer' }),
      },
      searchInput: {
        borderWidth: 1,
        borderColor: colors.text,
        borderRadius: 5,
        color:colors.text,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 12,
        backgroundColor: colors.white,
        minWidth: isDesktop ? 250 : 200,
        ...(isWeb && { outline: 'none' }),
      },
      listContainer: {
        flex: 1,
      },
      gridColumnWrapper: {
        gap: gap,
        justifyContent: 'flex-start',
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
      },
      emptyText: {
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
        marginTop: 10,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: colors.gray,
      },
    });
  }, [dimensions, gap]);

  // 📱 Render history item - now uses external component
  const renderHistoryItem = useCallback(
    ({ item }) => (
      <LinkHistoryItem
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
      <IconComponent name="link" size={64} color={colors.gray} />
      <Text 
      allowFontScaling={false}
      style={responsiveStyles.emptyText}>
        {error ? error : 'No short links found for the selected period'}
      </Text>
      {error && (
        <TouchableOpacity
          onPress={() => getShortLinkApi(fromDate, toDate)}
          style={{ marginTop: 15 }}
        >
          <Text 
          allowFontScaling={false}
          style={{ color: colors.colorPrimary, fontWeight: 'bold' }}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ), [responsiveStyles, error, getShortLinkApi, fromDate, toDate]);

  // ⏳ Loading state
  const renderLoadingState = useCallback(() => (
    <View style={responsiveStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.colorPrimary} />
      <Text 
      
      style={responsiveStyles.loadingText}>Loading short links...</Text>
    </View>
  ), [responsiveStyles]);

  // 🔑 Key extractor
  const keyExtractor = useCallback((item, index) => 
    item._id || `link-${index}`, []
  );

  return (
    <View style={responsiveStyles.container}>
      <View style={responsiveStyles.header}>
        <View style={responsiveStyles.headerLeft}>
          <Text 
          allowFontScaling={false}
          style={responsiveStyles.totalText}>
            Total Links: {filteredData.length}
          </Text>
          <Text
          allowFontScaling={false}
          style={responsiveStyles.dateRangeText}>
            ({formatDate(fromDate)} - {formatDate(toDate)})
          </Text>
        </View>

        <View style={responsiveStyles.headerRight}>
          <View style={responsiveStyles.datePickerRow}>
            <TouchableOpacity onPress={() => setShowDateFilter(true)}>
              <TextInput
              allowFontScaling={false}
                style={responsiveStyles.dateInput}
                value={formatDate(fromDate)}
                editable={false}
                placeholder="From Date"
                pointerEvents="none"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDateFilter(true)}>
              <TextInput
              allowFontScaling={false}
                style={responsiveStyles.dateInput}
                value={formatDate(toDate)}
                editable={false}
                placeholder="To Date"
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>

          <TextInput
          allowFontScaling={false}
            style={responsiveStyles.searchInput}
            placeholder="Search by name, store, code, or URL..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={colors.gray}
          />
        </View>
      </View>

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

export default LinkHistory;