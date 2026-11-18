import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import DealsItem from './DealsItem';
import { productService } from '../api/services/product.service';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/utils/color';
import IconComponent from './IconComponent';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const MostSharedDealsScreen = () => {
  const { width } = useWindowDimensions();
  const itemWidth = calculateItemWidth(width);
  const navigation =useNavigation();
  
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchAndProcessMostSharedDeals = async (page = 1, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    setNoResults(false);
    setError(null);
    
    try {
      const res = await productService.list(page);
      const fetchedData = res.data?.data?.products || [];
      const pagination = res.data?.data?.pagination || {};

      if (fetchedData.length === 0 && page === 1) {
        setNoResults(true);
      }

      if (append) {
        setProductData(prev => [...prev, ...fetchedData]);
      } else {
        setProductData(fetchedData);
      }

      setCurrentPage(pagination.currentPage || 1);
      setTotalPages(pagination.totalPages || 1);
      setHasNextPage(pagination.hasNextPage || false);
      setHasPrevPage(pagination.hasPrevPage || false);
    } catch (error) {
      console.error('Failed to fetch most shared deals:', error);
      setError('Failed to load most shared deals');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasNextPage) {
      fetchAndProcessMostSharedDeals(currentPage + 1, true);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchAndProcessMostSharedDeals(1, false);
  };

  useEffect(() => {
    fetchAndProcessMostSharedDeals(1, false);
  }, []);

  if (isLoading && !refreshing && productData.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}}>
      <View style={[defaultStyleSheet.main, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.colorPrimary} />
        <Text style={styles.loadingText}>Loading trending deals...</Text>
      </View>
      </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (error && productData.length === 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}}>
      <ScrollView
        style={defaultStyleSheet.main}
        contentContainerStyle={styles.centerContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[colors.colorPrimary]} 
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

  if (noResults) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1}}>
      <ScrollView
        style={defaultStyleSheet.main}
        contentContainerStyle={styles.centerContent}

        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[colors.colorPrimary]} 
          />
        }
      >
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.noResultsText}>No Shared Deals Available</Text>
        <Text style={styles.noResultsSubText}>Be the first to share!</Text>
      </ScrollView>
      </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
         {/* Header Banner */}
         <LinearGradient
          colors={[colors.colorPrimaryLite, colors.colorPrimary]}
         style={styles.banner}>

        
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
           <View>
            <Text allowFontScaling={false} style={styles.bannerTitle}>📈 Most Shared Deals</Text>
            <Text allowFontScaling={false} style={styles.bannerSubtitle}>
              Deals loved by our community
            </Text>
            </View>
            
          </LinearGradient>
        
        <ScrollView 
          style={defaultStyleSheet.main}
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
         

          {/* Products Grid */}
          <View style={styles.container}>
            {productData.map((item) => (
              <DealsItem key={item._id} item={item} itemWidth={itemWidth} />
            ))}
          </View>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={styles.paginationContainer}>
              <Text style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </Text>
              
              {hasNextPage && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Text style={styles.loadMoreText}>Load More</Text>
                      <IconComponent 
                        name="arrow-down" 
                        size={18} 
                        color={colors.white} 
                        family="ionicons" 
                      />
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.footer} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

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

export default MostSharedDealsScreen;

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: colors.colorPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection:'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
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
    marginRight: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
    marginHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubText: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
  paginationContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.colorPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    minWidth: 140,
    justifyContent: 'center',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  footer: {
    height: 32,
  },
});