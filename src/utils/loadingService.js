// src/utils/LoadingService.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, Modal, Platform } from 'react-native';
import { colors } from './color';

let setLoading = null;

export const LoadingService = {
  show: (message = "Loading...") => {
    if (setLoading) {
      setLoading({ visible: true, message });
    }
  },

  hide: () => {
    if (setLoading) {
      setLoading({ visible: false, message: "" });
    }
  },

  // Internal use only — called from App.js
  _setCallback: (callback) => {
    setLoading = callback;
  },
};

// Global Loader Component (Beautiful & Native)
export const GlobalLoadingOverlay = () => {
  const [state, setState] = React.useState({ visible: false, message: "Loading..." });

  // Register callback
useEffect(() => {
    LoadingService._setCallback(setState);
    return () => {
      LoadingService._setCallback(null);
    };
  }, []);

  if (!state.visible) return null;

  return (
    <Modal transparent animationType="fade" visible={state.visible}>
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={colors.colorPrimary} />
          <Text
          allowFontScaling={false}
          style={styles.loadingText}>{state.message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderBox: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.colorPrimary,
  },
});