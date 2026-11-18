// src/components/ImageViewer.js  (or wherever your file is)
import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Text,
  Dimensions
} from 'react-native';
import { Play, ImageIcon } from 'lucide-react-native';
import { colors } from '../src/utils/color';
import IconButton from './IconButton';

const ProductImageGallery = ({ 
  images = [], 
  isWideScreen = false, 
  onShareReferral = () => {},   
  onShareWhatsApp = () => {}    
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || null);

  //console.log("Gallery received images →", images);
 // console.log("Selected image →", selectedImage);

  // Placeholder when no images
  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, !isWideScreen && styles.containerVertical]}>
        <View style={[styles.previewContainer, styles.previewContainerVertical]}>
          <View style={styles.placeholderPreview}>
            <ImageIcon size={48} color="#999" />
            <Text style={styles.placeholderText}>No images available</Text>
          </View>
        </View>
      </View>
    );
  }

  const renderThumbnail = (image, index) => {
    // If it's a video (you can extend this later)
    if (image.type === 'video') {
      return (
        <View style={styles.videoThumbnail}>
          <Play size={24} color="#fff" />
          <Text style={styles.videoText}>VIDEO</Text>
        </View>
      );
    }

    return (
      <Image
        source={image}                    // ← CORRECT: image is { uri: "url" }
        style={styles.thumbnailImage}
        resizeMode="contain"
        defaultSource={require('../src/assets/fallback_image.png')}
      />
    );
  };

  return (
    <View style={[styles.container, !isWideScreen && styles.containerVertical]}>

      {/* Mobile: Preview on top */}
      {!isWideScreen && (
        <View style={[styles.previewContainer, styles.previewContainerVertical]}>
          {selectedImage?.type === 'video' ? (
            <View style={styles.videoPreview}>
              <Play size={48} color="#fff" />
              <Text style={styles.videoPreviewText}>Click to Play Video</Text>
            </View>
          ) : (
            <Image
              source={selectedImage}       // ← FIXED: was selectedImage?.url
              style={styles.previewImage}
              resizeMode="contain"
              defaultSource={require('../src/assets/fallback_image.png')}
            />
          )}
        </View>
      )}

      {/* Thumbnails */}
      <View style={[
        styles.thumbnailContainer,
        !isWideScreen && styles.thumbnailContainerVertical
      ]}>
        <ScrollView
          horizontal={!isWideScreen}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(image)}
              style={[
                styles.thumbnailWrapper,
                selectedImage?.uri === image.uri && styles.selectedThumbnail,
                !isWideScreen && styles.thumbnailWrapperHorizontal
              ]}
            >
              {renderThumbnail(image, index)}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Desktop: Main Preview */}
      {isWideScreen && (
        <View style={[styles.previewContainer, styles.desktopPreview]}>
          {selectedImage?.type === 'video' ? (
            <View style={styles.videoPreview}>
              <Play size={48} color="#fff" />
              <Text style={styles.videoPreviewText}>Click to Play Video</Text>
            </View>
          ) : (
            <Image
              source={selectedImage}       // ← FIXED: was selectedImage?.url
              style={styles.previewImage}
              resizeMode="cover"
              defaultSource={require('../src/assets/fallback_image.png')}
            />
          )}

          {/* Share Buttons */}
          <View style={styles.copyTopContainer}>
            <IconButton
              onPress={onShareWhatsApp}
              iconName="logo-whatsapp"
              iconColor={colors.white}
              backgroundColor={colors.colorPrimary}
              size={40}
            />
            <IconButton
              onPress={onShareReferral}
              iconName="share-social-outline"
              iconColor={colors.colorPrimary}
              size={40}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    flexDirection: 'row' 
  },
  containerVertical: { 
    flexDirection: 'column', 
  },
  thumbnailContainer: { 
    width: 70 
  },
  thumbnailContainerVertical: { 
    width: '100%', 
    height: 70, 
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f0f0f0',
  },
  thumbnailWrapperHorizontal: { 
    marginBottom: 0, 
    marginRight: 10 
  },
  selectedThumbnail: { 
    borderColor: colors.colorPrimary 
  },
  thumbnailImage: { 
    width: '100%', 
    height: '100%' 
  },
  videoThumbnail: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#000',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  videoText: { 
    color: '#fff', 
    fontSize: 10, 
    marginTop: 4 
  },
  previewContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewContainerVertical: {
    height: 250,
    width: '100%',
    alignSelf:'center',
  },
  desktopPreview: {
    flex: 1,
    aspectRatio: 9/16,
    marginRight: 8,
    maxHeight: 440,
  },
  previewImage: { 
    width: '100%', 
    height: '100%' 
    
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreviewText: { 
    color: '#fff', 
    marginTop: 10, 
    fontSize: 16 
  },
  copyTopContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 10,
    zIndex: 10,
  },
  placeholderPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderText: { 
    marginTop: 12, 
    color: '#999', 
    fontSize: 16 
  },
});

export default ProductImageGallery;