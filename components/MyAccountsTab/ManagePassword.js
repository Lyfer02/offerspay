import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../src/utils/color'
import defaultStyleSheet from '../../src/styles/defaultStylesSheet'
import { Button } from '@rneui/base';
import IconComponent from '../IconComponent';
import axios from 'axios'; // Make sure axios is installed

const ManagecurrentPassword = ({ navigation }) => {
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorcurrentPassword, setErrorcurrentPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [errorConfirmNewPassword, setErrorconfirmNewPassword] = useState('');

  const [iscurrentPasswordVisible, setIscurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isconfirmNewPasswordVisible, setIsConfirmNewtPasswordVisible] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility toggles remain the same
  const togglecurrentPasswordVisibility = () => {
    setIscurrentPasswordVisible(!iscurrentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setIsConfirmNewtPasswordVisible(!isconfirmNewPasswordVisible);
  };

  // Password validation functions remain the same
  const validatePassword = (password, isConfirmPassword = false) => {
    if (password.length === 0) {
      return 'Please enter the password';
    }

    if (!isConfirmPassword) {
      if (password.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Password must include an uppercase letter';
      }
      if (!/[a-z]/.test(password)) {
        return 'Password must include a lowercase letter';
      }
      if (!/\d/.test(password)) {
        return 'Password must include a number';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must include a special character';
      }
    }

    return '';
  };

  const validateConfirmPassword = (password) => {
    if (password.length === 0) {
      return 'Please confirm your new password';
    }
    if (password !== newPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  // New function to validate all fields
  const validateAllFields = () => {
    const currentPasswordError = validatePassword(currentPassword);
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setErrorcurrentPassword(currentPasswordError);
    setErrorNewPassword(newPasswordError);
    setErrorconfirmNewPassword(confirmPasswordError);

    return !currentPasswordError && !newPasswordError && !confirmPasswordError;
  };

  // Reset form function
  const resetForm = () => {
    setcurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorcurrentPassword('');
    setErrorNewPassword('');
    setErrorconfirmNewPassword('');
  };

  // Handle API errors
  const handleApiError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      Alert.alert('Error', error.response.data.message || 'Failed to update password');
    } else if (error.request) {
      // The request was made but no response was received
      Alert.alert('Error', 'Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate all fields first
      if (!validateAllFields()) {
        return;
      }

      // Check if new password is same as current
      if (currentPassword === newPassword) {
        setErrorNewPassword('New password must be different from current password');
        return;
      }

      setIsLoading(true);

      // Make API call to update password
      const response = await axios.post('YOUR_API_ENDPOINT/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers here
          // 'Authorization': `Bearer ${yourAuthToken}`
        }
      });

      // Handle success
      if (response.status === 200) {
        Alert.alert(
          'Success',
          'Password updated successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                resetForm();
                // Navigate back or to another screen if needed
                navigation.goBack();
              }
            }
          ]
        );
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new password change with real-time validation
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    setErrorNewPassword(validatePassword(text));
    
    // If confirm password is not empty, validate it again
    if (confirmPassword) {
      setErrorconfirmNewPassword(validateConfirmPassword(confirmPassword));
    }
  };

  // Rest of your render code remains the same until the Button component
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{padding:10, flex:1,}}>
        <ScrollView showsVerticalScrollIndicator={false}
        >
          {/* Previous JSX remains the same */}
          <View style={[styles.formContainer, defaultStyleSheet.shadowProvider]}>
            <Text style={styles.label}>Change Password</Text>
            
            {/* Current Password Field */}
            <Text style={[defaultStyleSheet.inputLabel, {marginTop: 8}]}>
              Current Password
            </Text>
            <View style={[
              (currentPassword.length < 1
                ? defaultStyleSheet.txtInputWrapper
                : errorcurrentPassword
                ? defaultStyleSheet.txtInputErrorWrapper
                : defaultStyleSheet.txtInputValidWrapper),
              defaultStyleSheet.shadowProvider
            ]}>
              <IconComponent
                name={'lock-closed'}
                size={28}
                color={
                  currentPassword.length < 1
                    ? colors.colorPrimary
                    : errorcurrentPassword
                    ? colors.red
                    : colors.green
                }
              />
              <TextInput
                style={defaultStyleSheet.txtInput}
                secureTextEntry={!iscurrentPasswordVisible}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={text => {
                  setcurrentPassword(text);
                  setErrorcurrentPassword(validatePassword(text));
                }}
                editable={!isLoading}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={togglecurrentPasswordVisibility}
                style={defaultStyleSheet.eyeIcon}
                disabled={isLoading}>
                <IconComponent
                  name={!iscurrentPasswordVisible ? 'eye-off' : 'eye'}
                  size={28}
                  color={
                    currentPassword.length < 1
                      ? colors.colorPrimary
                      : errorcurrentPassword
                      ? colors.red
                      : colors.green
                  }
                />
              </TouchableOpacity>
            </View>
            {currentPassword.length < 1 ? null : errorcurrentPassword ? (
              <Text style={defaultStyleSheet.errorText}>{errorcurrentPassword}</Text>
            ) : null}

            {/* New Password Field */}
            <Text style={[defaultStyleSheet.inputLabel, {marginTop: 8}]}>
              New Password
            </Text>
            <View style={[
              (newPassword.length < 1
                ? defaultStyleSheet.txtInputWrapper
                : errorNewPassword
                ? defaultStyleSheet.txtInputErrorWrapper
                : defaultStyleSheet.txtInputValidWrapper),
              defaultStyleSheet.shadowProvider
            ]}>
              <IconComponent
                name={'lock-closed'}
                size={28}
                color={
                  newPassword.length < 1
                    ? colors.colorPrimary
                    : errorNewPassword
                    ? colors.red
                    : colors.green
                }
              />
              <TextInput
                style={defaultStyleSheet.txtInput}
                secureTextEntry={!isNewPasswordVisible}
                placeholder="Enter New Password"
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                editable={!isLoading}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleNewPasswordVisibility}
                style={defaultStyleSheet.eyeIcon}
                disabled={isLoading}>
                <IconComponent
                  name={!isNewPasswordVisible ? 'eye-off' : 'eye'}
                  size={28}
                  color={
                    newPassword.length < 1
                      ? colors.colorPrimary
                      : errorNewPassword
                      ? colors.red
                      : colors.green
                  }
                />
              </TouchableOpacity>
            </View>
            {newPassword.length < 1 ? null : errorNewPassword ? (
              <Text style={defaultStyleSheet.errorText}>{errorNewPassword}</Text>
            ) : null}

            {/* Confirm Password Field */}
            <Text style={[defaultStyleSheet.inputLabel, {marginTop: 8}]}>
              Confirm New Password
            </Text>
            <View style={[
              (confirmPassword.length < 1
                ? defaultStyleSheet.txtInputWrapper
                : errorConfirmNewPassword
                ? defaultStyleSheet.txtInputErrorWrapper
                : defaultStyleSheet.txtInputValidWrapper),
              defaultStyleSheet.shadowProvider
            ]}>
              <IconComponent
                name={'lock-closed'}
                size={28}
                color={
                  confirmPassword.length < 1
                    ? colors.colorPrimary
                    : errorConfirmNewPassword
                    ? colors.red
                    : colors.green
                }
              />
              <TextInput
                style={defaultStyleSheet.txtInput}
                secureTextEntry={!isconfirmNewPasswordVisible}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={text => {
                  setConfirmPassword(text);
                  setErrorconfirmNewPassword(validateConfirmPassword(text));
                }}
                editable={!isLoading}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleConfirmNewPasswordVisibility}
                style={defaultStyleSheet.eyeIcon}
                disabled={isLoading}>
                <IconComponent
                  name={!isconfirmNewPasswordVisible ? 'eye-off' : 'eye'}
                  size={28}
                  color={
                    confirmPassword.length < 1
                      ? colors.colorPrimary
                      : errorConfirmNewPassword
                      ? colors.red
                      : colors.green
                  }
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length < 1 ? null : errorConfirmNewPassword ? (
              <Text style={defaultStyleSheet.errorText}>{errorConfirmNewPassword}</Text>
            ) : null}

            <TouchableOpacity
              style={{padding:10}}
              activeOpacity={0.7}
              disabled={isLoading}>
              <Text style={{color:colors.royalBlue,fontWeight:'800'}}>Forget Password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Button
          radius="sm"
          title={isLoading ? "Updating..." : "Submit"}
          onPress={handleSubmit}
          containerStyle={[styles.buttonContainer]}
          buttonStyle={styles.buttonStyle}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ManagecurrentPassword;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: colors.white,
    margin:10,
  },
  label: {
    color: colors.black,
    fontWeight: '600',
    margin: 4,
    fontSize:20,
  },
  formContainer:{
    backgroundColor:colors.white,
    borderRadius:5,
    width:'100%',
    alignSelf:'center',
    height:'100%',
    maxWidth:1024,
    padding:10,
    margin:10
  },
  buttonContainer: {
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    margin:20,
    alignSelf:'center',

  },
  buttonStyle: {
    backgroundColor: colors.colorPrimary,
    alignSelf:'center',
    maxWidth:1024,
    width: '100%',
  },
});