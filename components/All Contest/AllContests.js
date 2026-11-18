import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import { colors } from '../../src/utils/color';
import AllContestItem from './AllContestItem';
import axios from 'axios'; // Assuming axios is used for API calls
import { bannerService } from '../../api/services/banner.service';

const AllContests = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [numColumns, setNumColumns] = useState(1);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async (page = 1) => {
      try {
        setLoading(true);
        const response = await bannerService.list(page = 1,{}); // Adjust API endpoint as needed
       console.log("this is respo",response);
       
        if (response.data.success) {
          // Transform API data to match expected format for AllContestItem
          const transformedData = response.data.data.bannerData.map(item => ({
            id: item._id,
            title: item.name,
            image: item.image,
            status: item.status === 'active' ? 'live' : item.status, // Map 'active' to 'live' for consistency
            url: item.url,
            category: item.category.name
          }));
          setBannerData(transformedData);
        } else {
          setError('Failed to fetch banners');
        }
      } catch (err) {
        setError('Error fetching banners: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Update layout on window resize
  useEffect(() => {
    const updateLayout = () => {
      const width = Dimensions.get('window').width;
      setWindowWidth(width);
      
      if (width > 1024) {
        const columns = Math.floor(width / 320);
        setNumColumns(columns);
      } else {
        setNumColumns(1);
      }
    };

    updateLayout();
    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  }, []);

  // Filter the bannerData based on selectedFilter
  const filteredData = bannerData.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'live') return item.status === 'live';
    if (selectedFilter === 'expired') return item.status === 'expired';
    return false;
  });

  // Handle loading and error states
  if (loading) {
    return (
      <View style={defaultStyleSheet.main}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={defaultStyleSheet.main}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={defaultStyleSheet.main}>
      <View style={styles.filterContainer}>
        <TouchableHighlight
          style={styles.filterButton}
          onPress={() => setSelectedFilter('all')}>
          <Text
            style={[
              selectedFilter === 'all'
                ? styles.selectdFilterContest
                : styles.filterContest,
              defaultStyleSheet.shadowProvider,
            ]}>
            All Contests
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.filterButton}
          onPress={() => setSelectedFilter('live')}>
          <Text
            style={[
              selectedFilter === 'live'
                ? styles.selectdFilterContest
                : styles.filterContest,
              defaultStyleSheet.shadowProvider,
            ]}>
            Live Now
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.filterButton}
          onPress={() => setSelectedFilter('expired')}>
          <Text
            style={[
              selectedFilter === 'expired'
                ? styles.selectdFilterContest
                : styles.filterContest,
              defaultStyleSheet.shadowProvider,
            ]}>
            Expired
          </Text>
        </TouchableHighlight>
      </View>
      
      <FlatList 
        data={filteredData}
        renderItem={({ item }) => (
          <View style={[
            styles.itemContainer,
            { width: windowWidth > 1024 ? `${100/numColumns}%` : '100%' }
          ]}>
            <AllContestItem item={item} />
          </View>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        key={numColumns}
      />
    </View>
  );
};

export default AllContests;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 5,
  },
  filterButton: {
    margin: 5,
    borderRadius: 50,
  },
  filterContest: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 50,
  },
  selectdFilterContest: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.colorPrimary,
    color: colors.white,
    borderColor: colors.colorPrimary,
    borderRadius: 50,
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    padding: 5,
  },
});