import React, { useCallback, useEffect, useState, useRef } from 'react';
import { 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Animated,
  Image
} from 'react-native';
import { colors } from '../../src/utils/color';
import IconComponent from '../IconComponent';

import { userService } from '../../api/services/user.service';
import storage from '../../src/utils/storage';
import ErrorModal from '../ErrorModal';
import { isAndroid, isWeb, useResponsive } from '../../src/utils/dimension';
import { useNavigation } from '@react-navigation/native';
import CustomDatePicker from '../CustomDatePicker';
import LinearGradient from 'react-native-linear-gradient';
import { color } from '@rneui/base';

const Profile = () => {
  const navigation = useNavigation();
  const {dimensions , isDesktop} = useResponsive();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateofBirth: null,
    gender: null,
    whatsappLink: '',
    panName: '',
    panNumber: '',
    gst: null,
    profileImage: null
  });

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    dateofBirth: '',
    gender: '',
    whatsappLink: '',
    panName: '',
    panNumber: '',
    gst: ''
  });

  const [openDateSelector, setOpenDateSelector] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false); // New state for image upload

  // Modal state
  const [modalState, setModalState] = useState({
    visible: false,
    message: '',
    title: 'Alert',
    type: 'error',
    onConfirm: null,
    showCancel: true,
    confirmText: 'OK',
  });

  const options = ['Male', 'Female'];
  const gstOptions = ['Yes', 'No'];

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, formAnim, slideAnim]);

  // Modal helper functions
  const showModal = useCallback((config) => {
    setModalState({
      visible: true,
      message: '',
      title: 'Alert',
      type: 'error',
      onConfirm: null,
      showCancel: true,
      confirmText: 'OK',
      ...config,
    });
  }, []);

  const showErrorModal = useCallback((message, title = 'Error') => {
    showModal({
      message,
      title,
      type: 'error',
      showCancel: false,
    });
  }, [showModal]);

  const showSuccessModal = useCallback((message, title = 'Success', onConfirm = null) => {
    showModal({
      message,
      title,
      type: 'success',
      showCancel: false,
      onConfirm,
    });
  }, [showModal]);

  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, visible: false }));
  }, []);

  // Fetch user data and populate form
  const getUserData = useCallback(async () => {
    try {
      setInitialLoading(true);
      const userInfo = await storage.user.getUserInfo();
      
      if (!userInfo?.id) {
        showErrorModal('User information not found. Please login again.');
        return;
      }
      
      const response = await userService.getById(userInfo.id);
     // console.log("User data response:", response);
      
      if (response.data && response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        
        // Populate form with existing user data
        setFormData({
          name: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          dateofBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender ? (userData.gender === 'male' ? 'Male' : 'Female') : null,
          whatsappLink: userData.whatsappLink || '',
          panName: userData.panName || '',
          panNumber: userData.panNumber || '',
          gst: userData.gstApplicable !== undefined ? (userData.gstApplicable ? 'Yes' : 'No') : null,
          profileImage: userData.avatar || null
        });
        
        // Set the selected image if avatar exists
        if (userData.avatar) {
          setSelectedImage({ uri: userData.avatar });
        }
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
      showErrorModal(
        'Failed to load profile data. Please check your connection and try again.',
        'Load Error'
      );
    } finally {
      setInitialLoading(false);
    }
  }, [showErrorModal]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]*$/.test(name)) return 'Name should only contain letters';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(phone)) return 'Phone number must be 10 digits starting with 6-9';
    return '';
  };

  const validateDateOfBirth = (date) => {
    if (!date) return 'Date of birth is required';
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 18) return 'Must be at least 18 years old';
    if (age > 100) return 'Please enter a valid date of birth';
    return '';
  };

  const validateWhatsappLink = (link) => {
    // Optional field - only validate if provided
    if (link && link.trim()) {
      if (!link.startsWith('https://')) return 'Link must start with https://';
      const whatsappRegex = /^https:\/\/(wa\.me\/|api\.whatsapp\.com\/|web\.whatsapp\.com\/)/;
      if (!whatsappRegex.test(link)) return 'Please enter a valid WhatsApp link';
    }
    return '';
  };

  const validatePanName = (name) => {
    // Optional field - only validate if provided
    if (name && name.trim() && name.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  const validatePanNumber = (pan) => {
    // Optional field - only validate if provided
    if (pan && pan.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) return 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    return '';
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate field on change
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'dateofBirth':
        error = validateDateOfBirth(value);
        break;
      case 'whatsappLink':
        error = validateWhatsappLink(value);
        break;
      case 'panName':
        error = validatePanName(value);
        break;
      case 'panNumber':
        error = validatePanNumber(value);
        break;
      case 'gender':
        error = !value ? 'Gender is required' : '';
        break;
      case 'gst':
        error = ''; // Made optional
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Image upload function - NEW
  const uploadProfileImage = async (imageFile) => {
    try {
      setImageUploadLoading(true);
      console.log('Uploading image:', imageFile);
      
      const response = await userService.updateProfile(imageFile);
     // console.log('Image upload response:', response);
      
      if (response.data && response.data.success) {
        // Update the user data with new avatar URL
        const updatedAvatarUrl = response.data.data.avatar || response.data.avatar;
        
        // Update local state
        setFormData(prev => ({ ...prev, profileImage: updatedAvatarUrl }));
        setSelectedImage({ uri: updatedAvatarUrl });
        
        // Update user data
        setUser(prev => ({ ...prev, avatar: updatedAvatarUrl }));
        
         // 📝 Add the navigation callback here
    showSuccessModal(
      'Profile picture updated successfully!', 
      'Success',
      () => navigation.goBack() // This tells the app to go back after the user clicks "OK"
    );
        return true;
      } else {
        showErrorModal('Failed to upload image. Please try again.', 'Upload Failed');
        return false;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      
      let errorMessage = 'Failed to upload image. Please try again.';
      let errorTitle = 'Upload Error';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid image file. Please select a valid image.';
            errorTitle = 'Invalid File';
            break;
          case 401:
            errorMessage = 'Session expired. Please login again.';
            errorTitle = 'Authentication Error';
            break;
          case 413:
            errorMessage = 'Image file is too large. Please select a smaller image.';
            errorTitle = 'File Too Large';
            break;
          case 422:
            errorMessage = data?.message || 'Invalid image format. Please select a JPG, PNG, or GIF file.';
            errorTitle = 'Invalid Format';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later.';
            errorTitle = 'Server Error';
            break;
          default:
            errorMessage = data?.message || `Upload failed (Error ${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorTitle = 'Connection Error';
      }
      
      showErrorModal(errorMessage, errorTitle);
      return false;
    } finally {
      setImageUploadLoading(false);
    }
  };

  // Updated Image picker handler
  const handleImagePicker = () => {
    if (imageUploadLoading) return; // Prevent multiple uploads
    
    // For React Native, you would typically use react-native-image-picker
    // For web, you can use file input
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          // Validate file size (5MB limit)
          if (file.size > 5 * 1024 * 1024) {
            showErrorModal('Image size should be less than 5MB', 'File Size Error');
            return;
          }
          
          // Validate file type
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(file.type)) {
            showErrorModal('Please select a valid image file (JPG, PNG, or GIF)', 'Invalid File Type');
            return;
          }
          
          // Show preview immediately
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUri = e.target.result;
            setSelectedImage({ uri: imageUri, file });
          };
          reader.readAsDataURL(file);
          
          // Upload the image
          const uploadSuccess = await uploadProfileImage(file);
          
          // If upload failed, revert to previous image
          if (!uploadSuccess) {
            if (formData.profileImage) {
              setSelectedImage({ uri: formData.profileImage });
            } else {
              setSelectedImage(null);
            }
          }
        }
      };
      input.click();
    } else {
      // For React Native - you would implement ImagePicker here
      // import {launchImageLibrary} from 'react-native-image-picker';
      showErrorModal('Image picker not implemented for mobile yet', 'Feature Unavailable');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (isLoading) return;

    // Validate all fields
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      dateofBirth: validateDateOfBirth(formData.dateofBirth),
      whatsappLink: validateWhatsappLink(formData.whatsappLink),
      panName: validatePanName(formData.panName),
      panNumber: validatePanNumber(formData.panNumber),
      gender: !formData.gender ? 'Gender is required' : '',
      gst: '' // Made optional
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      showErrorModal('Please fix all validation errors before submitting.', 'Validation Error');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const updateData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateofBirth,
        gender: formData.gender.toLowerCase(),
        whatsappLink: formData.whatsappLink || undefined,
        panName: formData.panName || undefined,
        panNumber: formData.panNumber || undefined,
        gstApplicable: formData.gst ? formData.gst === 'Yes' : undefined
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const response = await userService.update(updateData);
      console.log("Profile update response:", response);

      showSuccessModal(
        'Your profile has been updated successfully!',
        'Profile Updated',
      );

    } catch (error) {
      console.error('Profile update error:', error);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      let errorTitle = 'Update Error';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid profile data. Please check your information.';
            errorTitle = 'Invalid Data';
            break;
          case 401:
            errorMessage = 'Session expired. Please login again.';
            errorTitle = 'Authentication Error';
            break;
          case 422:
            errorMessage = data?.message || 'Please check your input data and try again.';
            errorTitle = 'Validation Error';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later.';
            errorTitle = 'Server Error';
            break;
          default:
            errorMessage = data?.message || `Update failed (Error ${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorTitle = 'Connection Error';
      }
      
      showErrorModal(errorMessage, errorTitle);
    } finally {
      setIsLoading(false);
    }
  };

  // Get input styling based on state
  const getInputIcon = (field, value) => {
    const iconMap = {
      name: 'person',
      email: 'mail',
      phone: 'phone-portrait',
      whatsappLink: 'logo-whatsapp',
      panName: 'document-text',
      panNumber: 'card',
    };

    let color = '#94A3B8';
    if (focusedField === field) {
      color = colors.colorPrimary;
    } else if (value && value.length > 0) {
      color = errors[field] ? '#EF4444' : '#10B981';
    }

    return { name: iconMap[field], color };
  };

  const getInputStyle = (field, value) => {
    const baseStyle = {
      ...styles.inputWrapper,
      borderColor: focusedField === field ? colors.colorPrimary : '#E5E7EB',
      backgroundColor: focusedField === field ? '#F8FAFC' : '#FFFFFF',
    };

    if (value && value.length > 0 && errors[field]) {
      baseStyle.borderColor = '#EF4444';
      baseStyle.backgroundColor = '#FEF2F2';
    } else if (value && value.length > 0 && !errors[field]) {
      baseStyle.borderColor = '#10B981';
      baseStyle.backgroundColor = '#F0FDF4';
    }

    return baseStyle;
  };

 // console.log("this is selected images",selectedImage);
  

  // Error message component
  const ErrorMessage = ({ error }) => (
    error ? <Text style={styles.errorText}>{error}</Text> : null
  );

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Header */}
          { (isWeb && isDesktop)  && (<View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
              <IconComponent
                name="arrow-back"
                size={20}
                color={colors.colorPrimary}
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text  
                    allowFontScaling={false} style={styles.headerTitle}>Profile</Text>
              <Text  
                    allowFontScaling={false} style={styles.headerSubtitle}>Update your information</Text>
            </View>
          </View>)}

          {/* Form Container */}
          <Animated.View style={[
            styles.formContainer,
            { transform: [{ scale: formAnim }] }
          ]}>
            {/* Profile Picture - UPDATED */}
            <View style={styles.profilePicContainer}>
              <View style={styles.profileImageWrapper}>
                <Image
                  style={styles.profilePic}
                  resizeMode="cover"
                  source={
                    selectedImage?.uri
                      ? { uri: selectedImage.uri }
                      : require('../../src/assets/profile_placeholder.png')
                  }
                />
                
                {/* Loading overlay for image upload */}
                {/* {imageUploadLoading && (
                  <View style={styles.imageLoadingOverlay}>
                    <Text style={styles.imageLoadingText}>Uploading...</Text>
                  </View>
                )} */}
              </View>
              
              {/* Upload/Edit Button */}
              {/* <TouchableOpacity 
                style={[
                  styles.imageActionButton,
                  imageUploadLoading && styles.imageActionButtonDisabled
                ]} 
                onPress={handleImagePicker}
                activeOpacity={0.8}
                disabled={imageUploadLoading}
              >
                <IconComponent 
                  name={imageUploadLoading ? "hourglass" : (selectedImage ? "pencil" : "camera")} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
               */}
              {/* Upload Text for no image */}
              {/* {!selectedImage && !imageUploadLoading && (
                <TouchableOpacity 
                  style={styles.uploadTextButton} 
                  onPress={handleImagePicker}
                  activeOpacity={0.8}
                >
                  <Text style={styles.uploadText}>Upload Photo</Text>
                </TouchableOpacity>
              )} */}
              
              {/* Upload progress text */}
              {/* {imageUploadLoading && (
                <View style={styles.uploadProgressContainer}>
                  <Text style={styles.uploadProgressText}>Uploading image...</Text>
                </View>
              )} */}
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Name field */}
              <View style={styles.inputGroup}>
                <Text 
                    allowFontScaling={false} style={styles.inputLabel}>Full Name</Text>
                <View style={getInputStyle('name', formData.name)}>
                  <IconComponent {...getInputIcon('name', formData.name)} size={20} />
                  <TextInput
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.name}
                    onChangeText={(value) => handleChange('name', value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                <ErrorMessage error={errors.name} />
              </View>

              {/* Email field */}
              <View style={styles.inputGroup}>
                <Text 
                    allowFontScaling={false} style={styles.inputLabel}>Email Address</Text>
                <View style={[getInputStyle('email', formData.email), styles.disabledInput]}>
                  <IconComponent {...getInputIcon('email', formData.email)} size={20} />
                  <TextInput
                    style={[styles.textInput, styles.disabledText, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Email address"
                    allowFontScaling={false}
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    editable={false}
                  />
                  <View style={styles.lockedIcon}>
                    <IconComponent name="lock-closed" size={16} color="#9CA3AF" />
                  </View>
                </View>
                <Text 
                    allowFontScaling={false}style={styles.helperText}>Email cannot be changed</Text>
              </View>

              {/* Phone field */}
              <View style={styles.inputGroup}>
                <Text 
                
                allowFontScaling={false}
                style={styles.inputLabel}>Phone Number</Text>
                <View style={getInputStyle('phone', formData.phone)}>
                  <IconComponent {...getInputIcon('phone', formData.phone)} size={20} />
                  <TextInput
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    value={formData.phone}
                    allowFontScaling={false}
                    onChangeText={(value) => handleChange('phone', value)}
                    keyboardType="numeric"
                    maxLength={10}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                <ErrorMessage error={errors.phone} />
              </View>

              {/* Date of Birth field */}
              <View style={styles.inputGroup}>
                <Text 
                    allowFontScaling={false} style={styles.inputLabel}>Date of Birth</Text>
               
                  <View style={styles.inputWrapper}>
                    <IconComponent name="calendar" size={20} color="#94A3B8" />
                    <CustomDatePicker
                      selected={formData.dateofBirth}
                      onChange={(date) => handleChange('dateofBirth', date)}
                      placeholder="Select Date"
                      style={styles.textInput}
                    />
                  </View>
              
                <ErrorMessage error={errors.dateofBirth} />
              </View>

              {/* Gender section */}
              <View style={styles.inputGroup}>
                <Text 
                    allowFontScaling={false} style={styles.inputLabel}>Gender</Text>
                <View style={styles.radioContainer}>
                  {options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      style={styles.radioOption}
                      onPress={() => handleChange('gender', option)}
                      disabled={isLoading}
                    >
                      <View style={[
                        styles.radioButton,
                        formData.gender === option && styles.radioButtonSelected
                      ]}>
                        {formData.gender === option && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text 
                    allowFontScaling={false} style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <ErrorMessage error={errors.gender} />
              </View>

              {/* WhatsApp Link field */}
              {/* <View style={styles.inputGroup}>
                <Text 
                    allowFontScaling={false} style={styles.inputLabel}>
                  WhatsApp Link 
                  <Text 
                      allowFontScaling={false} style={styles.optionalText}> (Optional)</Text>
                </Text>
                <View style={getInputStyle('whatsappLink', formData.whatsappLink)}>
                  <IconComponent {...getInputIcon('whatsappLink', formData.whatsappLink)} size={20} />
                  <TextInput
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="https://wa.me/yourphonenumber"
                    placeholderTextColor="#9CA3AF"
                    allowFontScaling={false}
                    value={formData.whatsappLink}
                    onChangeText={(value) => handleChange('whatsappLink', value)}
                    onFocus={() => setFocusedField('whatsappLink')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                    autoCapitalize="none"
                  />
                </View>
                <ErrorMessage error={errors.whatsappLink} />
              </View> */}

              {/* PAN Information Note */}
              <View style={styles.noteContainer}>
                <IconComponent name="information-circle" size={20} color={colors.colorPrimary} />
                <Text
                allowFontScaling={false}
                style={styles.noteText}>
                  PAN information is optional but recommended for business transactions. PAN once added cannot be edited.
                </Text>
              </View>

              {/* PAN Name field */}
              <View style={styles.inputGroup}>
                <Text 
                allowFontScaling={false}
                style={styles.inputLabel}>
                  Name as per PAN 
                  <Text style={styles.optionalText}> (Optional)</Text>
                </Text>
                <View style={getInputStyle('panName', formData.panName)}>
                  <IconComponent {...getInputIcon('panName', formData.panName)} size={20} />
                  <TextInput
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter name as per PAN"
                    placeholderTextColor="#9CA3AF"
                    value={formData.panName}
                    onChangeText={(value) => handleChange('panName', value)}
                    onFocus={() => setFocusedField('panName')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                <ErrorMessage error={errors.panName} />
              </View>

              {/* PAN Number field */}
              <View style={styles.inputGroup}>
                <Text
                allowFontScaling={false} style={styles.inputLabel}>
                  PAN Number 
                  <Text 
                      allowFontScaling={false}style={styles.optionalText}> (Optional)</Text>
                </Text>
                <View style={getInputStyle('panNumber', formData.panNumber)}>
                  <IconComponent {...getInputIcon('panNumber', formData.panNumber)} size={20} />
                  <TextInput
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="ABCDE1234F"
                    allowFontScaling={false}
                    placeholderTextColor="#9CA3AF"
                    value={formData.panNumber}
                    onChangeText={(value) => handleChange('panNumber', value.toUpperCase())}
                    maxLength={10}
                    onFocus={() => setFocusedField('panNumber')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                    autoCapitalize="characters"
                  />
                </View>
                <ErrorMessage error={errors.panNumber} />
              </View>

              {/* Verify PAN Button - Only show if PAN number is entered */}
              {formData.panNumber && formData.panNumber.length === 10 && (
                <TouchableOpacity style={styles.verifyButton} activeOpacity={0.8}>
                  <IconComponent name="shield-checkmark" size={16} color="#FFFFFF" />
                  <Text 
                      allowFontScaling={false}style={styles.verifyButtonText}>Verify PAN</Text>
                </TouchableOpacity>
              )}

              {/* GST section */}
              <View style={styles.inputGroup}>
                <Text
                
                allowFontScaling={false}
                style={styles.inputLabel}>
                  GST Applicable 
                  <Text 
                  
                  allowFontScaling={false}
                  style={styles.optionalText}> (Optional)</Text>
                </Text>
                <View style={styles.radioContainer}>
                  {gstOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      style={styles.radioOption}
                      onPress={() => handleChange('gst', option)}
                      disabled={isLoading}
                    >
                      <View style={[
                        styles.radioButton,
                        formData.gst === option && styles.radioButtonSelected
                      ]}>
                        {formData.gst === option && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text
                      allowFontScaling={false}
                      style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <ErrorMessage error={errors.gst} />
              </View>

              {/* Submit Button */}
              <LinearGradient
                            colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                           style={styles.submitButton}
                          >
              <TouchableOpacity
                onPress={handleSubmit}
                style={{flex:1,alignItems:'center',justifyContent:'center'}}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text
                allowFontScaling={false}
                 style={styles.submitButtonText}>
                  {isLoading ? 'Updating Profile...' : 'Update Profile'}
                </Text>
              </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Enhanced ErrorModal */}
      <ErrorModal
        visible={modalState.visible}
        message={modalState.message}
        title={modalState.title}
        type={modalState.type}
        onClose={hideModal}
        onConfirm={modalState.onConfirm}
        showCancel={modalState.showCancel}
        confirmText={modalState.confirmText}
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contentWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  backButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 32,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 20 },
    // shadowOpacity: 0.15,
    // shadowRadius: 40,
    elevation: 1,
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profilePic: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLoadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  imageActionButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.colorPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  imageActionButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  uploadTextButton: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  uploadText: {
    fontSize: 14,
    color: colors.colorPrimary,
    fontWeight: '600',
  },
  uploadProgressContainer: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  uploadProgressText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  optionalText: {
    color: '#9CA3AF',
    fontWeight: '400',
    fontSize: 12,
  },
  formFields: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
    borderWidth: 0,
    outline: 'none',
    paddingVertical: 0,
    minHeight: 20,
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  lockedIcon: {
    marginLeft: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: colors.colorPrimary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.colorPrimary,
  },
  radioText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.colorPrimary,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 20,
    marginLeft: 12,
    fontWeight: '500',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorPrimary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    alignSelf: 'flex-start',
    minWidth: 120,
    shadowColor: colors.colorPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  submitButton: {
    borderRadius: 16,
    marginTop: 20,
    shadowColor: colors.colorPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 54,
  },
  submitButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});