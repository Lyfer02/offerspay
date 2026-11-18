import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { isWeb, useResponsive } from '../src/utils/dimension';
import { colors } from '../src/utils/color';
import IconComponent from './IconComponent';


const ClickHistoryItem = ({
  item,
  formatDate,
  formatTime,
  handleLinkPress,
  handleCopyLink,
  numColumns,
  gap = 16,
}) => {
  const dimensions = useResponsive();

  // Calculate responsive width
  const itemStyles = useMemo(() => {
    const isDesktop = dimensions.isDesktop;
    const isTablet = dimensions.isTablet;
    const screenWidth = dimensions.width;

    // Calculate available width considering side panel
    let availableWidth = screenWidth;
    
    if (isDesktop) {
      // Desktop: 30% side panel, 70% content area
      availableWidth = screenWidth * 0.70;
    }

    // Calculate padding
    const containerPadding = isDesktop ? 40 : isTablet ? 30 : 20;
    const contentWidth = availableWidth - (containerPadding * 2);

    // Calculate item width based on columns
    let itemWidth = contentWidth;
    
    if (numColumns > 1) {
      const totalGapWidth = gap * (numColumns - 1);
      const availableItemWidth = contentWidth - totalGapWidth;
      itemWidth = Math.floor(availableItemWidth / numColumns);
    }

    return {
      width: numColumns > 1 ? itemWidth : '100%',
      maxWidth: numColumns > 1 ? itemWidth : '100%',
      minWidth: numColumns > 1 ? itemWidth : '100%',
    };
  }, [dimensions, numColumns, gap]);

  const styles = useMemo(() => {
    return StyleSheet.create({
      card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 10,
        marginBottom: gap,
        shadowColor: colors.black,
       
        justifyContent: 'space-between',
        ...itemStyles,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...(isWeb && { cursor: 'default' }),
      },
      cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
      },
      nameContainer: {
        flex: 1,
        marginRight: 10,
      },
      name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        lineHeight: 22,
      },
      badge: {
        backgroundColor: '#f0f7ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
      },
      badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.colorPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      detailsSection: {
        gap: 10,
      },
      detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      },
      iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
      },
      detailText: {
        fontSize: 12,
        color: '#475569',
        fontWeight: '500',
        flex: 1,
      },
    });
  }, [gap, itemStyles]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <Text
          
      allowFontScaling={false}
          style={styles.name} numberOfLines={2}>
            {item?.oid?.name || 'Unknown Offer'}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text 
      allowFontScaling={false} style={styles.badgeText}>Click</Text>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.iconWrapper}>
            <IconComponent name="calendar" size={16} color={colors.colorPrimary} />
          </View>
          <Text 
      allowFontScaling={false}
      style={styles.detailText}>
            {formatDate(item.clickedAt)}
          </Text>
          <View style={styles.iconWrapper}>
            <IconComponent name="time" size={16} color={colors.colorPrimary} />
          </View>
          <Text 
      allowFontScaling={false} style={styles.detailText}>
            {formatTime(item.clickedAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(ClickHistoryItem);