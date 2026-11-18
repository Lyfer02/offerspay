import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../../src/utils/color';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import Clipboard from '@react-native-clipboard/clipboard';
import IconComponent from '../../components/IconComponent';
import {PermissionsAndroid} from 'react-native';
import { useAuth } from '../../navigation/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { trackingService } from '../../api/services/tracking.service';
import { ErrorModalService } from '../../src/utils/modalService';
import { shareLink, shareToWhatsApp } from '../../src/utils/commonFunctions_one';
import { launchImageLibrary } from 'react-native-image-picker';

const Converter = () => {
    const navigation = useNavigation();
    const inputLinkRef = useRef(null);
    const { user, isLoggedIn, logout } = useAuth();
    
    const [productLink, setProductLink] = useState('');
    const [convertedProductLink, setConvertedProductLink] = useState('');
    const [isWideScreen, setIsWideScreen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
  
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => {
      setIsModalVisible(false);
      setImageUrl('');
      setSelectedImage(null);
    };
  
    const handleJwtExpired = async () => {
      await logout();
      ErrorModalService.error('Your session has expired. Please log in again.');
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }, 1500);
    };
  
    const requestStoragePermission = async () => {
      if (Platform.OS !== 'android') return true;
      try {
        const permission = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Photo Access',
          message: 'App needs access to your photos.',
          buttonNeutral: 'Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
       // console.warn(err);
        return false;
      }
    };
  
    const handleWebImageSelect = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedImage({
          uri: URL.createObjectURL(file),
          type: file.type,
          name: file.name,
        });
      }
    };

    const renderModalContent = () => (
      <View style={[styles.modalContainer, defaultStyleSheet.shadowProvider]}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderIcon}>
            <IconComponent name="image" size={28} color={colors.colorPrimary} />
          </View>
          <Text style={styles.modalTitle}>Add Image</Text>
          <Text style={styles.modalSubtitle}>Choose an image from URL or device</Text>
          <TouchableOpacity onPress={closeModal} style={styles.modalCloseIcon}>
            <IconComponent name="close" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
  
        {/* Image Preview or Upload Options */}
        {selectedImage ? (
          <View style={styles.imagePreviewSection}>
            <View style={styles.imagePreviewWrapper}>
              <Image
                source={{uri: selectedImage.uri}}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  style={styles.removeImageButton}
                  activeOpacity={0.8}
                  onPress={() => setSelectedImage(null)}>
                  <IconComponent name="trash" size={20} color={colors.white} />
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.imageNameText} numberOfLines={1}>
              {selectedImage.name || 'Selected Image'}
            </Text>
          </View>
        ) : (
          <View style={styles.uploadOptionsContainer}>
            {/* URL Input Option */}
            <View style={styles.uploadOption}>
              <View style={styles.optionIconContainer}>
                <IconComponent name="link" size={24} color={colors.colorPrimary} />
              </View>
              <Text style={styles.optionTitle}>Paste Image URL</Text>
              <View style={styles.urlInputWrapper}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={colors.gray}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
                {imageUrl.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearUrlButton}
                    onPress={() => setImageUrl('')}>
                    <IconComponent name="close-circle" size={20} color={colors.gray} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
  
            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
  
            {/* Device Upload Option */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.uploadOption}
              onPress={handleImageSelection}>
              <View style={styles.deviceUploadButton}>
                <View style={styles.uploadIconContainer}>
                  <IconComponent name="cloud-upload" size={40} color={colors.colorPrimary} />
                </View>
                <Text style={styles.uploadTitle}>
                  {Platform.OS === 'web' ? 'Choose from Computer' : 'Select from Gallery'}
                </Text>
                <Text style={styles.uploadSubtitle}>
                  {Platform.OS === 'web' 
                    ? 'Browse and select an image file'
                    : 'Pick an image from your device'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
  
        {Platform.OS === 'web' && (
          <input
            type="file"
            accept="image/*"
            onChange={handleWebImageSelect}
            ref={fileInputRef}
            style={{display: 'none'}}
          />
        )}
  
        {/* Action Buttons */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.cancelButton}
            onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.confirmButton,
              (!selectedImage && !imageUrl) && styles.confirmButtonDisabled,
            ]}
            disabled={!selectedImage && !imageUrl}
            onPress={closeModal}>
            <IconComponent 
              name="checkmark-circle" 
              size={20} 
              color={(!selectedImage && !imageUrl) ? colors.gray : colors.white} 
            />
            <Text style={[
              styles.confirmButtonText,
              (!selectedImage && !imageUrl) && styles.confirmButtonTextDisabled,
            ]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
    const handleImageSelection = async () => {
      if (Platform.OS === 'web') {
        fileInputRef.current?.click();
        return;
      }
      const ok = await requestStoragePermission();
      if (!ok) {
        ErrorModalService.error('Storage permission denied.');
        return;
      }
      try {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
        if (!result.didCancel && result.assets?.[0]) {
          const a = result.assets[0];
          setSelectedImage({
            uri: a.uri,
            type: a.type,
            name: a.fileName || 'image.jpg',
          });
        }
      } catch {
        ErrorModalService.error('Failed to pick image');
      }
    };
  
    useEffect(() => {
      const update = () => setIsWideScreen(Dimensions.get('window').width > 768);
      update();
      const sub = Dimensions.addEventListener('change', update);
      return () => sub?.remove();
    }, []);
  
    useEffect(() => {
      if (copySuccess) {
        const t = setTimeout(() => setCopySuccess(false), 2000);
        return () => clearTimeout(t);
      }
    }, [copySuccess]);
  
    const clearInputLink = () => {
      setProductLink('');
      inputLinkRef.current?.clear?.();
      setConvertedProductLink('');
    };
  
    const convertLink = async () => {
      if (!productLink.trim()) {
        ErrorModalService.error('Please enter a link to convert');
        return;
      }
      if (!isLoggedIn || !user?.id) {
        ErrorModalService.error('Please login to generate earning links');
        return;
      }
  
      setIsConverting(true);
      try {
        const response = await trackingService.generateLink({
          userID: user.id,
          link: productLink.trim(),
        });
        const newLink = response?.data?.data?.short_url;
        if (!newLink) throw new Error('No tracking URL');
  
        setConvertedProductLink(newLink);
        setProductLink('');
  
        // GREEN SUCCESS MODAL
        ErrorModalService.success('Link generated successfully!');
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg?.toLowerCase() === 'jwt expired') {
          await handleJwtExpired();
          return;
        }
        ErrorModalService.error(msg || 'Failed to generate link');
      } finally {
        setIsConverting(false);
      }
    };
  
    const copyToClipboard = () => {
      if (!convertedProductLink) return;
      Clipboard.setString(convertedProductLink);
      setCopySuccess(true);
  
      // GREEN SUCCESS MODAL
      ErrorModalService.success('Link copied to clipboard!', {
        onClose: () => setCopySuccess(false),
      });
  
      setTimeout(() => {
        ErrorModalService.hide();
        setCopySuccess(false);
      }, 2000);
    };
  
    const shareReferralLink = async () => {
      if (!convertedProductLink) return;
      
        shareLink('', `Check this out: ${convertedProductLink}`);
      
    };
  
    const shareToWhat = async (link) => {
      if (!link) return;
    //  const url = `whatsapp://send?text=${encodeURIComponent(convertedProductLink)}`;
    //  const can = await Linking.canOpenURL(url);
     // if (can) await Linking.openURL(url);
      shareToWhatsApp(`this is demo testing + ${link}`)
     //else ErrorModalService.error('WhatsApp not installed');
    };
  
    const openTelegram = async () => {
      if (!convertedProductLink) return;
      const url = 'tg://';
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else ErrorModalService.error('Telegram not installed');
    };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.main, isWideScreen && styles.mainRow]}>
          {/* Input Section */}
          <View
            style={[
              styles.linkConverterContainer,
              defaultStyleSheet.shadowProvider,
              isWideScreen && styles.containerWide,
            ]}>
            <View style={styles.linkConverterTitle}>
              <Text style={styles.titleText}>Input Link</Text>
              {/* Uncomment if you want to enable image feature */}
              {/* <TouchableOpacity
                style={styles.addImageBtn}
                activeOpacity={0.7}
                onPress={openModal}>
                <IconComponent
                  name="image"
                  size={20}
                  color={colors.colorPrimary}
                />
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputLinkRef}
                value={productLink}
                multiline
                numberOfLines={Platform.OS === 'web' ? 5 : 4}
                style={styles.linkInput}
                onChangeText={text => {
                  setProductLink(text);
                }}
                placeholder="Copy and paste the link here to convert"
                placeholderTextColor={colors.gray}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.clearBtn}
                onPress={clearInputLink}>
                <IconComponent name="close" size={20} color={colors.gray} />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  convertLink(productLink);
                }}
                style={[
                  styles.convertBtn,
                  defaultStyleSheet.shadowProvider,
                  {
                    backgroundColor:
                      productLink.trim().length > 0
                        ? colors.colorPrimary
                        : colors.gray,
                  },
                ]}>
                <IconComponent name="link" size={20} color={colors.white} />
                <Text style={styles.convertBtnText}>Convert</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Output Section */}
          <View
            style={[
              styles.linkConverterContainer,
              defaultStyleSheet.shadowProvider,
              isWideScreen && styles.containerWide,
            ]}>
            <View style={styles.linkConverterTitle}>
              <Text style={styles.titleText}>Converted Link</Text>
              <TouchableOpacity
                style={styles.copyIconBtn}
                activeOpacity={0.7}
                onPress={() => {
                  copyToClipboard(convertedProductLink);
                }}>
                <IconComponent
                  name={copySuccess ? 'checkmark-circle' : 'copy'}
                  size={22}
                  color={
                    convertedProductLink.length > 0
                      ? copySuccess
                        ? colors.success
                        : colors.colorPrimary
                      : colors.gray
                  }
                />
                {copySuccess && Platform.OS !== 'web' && (
                  <Text style={styles.copiedText}>Copied!</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.outputWrapper}>
              <ScrollView
                style={styles.outputScroll}
                nestedScrollEnabled={true}>
                <Text
                  style={styles.outputText}
                  selectable={true}>
                  {convertedProductLink || 'Your converted link will appear here...'}
                </Text>
              </ScrollView>
            </View>

            <View style={styles.shareButtonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  shareToWhat(convertedProductLink);
                }}
                activeOpacity={0.7}
                style={[
                  styles.shareBtn,
                  defaultStyleSheet.shadowProvider,
                  {
                    backgroundColor:
                      convertedProductLink.length > 0
                        ? colors.colorPrimary
                        : colors.gray,
                  },
                ]}>
                <IconComponent
                  name="logo-whatsapp"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.shareBtnText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  shareReferralLink(convertedProductLink);
                }}
                style={styles.iconBtn}>
                <IconComponent
                  name="share-social-outline"
                  size={24}
                  color={
                    convertedProductLink.length > 0
                      ? colors.colorPrimary
                      : colors.gray
                  }
                />
              </TouchableOpacity>

              {/* <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
                <IconComponent
                  name="calendar"
                  size={24}
                  color={
                    convertedProductLink.length > 0
                      ? colors.colorPrimary
                      : colors.gray
                  }
                />
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                onPress={() => {
                  openTelegram();
                }}
                activeOpacity={0.7}
                style={[
                  styles.shareBtn,
                  defaultStyleSheet.shadowProvider,
                  {
                    backgroundColor:
                      convertedProductLink.length > 0
                        ? colors.colorPrimary
                        : colors.gray,
                  },
                ]}>
                <IconComponent name="paper-plane" size={20} color={colors.white} />
                <Text style={styles.shareBtnText}>Telegram</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* Modal for Image Selection */}
        <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>{renderModalContent()}</View>
        </Modal>

     


      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Converter;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  main: {
    padding: 10,
    flex: 1,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  linkConverterContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 280,
    margin: 5,
    padding: 15,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  containerWide: {
    maxWidth: '50%',
  },
  linkConverterTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleText: {
    fontWeight: '700',
    fontSize: 18,
    color: colors.black,
  },
  addImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addImageText: {
    fontWeight: '600',
    color: colors.colorPrimary,
    fontSize: 14,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  linkInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    backgroundColor: colors.white,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  outputWrapper: {
    flex: 1,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: '#f9f9f9',
    minHeight: 120,
  },
  outputScroll: {
    padding: 12,
  },
  outputText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  clearBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.gray,
    flex: 1,
  },
  clearBtnText: {
    fontWeight: '600',
    fontSize: 15,
    color: colors.gray,
  },
  convertBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
    flex: 2,
  },
  convertBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  copyIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  shareButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  shareBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    minWidth: 120,
  },
  shareBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  iconBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    alignItems: 'center',
    position: 'relative',
  },
  modalHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.colorPrimary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  uploadOptionsContainer: {
    padding: 24,
  },
  uploadOption: {
    marginBottom: 0,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.colorPrimary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },
  urlInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  urlInput: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    paddingVertical: 12,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearUrlButton: {
    padding: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  deviceUploadButton: {
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fafbfc',
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
  },
  imagePreviewSection: {
    padding: 24,
    alignItems: 'center',
  },
  imagePreviewWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imagePreview: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    alignItems: 'center',
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  removeImageText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  imageNameText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
    maxWidth: 280,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.colorPrimary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmButtonDisabled: {
    backgroundColor: colors.lightGray,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  confirmButtonTextDisabled: {
    color: colors.gray,
  },
});