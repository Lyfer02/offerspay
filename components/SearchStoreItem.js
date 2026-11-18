import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Star, DollarSign } from 'lucide-react-native';
import { colors } from '../src/utils/color';

const SearchStoreItem = ({ item }) => {
    
  const renderRating = (rating) => {
    if (!rating || rating === 0) return null;
    
    return (
      <View style={styles.ratingContainer}>
        <Star size={12} color="#FFD700" fill="#FFD700" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderEarnings = (earnings) => {
    if (!earnings || earnings === '₹0') return null;
    
    return (
      <View style={styles.earningsContainer}>
        <DollarSign size={12} color={colors.green} />
        <Text style={styles.earningsText}>{earnings}</Text>
      </View>
    );
  };

  const renderStatus = (status) => {
    if (!status) return null;
    
    const statusColor = status.toLowerCase() === 'active' ? colors.green : colors.red;
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {status}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Store Image */}
      <View style={styles.imageContainer}>
        {item.image?.uri ? (
          <Image 
            source={item.image} 
            style={styles.storeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {item.name?.charAt(0)?.toUpperCase() || 'S'}
            </Text>
          </View>
        )}
        {item.new && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>

      {/* Store Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.storeName} numberOfLines={1}>
            {item.name}
          </Text>
          {renderStatus(item.status)}
        </View>

        <Text style={styles.storeDescription} numberOfLines={2}>
          {item.description || item.about || 'No description available'}
        </Text>

        <View style={styles.metaRow}>
          {renderRating(item.rating)}
          {renderEarnings(item.earn)}
          {item.rating && item.earn && <View style={styles.divider} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  storeImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.colorPrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.colorPrimary,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.red,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 50,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  storeDescription: {
    fontSize: 13,
    color: colors.gray,
    lineHeight: 18,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B8860B',
    marginLeft: 2,
  },
  earningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green + '10',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  earningsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green,
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default SearchStoreItem;