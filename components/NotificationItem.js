// NotificationItem.js
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import IconComponent from './IconComponent';
import { colors } from '../src/utils/color';

const NotificationItem = memo(({ item, onPress }) => {
  // Clean image URL (remove localhost references)
  const imageUrl = item.imageUrl && 
    !item.imageUrl.includes('localhost') && 
    item.imageUrl.startsWith('http')
      ? item.imageUrl
      : null;

  const isUnread = !item.isSeen;

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

  return (
    <TouchableOpacity
    activeOpacity={0.8}
      style={[
        styles.notificationCard,
        isUnread && styles.unreadNotification,
      ]}
      onPress={() => onPress(item)}
      >
      <View style={styles.notificationContent}>
        {/* Icon or Image */}
        {imageUrl ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.notificationImage}
              resizeMode="cover"
            />
            {isUnread && <View style={styles.imageBadge} />}
          </View>
        ) : (
          <View style={[
            styles.notificationIconContainer,
            isUnread && styles.unreadIconContainer
          ]}>
            <IconComponent
              name={item.type === 'broadcast' ? 'megaphone' : 'gift'}
              size={24}
              color={isUnread ? colors.colorPrimary : colors.gray}
              family="ionicons"
            />
            {isUnread && <View style={styles.iconBadge} />}
          </View>
        )}

        {/* Text Content */}
        <View style={styles.notificationTextContainer}>
          <View style={styles.notificationHeader}>
            <Text allowFontScaling={false}
              style={[
                styles.notificationTitle,
                isUnread && styles.unreadTitle
              ]} 
              numberOfLines={2}>
              {item.title}
            </Text>
          </View>

          <Text allowFontScaling={false} style={styles.notificationBody} numberOfLines={2}>
            {item.body}
          </Text>

          <View style={styles.notificationFooter}>
            <Text allowFontScaling={false} style={styles.notificationTime}>
              {formatDate(item.sentAt)}
            </Text>
            {item.type === 'specific' && (
              <View style={styles.typeBadge}>
                <Text allowFontScaling={false} style={styles.typeBadgeText}>Personal</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Arrow Icon */}
      {/* <IconComponent
        name="chevron-forward"
        size={20}
        color={isUnread ? colors.colorPrimary : colors.gray}
        family="ionicons"
      /> */}
    </TouchableOpacity>
  );
});

NotificationItem.displayName = 'NotificationItem';

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    elevation:1,
    borderBottomColor: '#F0F0F0',
  },
  unreadNotification: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 3,
    borderLeftColor: colors.colorPrimary,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
  },
  imageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.colorPrimary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  notificationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadIconContainer: {
    backgroundColor: colors.colorPrimaryLite + '30',
  },
  iconBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.colorPrimary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '700',
    color: colors.black,
  },
  notificationBody: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 6,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTime: {
    fontSize: 10,
    color: colors.gray,
  },
  typeBadge: {
    backgroundColor: colors.colorPrimaryLite + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontSize: 10,
    color: colors.colorPrimary,
    fontWeight: '600',
  },
});

export default NotificationItem;