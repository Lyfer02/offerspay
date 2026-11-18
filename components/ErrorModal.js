// components/ErrorModal.js (FINAL VERSION)

import React, { useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Animated,
  Platform
} from 'react-native';
import IconComponent from './IconComponent';  // ← Your existing IconComponent
import { colors } from '../src/utils/color';

const ErrorModal = ({ 
  visible, 
  message, 
  title = "Alert", 
  onClose, 
  onConfirm,
  showCancel = true,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "error",
  icon = null,           // ← e.g., "wifi-off", "wifi", "check-circle"
  iconFamily = "material", // default family
  iconSize = 28,
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [scaleValue, visible]);

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const getColorByType = () => {
    switch (type) {
      case "success": return "#10B981";
      case "warning": return "#F59E0B";
      case "info": return "#3B82F6";
      default: return "#EF4444";
    }
  };

  const getBackgroundByType = () => {
    switch (type) {
      case "success": return "#ECFDF5";
      case "warning": return "#FFFBEB";
      case "info": return "#EFF6FF";
      default: return "#FEF2F2";
    }
  };

  const accentColor = getColorByType();

  return (
    <Modal transparent={true} visible={visible} animationType="fade" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={showCancel ? onClose : undefined}>
        <View style={styles.modalBackground}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [{ scale: scaleValue }],
                backgroundColor: getBackgroundByType(),
                borderTopColor: accentColor,
              }
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>

                {/* Icon Section - Only show if icon is passed */}
                {icon && (
                  <View style={[styles.iconContainer, { backgroundColor: accentColor }]}>
                    <IconComponent
                      name={icon}
                      size={iconSize}
                      color="white"
                      family={iconFamily}
                    />
                  </View>
                )}

                {/* Title & Message */}
                <View style={styles.textContainer}>
                  <Text allowFontScaling={false} style={styles.modalTitle}>
                    {title}
                  </Text>
                  <Text allowFontScaling={false} style={styles.modalMessage}>
                    {message}
                  </Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  {showCancel && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={onClose}
                      style={[styles.button, styles.cancelButton]}
                    >
                      <Text allowFontScaling={false} style={styles.cancelButtonText}>
                        {cancelText}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleConfirm}
                    style={[
                      styles.button, 
                      styles.confirmButton,
                      { backgroundColor: accentColor },
                      !showCancel && styles.singleButton
                    ]}
                  >
                    <Text allowFontScaling={false} style={styles.confirmButtonText}>
                      {confirmText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    minWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 28,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  singleButton: { flex: 1 },
  cancelButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  confirmButton: {},
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ErrorModal;