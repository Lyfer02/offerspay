import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  useWindowDimensions, 
  ScrollView, 
  Text,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity
} from 'react-native';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import DealsItem from './DealsItem';
import { productService } from '../api/services/product.service';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/utils/color';
import LinearGradient from 'react-native-linear-gradient';
import IconComponent from './IconComponent';
import { useNavigation, useRoute } from '@react-navigation/native';

const FlashDeals = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const itemWidth = calculateItemWidth(width);
  
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  
  // ✅ Receive params from navigation
  const { 
    storeId, 
    storeName, 
    title,
    productCount 
  } = route.params || {};
  
  // ✅ Initialize filters with storeId if available
  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    
    // Add storeId to filters if it exists
    if (storeId) {
      initialFilters.store = storeId;
      console.log('✅ Store filter applied:', storeId);
    }
    
    return initialFilters;
  });

  const fetchAndProcessProducts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setNoResults(false);
    setError(null);
    
    try {
      console.log('📡 Fetching products with filters:', filters);
      
      const res = await productService.getFlashDeals(page, filters);
      const fetchedData = res.data?.data?.products || [];

      console.log(`📦 Fetched ${fetchedData.length} products`);

      if (fetchedData.length === 0 && page > 1) {
        return fetchAndProcessProducts(page - 1);
      }

      if (fetchedData.length === 0) {
        setNoResults(true);
      }
      
      setProductData(fetchedData);
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      setError('Failed to load products. Pull to refresh.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAndProcessProducts();
  };

  // ✅ Fetch products when filters change or component mounts
  useEffect(() => {
    fetchAndProcessProducts();
  }, [fetchAndProcessProducts]); // Refetch when filters change

  // ✅ Update filters when storeId changes (if navigating with new params)
  useEffect(() => {
    if (storeId) {
      setFilters(prevFilters => ({
        ...prevFilters,
        store: storeId
      }));
    }
  }, [storeId]);

  // Loading State
  if (isLoading && !refreshing) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[defaultStyleSheet.main, styles.centerContent]}>
            <ActivityIndicator size="large" color={colors.colorPrimary} />
            <Text style={styles.loadingText}>
              {storeId ? `Loading ${storeName || 'store'} deals...` : 'Loading amazing deals...'}
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Error State
  if (error && productData.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            style={defaultStyleSheet.main}
            contentContainerStyle={styles.centerContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={[colors.colorPrimary]} 
                tintColor={colors.colorPrimary}
              />
            }
          >
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorSubText}>Pull down to try again</Text>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Empty State
  if (noResults) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <LinearGradient
            colors={[colors.colorPrimaryLite, colors.colorPrimary]}
            style={styles.banner}
          >
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <IconComponent
                name="arrow-back"
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
            <View style={styles.bannerTextContainer}>
              <Text allowFontScaling={false} style={styles.bannerTitle}>
                {storeName ? `${storeName} Deals` : '⚡ Flash Deals'}
              </Text>
              <Text allowFontScaling={false} style={styles.bannerSubtitle}>
                {storeId ? 'Exclusive store offers' : 'Limited time offers • Grab them fast!'}
              </Text>
            </View>
          </LinearGradient>

          <ScrollView
            style={defaultStyleSheet.main}
            contentContainerStyle={styles.centerContent}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={[colors.colorPrimary]}
                tintColor={colors.colorPrimary}
              />
            }
          >
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.noResultsText}>
              {storeId ? `No Deals from ${storeName}` : 'No Flash Deals Available'}
            </Text>
            <Text style={styles.noResultsSubText}>Check back soon for exciting offers!</Text>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Main Content
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header Banner */}
        <LinearGradient
          colors={[colors.colorPrimaryLite, colors.colorPrimary]}
          style={styles.banner}
        >
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <IconComponent
              name="arrow-back"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
          <View style={styles.bannerTextContainer}>
            <Text allowFontScaling={false} style={styles.bannerTitle}>
              {storeName ? `${storeName} Deals` : '⚡ Flash Deals'}
            </Text>
            <Text allowFontScaling={false} style={styles.bannerSubtitle}>
              {storeId 
                ? `${productData.length} exclusive offers available` 
                : 'Limited time offers • Grab them fast!'}
            </Text>
          </View>
          
          {/* Clear Filter Button (if store filter is active) */}
          {storeId && (
            <TouchableOpacity 
              onPress={() => {
                setFilters({});
                navigation.setParams({ storeId: null, storeName: null });
              }}
              style={styles.clearFilterButton}
            >
              <IconComponent
                name="close-circle"
                type="Ionicons"
                size={22}
                color={colors.white}
              />
            </TouchableOpacity>
          )}
        </LinearGradient>

        <ScrollView 
          style={[defaultStyleSheet.main, styles.scrollView]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.colorPrimary]}
              tintColor={colors.colorPrimary}
            />
          }
        >
          {/* Store Info Badge (if filtered by store) */}
          {storeId && (
            <View style={styles.filterBadgeContainer}>
              <View style={styles.filterBadge}>
                <IconComponent
                  family ="ionicons"
                  name="storefront"
                  size={16}
                  color={colors.colorPrimary}
                />
                <Text style={styles.filterBadgeText}>
                  Showing deals from {storeName}
                </Text>
              </View>
            </View>
          )}

          {/* Products Grid */}
          <View style={styles.container}>
            {productData.map((item) => (
              <DealsItem key={item._id} item={item} itemWidth={itemWidth} />
            ))}
          </View>

          {/* Footer Spacing */}
          <View style={styles.footer} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Helper function to calculate item width based on screen size
const calculateItemWidth = (screenWidth) => {
  const padding = 16;
  const spacing = 8;
  
  let numColumns;
  if (screenWidth > 1200) {
    numColumns = 5;
  } else if (screenWidth > 900) {
    numColumns = 4;
  } else if (screenWidth > 600) {
    numColumns = 3;
  } else if (screenWidth > 400) {
    numColumns = 2;
  } else {
    numColumns = 2;
  }
  
  return (screenWidth - padding * 2 - spacing * (numColumns - 1)) / numColumns;
};

export default FlashDeals;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.white,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  banner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  backButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.95,
    fontWeight: '500',
  },
  clearFilterButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  filterBadgeContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  filterBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.red,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  footer: {
    height: 32,
  },
});