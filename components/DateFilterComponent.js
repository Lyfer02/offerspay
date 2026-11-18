// src/components/DateFilterModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import IconComponent from './IconComponent';
import { colors } from '../src/utils/color';
import CustomDatePicker from './CustomDatePicker';

const DateFilterModal = ({
  isVisible,
  onClose,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  selectedFilter,
  setSelectedFilter,
  onApply,
  formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  },
}) => {
  const [tempFrom, setTempFrom] = useState(fromDate);
  const [tempTo, setTempTo] = useState(toDate);

  const presets = [
    { key: 'Today', label: 'Today', icon: 'today' },
    { key: 'Yesterday', label: 'Yesterday', icon: 'history' },
    { key: 'This Week', label: 'This Week', icon: 'date-range' },
    { key: 'This Month', label: 'This Month', icon: 'calendar-month' },
    { key: 'Last Month', label: 'Last Month', icon: 'calendar-today' },
  ];

  const applyPreset = (key) => {
    setSelectedFilter(key);
    const now = new Date();
    let newFrom = new Date(now);
    let newTo = new Date(now);

    // Normalize helpers
    const startOfDay = (d) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return dt;
    };
    const endOfDay = (d) => {
      const dt = new Date(d);
      dt.setHours(23, 59, 59, 999);
      return dt;
    };

    switch (key) {
      case 'Today':
        newFrom = startOfDay(now);
        newTo = endOfDay(now);
        break;

      case 'Yesterday': {
        const y = new Date(now);
        y.setDate(now.getDate() - 1);
        newFrom = startOfDay(y);
        newTo = endOfDay(y);
        break;
      }

      case 'This Week': {
        const first = new Date(now);
        const day = first.getDay(); // Sunday = 0
        first.setDate(first.getDate() - day);
        newFrom = startOfDay(first);
        newTo = endOfDay(now);
        break;
      }

      case 'This Month': {
        newFrom = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
        newTo = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        break;
      }

      case 'Last Month': {
        newFrom = startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1));
        newTo = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
        break;
      }

      default:
        newFrom = startOfDay(now);
        newTo = endOfDay(now);
    }

    setTempFrom(newFrom);
    setTempTo(newTo);
  };

  const applyDates = () => {
    // Always normalize the chosen range before applying
    const startOfDay = (d) => {
      const dt = new Date(d);
      dt.setHours(0, 0, 0, 0);
      return dt;
    };
    const endOfDay = (d) => {
      const dt = new Date(d);
      dt.setHours(23, 59, 59, 999);
      return dt;
    };

    const normalizedFrom = startOfDay(tempFrom);
    const normalizedTo = endOfDay(tempTo);

    setFromDate(normalizedFrom);
    setToDate(normalizedTo);
    onApply();
  };

  const resetTemps = () => {
    setTempFrom(fromDate);
    setTempTo(toDate);
    setSelectedFilter(null);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconWrapper}>
                <IconComponent 
                  name="filter" 
                  size={22} 
                  color={colors.colorPrimary} 
                />
              </View>
              <Text 
              allowFontScaling={false}
              style={styles.title}>Filter by Date</Text>
            </View>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconComponent name="close" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Quick Filters Section */}
            <View style={styles.section}>
              <Text
              allowFontScaling={false}
              style={styles.sectionLabel}>Quick Filters</Text>
              <View 
              
              style={styles.presetsGrid}>
                {presets.map((preset) => (
                  <TouchableOpacity
                    key={preset.key}
                    style={[
                      styles.presetChip,
                      selectedFilter === preset.key && styles.presetChipActive,
                    ]}
                    onPress={() => applyPreset(preset.key)}
                    activeOpacity={0.7}
                  >
                    <Text
                    allowFontScaling={false}
                      style={[
                        styles.presetText,
                        selectedFilter === preset.key && styles.presetTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                    {selectedFilter === preset.key && (
                      <View style={styles.checkmark}>
                        <IconComponent 
                          name="checkmark" 
                          size={14} 
                          color={colors.white} 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text 
              allowFontScaling={false}
              style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Custom Date Range Section */}
            <View style={styles.section}>
              <Text
              allowFontScaling={false}
              style={styles.sectionLabel}>Custom Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.datePickerWrapper}>
                  <Text 
                  allowFontScaling={false} style={styles.dateLabel}>From Date</Text>
                  <CustomDatePicker
                    selected={tempFrom}
                    onChange={setTempFrom}
                    label="From"
                    maxDate={tempTo || new Date()}
                  />
                </View>
                <View style={styles.arrowContainer}>
                  <IconComponent 
                    name="arrow-forward" 
                    size={20} 
                    color={colors.gray} 
                  />
                </View>
                <View style={styles.datePickerWrapper}>
                  <Text 
                  allowFontScaling={false}
                  style={styles.dateLabel}>To Date</Text>
                  <CustomDatePicker
                    selected={tempTo}
                    onChange={setTempTo}
                    label="To"
                    minDate={tempFrom}
                    maxDate={new Date()}
                  />
                </View>
              </View>
            </View>

            {/* Selected Range Info */}
            {tempFrom && tempTo && (
              <View style={styles.infoCard}>
                <IconComponent 
                  name="information-circle-outline" 
                  size={18} 
                  color={colors.colorPrimary} 
                />
                <Text 
                allowFontScaling={false}
                style={styles.infoText}>
                  Selected: {formatDate(tempFrom)} - {formatDate(tempTo)}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity 
              onPress={resetTemps} 
              style={styles.resetButton}
              activeOpacity={0.7}
            >
              <IconComponent name="refresh" size={18} color={colors.gray} />
              <Text 
              allowFontScaling={false}
              style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={applyDates} 
              style={styles.applyButton}
              activeOpacity={0.8}
            >
              <Text 
              allowFontScaling={false}
              style={styles.applyText}>Apply Filter</Text>
              <IconComponent name="checkmark" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
    }),
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: colors.white,
    width: '100%', 
    ...Platform.select({
      android: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        elevation: 8,
      },
      ios: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      web: {
        borderRadius: 20,
        maxWidth: 480,
        maxHeight: '85%',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.colorPrimary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  presetChipActive: {
    backgroundColor: colors.colorPrimary,
    borderColor: colors.colorPrimary,
    ...Platform.select({
      ios: {
        shadowColor: colors.colorPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: `0 4px 12px ${colors.colorPrimary}40`,
      },
    }),
  },
  presetText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  presetTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  checkmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    paddingHorizontal: 8,
  },
  dateRangeContainer: {
    ...Platform.select({
      android: {
        flexDirection: 'column',
        gap: 16,
      },
      default: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
    }),
  },
  datePickerWrapper: {
    ...Platform.select({
      android: {
        width: '100%',
      },
      default: {
        flex: 1,
      },
    }),
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: 6,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        marginVertical: 0,
        alignSelf: 'center',
      },
      default: {
        marginTop: 20,
      },
    }),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.colorPrimary}10`,
    borderLeftWidth: 3,
    borderLeftColor: colors.colorPrimary,
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.colorPrimary,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.colorPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: `0 4px 16px ${colors.colorPrimary}40`,
      },
    }),
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
});

export default DateFilterModal;