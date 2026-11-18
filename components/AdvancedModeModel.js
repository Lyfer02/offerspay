// src/components/AdvancedModeModal.js
import React, { useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../src/utils/color';
import IconComponent from './IconComponent';
import LinearGradient from 'react-native-linear-gradient';


const AdvancedModeModal = ({ visible, onClose, onSwitch }) => {
  const [isModalEnabled, setIsModalEnabled] = useState(false);

  const handleToggle = (value) => setIsModalEnabled(value);

  const handleSwitch = () => {
    onSwitch(isModalEnabled);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.content}>
              {/* Close */}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <IconComponent name="close" size={24} color={colors.gray} />
              </TouchableOpacity>

              {/* Icon */}
              <View style={styles.iconCircle}>
                <IconComponent name="flash-outline" size={32} color={colors.colorPrimary} />
              </View>

              <Text allowFontScaling={false} style={styles.title}>Advanced Mode</Text>
              <Text allowFontScaling={false} style={styles.description}>
                This mode is dedicated for Telegram users. Switch to this mode if you want
                to use features like Bitly converter, post scheduling, or if you have
                multiple Telegram accounts.
              </Text>

              <View style={styles.divider} />

              <Text allowFontScaling={false} style={styles.subtitle}>Set as Default Mode</Text>

              <View style={styles.radioGroup}>
                {[
                  { label: 'Enable by Default', value: true },
                  { label: 'Ask Every Time', value: false },
                ].map((opt) => (
                  <TouchableOpacity
                    key={opt.value.toString()}
                    style={styles.radioRow}
                    onPress={() => handleToggle(opt.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.radioCircle,
                        isModalEnabled === opt.value && styles.radioCircleSelected,
                      ]}
                    >
                      {isModalEnabled === opt.value && <View style={styles.radioDot} />}
                    </View>
                    <Text allowFontScaling={false}
                      style={[
                        styles.radioLabel,
                        isModalEnabled === opt.value && styles.radioLabelActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
                <LinearGradient 
                 colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                 style={styles.primaryBtn}
                >
              <TouchableOpacity 
              style={{flexDirection:'row',gap:8, paddingVertical:12 ,alignItems:'center',justifyContent:'center' }}
               onPress={handleSwitch}>
                <IconComponent name="flash" size={20} color={colors.white} />
                <Text allowFontScaling={false} style={styles.primaryBtnText}>Switch to Advanced Mode</Text>
              </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AdvancedModeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 460,
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    position: 'relative',
    ...Platform.select({
      web: { cursor: 'default' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(25,118,210,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom:4
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'justify',
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
  subtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 16, color: colors.black },
  radioGroup: { gap: 12, marginBottom: 24 },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircleSelected: { borderColor: colors.colorPrimary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.colorPrimary },
  radioLabel: { fontSize: 12, color: '#666', fontWeight: '500' },
  radioLabelActive: { color: colors.black, fontWeight: '600' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorPrimary,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      web: { cursor: 'pointer', transition: 'background-color 0.2s' },
      ios: { shadowColor: colors.colorPrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  primaryBtnText: { color: colors.white, fontSize: 14, fontWeight: '700' },
});