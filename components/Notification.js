// Notifications.js - OPTIMIZED VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import IconComponent from './IconComponent';
import NotificationItem from './NotificationItem';
import { ErrorModalService } from '../src/utils/modalService';
import { colors } from '../src/utils/color';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import { useResponsive } from '../src/utils/dimension';
import { notificationService } from '../api/services/notification.service';
import LinearGradient from 'react-native-linear-gradient';

const Notifications = () => {
  const navigation = useNavigation();
  const dimensions = useResponsive();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAllSeen, setMarkingAllSeen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    hasNextPage: false,
  });

  // Prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);

  // Fetch notifications with proper pagination
  const fetchNotifications = async (page = 1, isRefreshing = false) => {
    // Prevent multiple simultaneous requests
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;

      // Set appropriate loading state
      if (page === 1 && !isRefreshing) {
        setLoading(true);
      } else if (page > 1) {
        setLoadingMore(true);
      }

      const response = await notificationService.getAllNotifications(page);
      const data = response?.data?.data;

      if (data && data.notifications) {
        const newNotifications = data.notifications;
        const paginationData = data.pagination;

        // Update notifications list
        setNotifications(prevNotifications => 
          page === 1 
            ? newNotifications 
            : [...prevNotifications, ...newNotifications]
        );

        // Update pagination state
        setPagination({
          currentPage: paginationData.currentPage,
          totalPages: paginationData.totalPages,
          limit: paginationData.limit,
          hasNextPage: paginationData.hasNextPage,
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      ErrorModalService.error('Failed to load notifications');
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications(1);
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchNotifications(1, true);
  }, []);

  // Handle load more (pagination)
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !loading && pagination.hasNextPage && !isLoadingRef.current) {
      const nextPage = pagination.currentPage + 1;
      fetchNotifications(nextPage);
    }
  }, [loadingMore, loading, pagination.hasNextPage, pagination.currentPage]);

  // Mark single notification as seen
  const markAsSeen = async (notificationId) => {
    try {
    //  console.log("this is started markAsSeen");
      
      // Call API with single ID in array
      const response = await notificationService.seen({ ids: [notificationId] });
    //  console.log("this is click response ",response);
      
      if (response?.data?.success) {
        // Update UI only after successful API call
        setNotifications(prevNotifications =>
          prevNotifications.map(notif =>
            notif._id === notificationId ? { ...notif, isSeen: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as seen:', error);
      // Don't show error modal for single notification to avoid annoying user
    }
  };

  // Mark all notifications as seen
  const markAllAsSeen = async () => {
    try {
      // Get all unseen notification IDs
      const unseenIds = notifications
        .filter(notif => !notif.isSeen)
        .map(notif => notif._id);

      if (unseenIds.length === 0) {
        return; // No unseen notifications
      }

      setMarkingAllSeen(true);

      // Call API with all IDs
      const response = await notificationService.seen({ ids: unseenIds });
      
      if (response?.data?.success) {
        // Update UI only after successful API call
        setNotifications(prevNotifications =>
          prevNotifications.map(notif => ({ ...notif, isSeen: true }))
        );
        
        // Show success feedback
        ErrorModalService.success(`${unseenIds.length} notification${unseenIds.length > 1 ? 's' : ''} marked as seen`);
      }
    } catch (error) {
      console.error('Error marking all notifications as seen:', error);
      ErrorModalService.error('Failed to mark all notifications as seen');
    } finally {
      setMarkingAllSeen(false);
    }
  };

  // Handle notification press
  const handleNotificationPress = useCallback((item) => {
    // Mark as seen first
    markAsSeen(item._id);
//console.log("this is click log",response);


    // Handle navigation based on notification data
    if (item.data) {
      try {
        const parsedData = typeof item.data === 'string' 
          ? JSON.parse(item.data) 
          : item.data;

        if (parsedData.offerId) {
          // Navigate to offer details
         // navigation.navigate('ProductDetailsScreen', { offerId: parsedData.offerId });
        }
      } catch (error) {
        console.error('Error parsing notification data:', error);
      }
    }
  }, []);

  // Format relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Render notification item using external component
  const renderNotificationItem = useCallback(({ item }) => (
    <NotificationItem item={item} onPress={handleNotificationPress} />
  ), [handleNotificationPress]);

  // Footer loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.colorPrimary} />
        <Text allowFontScaling={false} style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  // Empty state
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <IconComponent
          name="notifications-off-outline"
          size={80}
          color={colors.lightGray}
          family="ionicons"
        />
        <Text style={styles.emptyTitle}>No Notifications</Text>
        <Text style={styles.emptySubtitle}>
          You're all caught up! Check back later for updates.
        </Text>
      </View>
    );
  };

  // Responsive container width
  const containerStyle = [
    styles.container,
    dimensions.isDesktop && { maxWidth: 800, alignSelf: 'center', width: '100%' }
  ];

  return (
    <SafeAreaProvider>
    <SafeAreaView style={containerStyle}>
      {/* Header */}
      <LinearGradient
      colors={[colors.colorPrimaryLite, colors.colorPrimary]}
      >
      <View style={[styles.header, defaultStyleSheet.cardShadow]}>
        
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <IconComponent
            name="arrow-back"
            size={24}
            color={colors.white}
            family="ionicons"
          />
        </TouchableOpacity>


        <Text allowFontScaling={false} style={styles.headerTitle}>Notifications</Text>

        <View style={styles.headerRight}>
          {notifications.some(n => !n.isSeen) && (
            <TouchableOpacity
              style={styles.markAllButton}
              activeOpacity={0.7}
              onPress={markAllAsSeen}
              disabled={markingAllSeen}>
              {markingAllSeen ? (
                <ActivityIndicator size="small" color={colors.colorPrimary} />
              ) : (
                <Text allowFontScaling={false} style={styles.markAllText}>Mark all</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      </LinearGradient>

      

      {/* Notifications List */}
      {loading && pagination.currentPage === 1 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.colorPrimary} />
          <Text allowFontScaling={false} style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.colorPrimary]}
              tintColor={colors.colorPrimary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={15}
          windowSize={10}
        />
      )}
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
    marginLeft: 8,
  },
  headerRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.colorPrimaryLite + '20',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {backgroundColor:colors.white,
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12 ,
    color: colors.gray,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Notifications;