import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { isWeb, useResponsive } from '../src/utils/dimension';
import IconComponent from './IconComponent';
import { colors } from '../src/utils/color';
import LinearGradient from 'react-native-linear-gradient';

const LinkHistoryItem = ({
  item,
  formatDate,
  formatTime,
  handleLinkPress,
  handleCopyLink,
  numColumns,
  gap = 15,
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
      itemContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 12,
        marginBottom: numColumns > 1 ? gap : 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.lightGray,
        ...itemStyles,
        ...(isWeb && { cursor: 'default' }),
      },
      itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
      },
      offerName: {
        fontWeight: '700',
        fontSize: 16,
        color: colors.black,
        flex: 1,
        marginRight: 10,
      },
      clicksBadge: {
        backgroundColor: colors.colorPrimary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        flexShrink: 0,
      },
      clicksText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
      },
      itemRow: {
        flexDirection: 'row',
        marginBottom: 5,
      },
      label: {
        fontWeight: '600',
        color: colors.gray,
        fontSize:14,
        minWidth: 80,
        flexShrink: 0,
      },
      value: {
        flex: 1,
        fontSize:12,
        color: colors.black,
        flexShrink: 1,
      },
      actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
        flexWrap: 'wrap',
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 50,
        ...(isWeb && { cursor: 'pointer' }),
      },
      openButton: {
        backgroundColor: colors.colorPrimary,
      },
      copyButton: {
        backgroundColor: colors.gray,
      },
      buttonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
      },
    });
  }, [numColumns, gap, itemStyles]);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text
        allowFontScaling={false}
        style={styles.offerName} numberOfLines={2}>
          {item?.offer?.name || 'No Offer Name'}
        </Text>


        <LinearGradient 
        colors={[colors.colorPrimaryLite, colors.colorPrimary]}
        style={styles.clicksBadge}>
          <Text
          allowFontScaling={false}
          style={styles.clicksText}>
            {item?.clicks || 0} clicks
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.itemRow}>
        <Text 
        allowFontScaling={false}
        style={styles.label}>Store:</Text>
        <Text 
        allowFontScaling={false}
        style={styles.value}>{item?.store?.name || 'N/A'}</Text>
      </View>

      <View style={styles.itemRow}>
        <Text 
        allowFontScaling={false}
        style={styles.label}>URL:</Text>
        <Text 
        allowFontScaling={false}
        style={styles.value} numberOfLines={1}>
          {item?.shortUrl || 'N/A'}
        </Text>
      </View>

      <View style={styles.itemRow}>
        <Text
        allowFontScaling={false} 
        style={styles.label}>Code:</Text>
        <Text 
        allowFontScaling={false}
        style={styles.value}>{item?.shortCode || 'N/A'}</Text>
      </View>

      <View style={styles.itemRow}>
        <Text 
        allowFontScaling={false}
        style={styles.label}>Created:</Text>
        <Text 
        allowFontScaling={false}style={styles.value}>
          {formatDate(item.createdAt)} at {formatTime(item.createdAt)}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <LinearGradient
                      colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                      style={[styles.actionButton, styles.openButton]} 
                    >
        <TouchableOpacity
         activeOpacity={0.9}
         style={{flexDirection:'row', gap:4}}
          onPress={() => handleLinkPress(item.shortUrl)}
        >
          <IconComponent name="link" size={14} color={colors.white} />
          <Text allowFontScaling={false}
          style={styles.buttonText}>Open Link</Text>
        </TouchableOpacity>

        </LinearGradient>

        {isWeb && (
          <LinearGradient
          colors={[colors.colorPrimaryLite, colors.colorPrimary]}
          style={[styles.actionButton, styles.openButton]} 
        >
          <TouchableOpacity
            style={{flexDirection:'row', gap:4}}
            activeOpacity={0.9}
            onPress={() => handleCopyLink(item.shortUrl)}
          >
            <IconComponent name="copy" size={14} color={colors.white} />
            <Text allowFontScaling={false}
            style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

export default React.memo(LinkHistoryItem);