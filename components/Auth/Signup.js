import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { colors } from '../../src/utils/color';
import { useNavigation } from '@react-navigation/native';
import IconComponent from '../IconComponent';
import AuthContext from '../../navigation/AuthContext';
import { ErrorModalService } from '../../src/utils/modalService';
import { isWeb, useResponsive } from '../../src/utils/dimension';
import { authService } from '../../api/services/auth.service';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';

const Signup = () => {
  const navigation = useNavigation();
  const dimensions = useResponsive();
  const { login } = useContext(AuthContext);

  // Refs for input fields
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const phoneRef = useRef(null);
  const referralRef = useRef(null);

  // State management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    referralCode: '',
    role: 'affiliate'
  });

  const [validation, setValidation] = useState({
    name: true,
    email: true,
    password: true,
    phone: true,
    referralCode: true,
  });

  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateName = (name) => name.length > 1;
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /\d/.test(password) && 
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };
  const validateReferralCode = (code) => {
    // Referral code is optional, so empty is valid
    if (code.length === 0) return true;
    // If provided, should be alphanumeric and 6-12 characters
    return /^[A-Z0-9]{4,9}$/.test(code.toUpperCase());
  };

  const getPasswordError = (password) => {
    if (password.length === 0) return 'Please enter password';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must include uppercase letter';
    if (!/\d/.test(password)) return 'Password must include a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include special character';
    return '';
  };

  // Input handlers
  const handleInputChange = (field, value) => {
    // Convert referral code to uppercase
    const processedValue = field === 'referralCode' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Real-time validation
    let isValid = true;
    switch (field) {
      case 'name':
        isValid = validateName(processedValue);
        break;
      case 'email':
        isValid = validateEmail(processedValue);
        break;
      case 'password':
        isValid = validatePassword(processedValue);
        break;
      case 'phone':
        isValid = validatePhone(processedValue);
        break;
      case 'referralCode':
        isValid = validateReferralCode(processedValue);
        break;
    }
    
    setValidation(prev => ({ ...prev, [field]: isValid }));
  };

  // Navigation functions
  const handleGoBack = () => navigation.goBack();
  const goToLogin = () => navigation.navigate('Login');

  // Enhanced registration handler
  const handleRegister = async () => {
    if (isLoading) return;

    // Validate all fields
    if (!validateName(formData.name)) {
      ErrorModalService.error('Please enter a valid name (at least 2 characters)', { title: 'Invalid Name' });
      nameRef.current?.focus();
      return;
    }
    if (!validateEmail(formData.email)) {
      ErrorModalService.error('Please enter a valid email address', { title: 'Invalid Email' });
      emailRef.current?.focus();
      return;
    }
    if (!validatePassword(formData.password)) {
      ErrorModalService.error(getPasswordError(formData.password), { title: 'Invalid Password' });
      passwordRef.current?.focus();
      return;
    }
    if (!validatePhone(formData.phone)) {
      ErrorModalService.error('Please enter a valid 10-digit phone number starting with 6-9', { title: 'Invalid Phone' });
      phoneRef.current?.focus();
      return;
    }
    if (formData.referralCode && !validateReferralCode(formData.referralCode)) {
      ErrorModalService.error('Please enter a valid referral code (4-9 alphanumeric characters)', { title: 'Invalid Referral Code' });
      referralRef.current?.focus();
      return;
    }
    if (!isChecked) {
      ErrorModalService.warning('Please accept the Terms and Conditions to proceed', { title: 'Terms Required' });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data (only include referralCode if provided)
      const registrationData = { ...formData };
      if (!registrationData.referralCode) {
        delete registrationData.referralCode;
      }

      const response = await authService.signup(registrationData);
      console.log("Registration response:", response);
      
      ErrorModalService.success(
        'Your account has been created successfully! Please sign in to continue.',
        { 
          title: 'Registration Successful',
          onConfirm: () => {
            setFormData({
              name: '',
              email: '',
              password: '',
              phone: '',
              referralCode: '',
              role: 'affiliate'
            });
            setIsChecked(false);
            goToLogin();
          }
        }
      );

    } catch (error) {
      console.error('Registration error:', error);
      
      console.log("this is error ",error);
      
      let errorMessage = 'Registration failed. Please try again.';
      let errorTitle = 'Registration Error';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = data?.message || 'Invalid registration data. Please check your information.';
            errorTitle = 'Invalid Data';
            break;
          case 409:
            errorMessage = 'An account with this email already exists. Please use a different email or sign in.';
            errorTitle = 'Account Exists';
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
            errorMessage = data?.message || `Registration failed (Error ${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorTitle = 'Connection Error';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      ErrorModalService.error(errorMessage, { title: errorTitle });
      
    } finally {
      setIsLoading(false);
    }
  };

  // Responsive styles
  const getContainerStyle = () => ({
    ...styles.container,
    paddingHorizontal: dimensions.isDesktop ? 40 : 0,
  });

  const getScrollContentStyle = () => ({
    ...styles.scrollContent,
    paddingHorizontal: dimensions.isMobile ? 16 : 0,
    paddingVertical: dimensions.isMobile ? 10 : 20,
  });

  const getFormStyle = () => {
    if (dimensions.isMobile) {
      return {
        ...styles.formContainer,
        width: '100%',
        marginHorizontal: 0,
        borderRadius: dimensions.isMobile ? 20 : 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
      };
    }
    
    if (dimensions.isTablet) {
      return {
        ...styles.formContainer,
        width: '90%',
        maxWidth: 600,
        alignSelf: 'center',
        marginHorizontal: 0,
      };
    }
    
    return {
      ...styles.formContainer,
      width: 500,
      maxWidth: 500,
      alignSelf: 'center',
      marginHorizontal: 0,
    };
  };

  const getInputIcon = (field, value) => {
    const iconMap = {
      name: 'person',
      email: 'mail',
      password: 'lock-closed',
      phone: 'phone-portrait',
      referralCode: 'gift',
    };

    let color = '#94A3B8';
    if (focusedField === field) {
      color = colors.colorPrimary;
    } else if (value.length > 0) {
      color = validation[field] ? '#10B981' : '#EF4444';
    }

    return { name: iconMap[field], color };
  };

  const getInputStyle = (field, value) => {
    const baseStyle = {
      ...styles.inputWrapper,
      borderColor: focusedField === field ? colors.colorPrimary : '#E5E7EB',
      backgroundColor: focusedField === field ? '#F8FAFC' : '#FFFFFF',
    };

    if (value.length > 0 && !validation[field]) {
      baseStyle.borderColor = '#EF4444';
      baseStyle.backgroundColor = '#FEF2F2';
    } else if (value.length > 0 && validation[field]) {
      baseStyle.borderColor = '#10B981';
      baseStyle.backgroundColor = '#F0FDF4';
    }

    return baseStyle;
  };

  const getHeaderStyle = () => ({
    ...styles.header,
    marginBottom: dimensions.isMobile ? 10 : 20,
    paddingHorizontal: dimensions.isMobile ? 4 : 0,
  });

  return (
    <SafeAreaView style={getContainerStyle()}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={getScrollContentStyle()}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          enabled={!isWeb}
          style={styles.contentWrapper}
        >
          {/* Header Section */}
          <View style={getHeaderStyle()}>
            {dimensions.isMobile && (
              <View style={styles.mobileHeader}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                  <IconComponent
                    name="arrow-back"
                    size={20}
                    color={colors.colorPrimary}
                  />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.welcomeText}>
                    SignUp User
                  </Text>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.mobileSubtitle}>
                    Create your account
                  </Text>
                </View> 
              </View>
            )}
          </View>

          {/* Form Container */}
          <View style={getFormStyle()}>
            {/* Desktop/Tablet Header */}
            {dimensions.isTablet && (
              <View style={styles.desktopHeader}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                  <IconComponent
                    name="arrow-back"
                    size={20}
                    color={colors.colorPrimary}
                  />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.desktopTitle}>
                    Create Account
                  </Text>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.desktopSubtitle}>
                    Join OffersPay today
                  </Text>
                </View>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.formFields}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.inputLabel}>
                  Full Name
                </Text>
                <View style={getInputStyle('name', formData.name)}>
                  <IconComponent {...getInputIcon('name', formData.name)} size={20} />
                  <TextInput
                    ref={nameRef}
                    allowFontScaling={false}
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                {formData.name.length > 0 && !validation.name && (
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.errorText}>
                    Please enter a valid name
                  </Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.inputLabel}>
                  Email Address
                </Text>
                <View style={getInputStyle('email', formData.email)}>
                  <IconComponent {...getInputIcon('email', formData.email)} size={20} />
                  <TextInput
                    ref={emailRef}
                    allowFontScaling={false}
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                {formData.email.length > 0 && !validation.email && (
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.errorText}>
                    Please enter a valid email
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.inputLabel}>
                  Password
                </Text>
                <View style={getInputStyle('password', formData.password)}>
                  <IconComponent {...getInputIcon('password', formData.password)} size={20} />
                  <TextInput
                    ref={passwordRef}
                    allowFontScaling={false}
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Create a strong password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={isLoading}
                  >
                    <IconComponent
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {formData.password.length > 0 && !validation.password && (
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.errorText}>
                    {getPasswordError(formData.password)}
                  </Text>
                )}
              </View>

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.inputLabel}>
                  Phone Number
                </Text>
                <View style={getInputStyle('phone', formData.phone)}>
                  <IconComponent {...getInputIcon('phone', formData.phone)} size={20} />
                  <TextInput
                    ref={phoneRef}
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#9CA3AF"
                    allowFontScaling={false}
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="numeric"
                    maxLength={10}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                {formData.phone.length > 0 && !validation.phone && (
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.errorText}>
                    Please enter a valid phone number
                  </Text>
                )}
              </View>

              {/* Referral Code Input - Optional */}
              <View style={styles.inputGroup}>
                <View style={styles.labelWithBadge}>
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.inputLabel}>
                    Referral Code
                  </Text>
                  <View style={styles.optionalBadge}>
                    <Text allowFontScaling={false} style={styles.optionalText}>Optional</Text>
                  </View>
                </View>
                <View style={getInputStyle('referralCode', formData.referralCode)}>
                  <IconComponent {...getInputIcon('referralCode', formData.referralCode)} size={20} />
                  <TextInput
                    ref={referralRef}
                    allowFontScaling={false}
                    style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                    placeholder="Enter referral code (if any)"
                    placeholderTextColor="#9CA3AF"
                    value={formData.referralCode}
                    onChangeText={(value) => handleInputChange('referralCode', value)}
                    autoCapitalize="characters"
                    maxLength={12}
                    onFocus={() => setFocusedField('referralCode')}
                    onBlur={() => setFocusedField('')}
                    editable={!isLoading}
                  />
                </View>
                {formData.referralCode.length > 0 && !validation.referralCode && (
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.errorText}>
                    Please enter a valid referral code (6-12 characters)
                  </Text>
                )}
                {formData.referralCode.length > 0 && validation.referralCode && (
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.successText}>
                    Referral code applied successfully!
                  </Text>
                )}
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={styles.checkboxContainer}
                activeOpacity={0.9}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && (
                    <IconComponent
                      name="checkmark"
                      size={14}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text allowFontScaling={false} style={styles.termsText}>
                  I agree to the{' '}
                  <Text allowFontScaling={false} style={styles.termsLink}>Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text allowFontScaling={false} style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Register Button */}
              <LinearGradient 
                colors={[colors.colorPrimaryLite, colors.colorPrimary]}
                style={[
                  styles.registerButton,
                  isLoading && styles.registerButtonDisabled
                ]}
              >
                <TouchableOpacity
                  onPress={handleRegister}
                  style={styles.registerButtonInner}
                  activeOpacity={0.9}
                  disabled={isLoading}
                >
                  <Text allowFontScaling={false} numberOfLines={1} style={styles.registerButtonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* Login Link */}
              <View style={styles.loginLinkContainer}>
                <Text allowFontScaling={false} style={styles.loginText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={goToLogin} disabled={isLoading}>
                  <Text allowFontScaling={false} style={[styles.loginLink, isLoading && styles.disabledText]}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    zIndex: 1,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginTop: 4,
    paddingTop: 20,
    marginBottom: 20,
  },
  desktopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
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
    elevation: 1,
  },
  titleContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.colorPrimary,
  },
  mobileSubtitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  desktopTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.colorPrimary,
    marginBottom: 4,
  },
  desktopSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0.5,
  },
  formFields: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  optionalBadge: {
    backgroundColor: colors.colorPrimaryLite,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    fontWeight: '500',
    borderWidth: 0,
    outline: 'none',
    paddingVertical: 0,
    minHeight: 22,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  successText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.colorPrimary,
    borderColor: colors.colorPrimary,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.colorPrimary,
    fontWeight: '600',
  },
  registerButton: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  registerButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    paddingVertical: 0,
  },
  loginText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 12,
    color: colors.colorPrimary,
    fontWeight: '700',
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default Signup;