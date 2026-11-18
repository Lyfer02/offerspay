import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../src/utils/color';
import { authService } from '../../api/services/auth.service';
import AuthContext, { useAuth } from '../../navigation/AuthContext';
import ErrorModal from '../ErrorModal';
import IconComponent from '../IconComponent';
import { isWeb, useResponsive } from '../../src/utils/dimension';
import LinearGradient from 'react-native-linear-gradient';

const Login = () => {
  const dimensions = useResponsive();
  const { login } = useContext(AuthContext);
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      
    };
  }, []);(() => {
    if (isLoggedIn) {
      navigation.replace('MainTabs');
    }
  }, [isLoggedIn]);


  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Refs for input fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [validation, setValidation] = useState({ email: true, password: true });
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced modal state
  const [modalState, setModalState] = useState({
    visible: false,
    message: '',
    title: 'Alert',
    type: 'error',
    onConfirm: null,
    showCancel: true,
    confirmText: 'OK',
  });

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Enhanced modal helper functions
  const showModal = (config) => {
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
  };

  const showErrorModal = (message, title = 'Login Error') => {
    showModal({
      message,
      title,
      type: 'error',
      showCancel: false,
    });
  };

  const showSuccessModal = (message, title = 'Success', onConfirm = null) => {
    showModal({
      message,
      title,
      type: 'success',
      showCancel: false,
      onConfirm,
    });
  };

  const showWarningModal = (message, title = 'Warning') => {
    showModal({
      message,
      title,
      type: 'warning',
      showCancel: false,
    });
  };

  const hideModal = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  };

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length > 0;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    let isValid = true;
    switch (field) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'password':
        isValid = validatePassword(value);
        break;
    }
    
    setValidation(prev => ({ ...prev, [field]: isValid }));
  };

  const validateForm = () => {
    const emailValid = validateEmail(formData.email);
    const passwordValid = validatePassword(formData.password);

    setValidation({
      email: emailValid,
      password: passwordValid,
    });

    if (!formData.email.trim()) {
      showWarningModal('Please enter your email address', 'Email Required');
      emailRef.current?.focus();
      return false;
    }

    if (!emailValid) {
      showErrorModal('Please enter a valid email address', 'Invalid Email');
      emailRef.current?.focus();
      return false;
    }

    if (!formData.password.trim()) {
      showWarningModal('Please enter your password', 'Password Required');
      passwordRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm() || isLoading) return;

    try {
      setIsLoading(true);
      const response = await authService.login(formData);
    // console.log("this is response for login",response);
      

      if (response.data.success) {
        const apiData = response.data.data;

        const userData = {
          id: apiData.user._id,
          name: apiData.user.fullName,
          email: apiData.user.email,
          accessToken: apiData.accessToken,
          refreshToken: apiData.refreshToken,
          profileImage: apiData.user.avatar || '',
          phone: apiData.user.phone || '',
          userName: apiData.user.userName || '',
          role: apiData.user.role || 'user',
          status: apiData.user.status || 'active',
          gender: apiData.user.gender || '',
          permissions: apiData.user.permissions || {},
          createdAt: apiData.user.createdAt,
          updatedAt: apiData.user.updatedAt,
        };

        const result = await login(userData);

        if (result.success) {
          showSuccessModal(
            `Welcome back, ${userData.name}! You have been successfully logged in.`,
            'Login Successful',
            () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              });
            }
          );
        } else {
          showErrorModal('Failed to save login data. Please try again.', 'Authentication Error');
        }
      } else {
        showErrorModal(response.data.message || 'Login failed. Please check your credentials.', 'Login Failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      let errorTitle = 'Login Error';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            errorMessage = 'Invalid login credentials. Please check your email and password.';
            errorTitle = 'Invalid Credentials';
            break;
          case 401:
            errorMessage = 'Incorrect email or password. Please try again.';
            errorTitle = 'Authentication Failed';
            break;
          case 403:
            errorMessage = 'Your account has been suspended. Please contact support.';
            errorTitle = 'Account Suspended';
            break;
          case 404:
            errorMessage = 'Account not found. Please check your email or create a new account.';
            errorTitle = 'Account Not Found';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again after a few minutes.';
            errorTitle = 'Rate Limited';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later.';
            errorTitle = 'Server Error';
            break;
          default:
            errorMessage = data?.message || `Login failed (Error ${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
        errorTitle = 'Connection Error';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showErrorModal(errorMessage, errorTitle);
    } finally {
      setIsLoading(false);
    }
  };

  const getInputIcon = (field, value) => {
    const iconMap = {
      email: 'mail',
      password: 'lock-closed',
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

  const handleGoBack = () => navigation.goBack();
  const goToSignup = () => navigation.navigate('Signup');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}  // Small offset for Android header/footer if needed
        enabled={!isWeb}
    >
      {/* Background Overlay */}
      
      <View
        style={[
          styles.contentWrapper,
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          {/* {dimensions.isDesktop && (
            <Image
              style={styles.logo}
              source={require('../../src/assets/logo_app.png')}
              resizeMode="contain"
            />
          )} */}
          
          {dimensions.isMobile && (
            <View style={styles.mobileHeader}>
              {/* <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <IconComponent
                  name="arrow-back"
                  size={20}
                  color="#6366F1"
                />
              </TouchableOpacity> */}
              <View style={styles.titleContainer}>
                <Text allowFontScaling ={false} 
                numberOfLines={1}
                style={styles.welcomeText}>Welcome Back! 👋</Text>
                <Text
                numberOfLines={1} allowFontScaling ={false} style={styles.mobileSubtitle}>Sign in to your account</Text>
              </View>
            </View>
          )}
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          {/* Desktop Header */}
          {(dimensions.isTablet || dimensions.isDesktop) && (
            <View style={styles.desktopHeader}>
              {dimensions.isTablet && (
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                  <IconComponent
                    name="arrow-back"
                    size={20}
                    color={colors.colorPrimary}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.titleContainer}>
                <Text allowFontScaling ={false} style={styles.title}>Welcome Back! 👋</Text>
                <Text allowFontScaling ={false} style={styles.subtitle}>Sign in to your account</Text>
              </View>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formFields}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text allowFontScaling ={false} numberOfLines={1} style={styles.inputLabel}>Email Address</Text>
              <View allowFontScaling ={false} numberOfLines={1} style={getInputStyle('email', formData.email)}>
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
                <Text allowFontScaling ={false}
                numberOfLines={1} style={styles.errorText}>Please enter a valid email</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text allowFontScaling={false} 
              numberOfLines={1}
              style={styles.inputLabel}>Password</Text>
              <View style={getInputStyle('password', formData.password)}>
                <IconComponent {...getInputIcon('password', formData.password)} size={20} />
                <TextInput
                  ref={passwordRef}
                  style={[styles.textInput, isWeb && { outline: 'none', border: 'none' }]}
                  placeholder="Enter your password"
                  allowFontScaling={false}
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
                <Text  allowFontScaling ={false}
                numberOfLines={1}
                style={styles.errorText}>Please enter your password</Text>
              )}
            </View>

            {/* Forgot Password Link */}
            {/* <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              disabled={isLoading}
            >
              <Text style={[styles.forgotPasswordText, isLoading && styles.disabledText]}>
                Forgot Password?
              </Text>
            </TouchableOpacity> */}

            {/* Login Button */}
            <LinearGradient colors={[colors.colorPrimaryLite, colors.colorPrimary]}
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            >
             <TouchableOpacity
              style={{alignItems:'center',justifyContent:'center' }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
            </LinearGradient>

            {/* Signup Link */}
            <View style={styles.signupLinkContainer}>
              <Text allowFontScaling={false}
              numberOfLines={1} style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={goToSignup} disabled={isLoading}>
                <Text allowFontScaling={false}
              numberOfLines={1}  style={[styles.signupLink, isLoading && styles.disabledText]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 30,
    zIndex: 1,
  },
  logo: {
    height: 60,
    width: 180,
    alignSelf: 'center',
    marginBottom: 20,
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
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
    elevation: 4,
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 32,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 20 },
    // shadowOpacity: 0.15,
    // shadowRadius: 40,
    elevation: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '400',
  },
  formFields: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
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
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.colorPrimary,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginTop:4,
    // shadowColor: colors.colorPrimary,
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.3,
    // shadowRadius: 16,
    // elevation: 2,
   
  },
  loginButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  signupText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  signupLink: {
    fontSize: 12,
    color: colors.colorPrimary,
    fontWeight: '700',
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default Login;