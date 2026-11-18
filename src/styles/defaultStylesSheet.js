import {Dimensions, Platform, StyleSheet} from 'react-native';
import {colors} from '../utils/color';

const defaultStyleSheet = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.colorPrimaryLite,
  },
  txtInputWrapper: {
    paddingStart: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
  },
  txtInputErrorWrapper: {
    paddingStart: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
  },
  txtInputValidWrapper: {
    paddingStart: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    borderRadius: 5,
    height: 50,
  },
  cardShadow: {
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.06)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 4,
          shadowRadius: 4,
          elevation: 1,
        }),
  },
  inputLabel: {
    marginStart: 10,
    marginTop: 12,
    fontSize: 18,
    color: colors.black,
    fontWeight: '600',
  },
  formContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: Platform.OS === 'web' ? '5vh' : 0,
    ...(Platform.OS === 'web' && {
      position: 'relative',
      zIndex: 1,
    }),
  },
  txtInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    padding: 20,
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  },
  errorText: {
    color: colors.red,
    fontFamily: 'serif',
    marginStart: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  shadowProvider: {
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.25)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 0.5,
        }),
  },
  submitButtonContainer: {
    backgroundColor: colors.colorPrimary,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
  },
  removeButtonContainer: {
    backgroundColor: colors.red,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    width: '100%',
    padding: 30,
    maxWidth: 720,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.black,
  },
  whatsappShareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    margin: 10,
    flex: 1,
    backgroundColor: colors.colorPrimary,
    borderRadius: 25,
    overflow: 'hidden',
  },
  referShareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    margin: 10,
    flex: 1,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.colorPrimary,
    borderRadius: 25,
  },
  formContainerWeb: {
    padding: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    margin: 5,
  },
  inputWeb: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    marginBottom: 5,
    flex: 1,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },
  gradientButtonBase: {
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonLight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.colorPrimaryLite,
  },
  badgeGradient: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  earnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
  },
  earnText: {
    fontWeight: '800',
    marginLeft: 4,
  },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  
  // ==========================================
  // NEW REUSABLE STYLES - ENHANCED UI
  // ==========================================
  
  // Glass Morphism Effect
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(10px)',
        }
      : {}),
  },
  
  // Premium Card Shadow
  premiumCardShadow: {
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }),
  },
  
  // Gradient Overlay for Images
  imageGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  
  // Shimmer Effect Container
  shimmerContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  
  // Icon Circle with Gradient Background
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  // Action Button Style
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }),
  },
  
  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }),
  },
  
  // Premium Badge
  premiumBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  // Divider with Gradient
  dividerGradient: {
    height: 1,
    width: '100%',
  },
  
  // Status Indicator with Pulse
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  // Pill Button Style
  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Card Header
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  
  // Card Body
  cardBody: {
    padding: 16,
  },
  
  // Card Footer
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  
  // Info Badge
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 104, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  
  // Success Badge
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  
  // Warning Badge
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  
  // Gradient Text Container
  gradientTextContainer: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  
  // Pulse Animation Container
  pulseContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  whatsappButton: {
    flexDirection: 'row',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.whatsappPrimaryLite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    gap:4
  },
  notificationUnreadCard: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 3,
    borderLeftColor: colors.colorPrimary,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default defaultStyleSheet;