// src/navigation/AuthContext.js - Fixed version
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react';
import storage from '../src/utils/storage';
import { authService } from '../api/services/auth.service';
import { subscribeToSessionExpiration } from '../src/utils/authSession';
// import messaging from '@react-native-firebase/messaging';
// User model definition
class UserModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.accessToken = data.accessToken || data.access_token || '';
    this.refreshToken = data.refreshToken || data.refresh_token || '';
    this.profileImage = data.profileImage || data.profile_image || '';
    this.phone = data.phone || '';
    this.earnings = data.earnings || 0;
    this.referralCode = data.referralCode || data.referral_code || '';
    this.createdAt = data.createdAt || data.created_at || '';
    this.updatedAt = data.updatedAt || data.updated_at || '';
  }

  isEmpty() {
    return !this.id && !this.email && !this.accessToken;
  }

  isTokenValid() {
    return !!this.accessToken;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(() => new UserModel());

  // Use refs to prevent infinite loops
  const hasCheckedAuth = useRef(false);
  const isCheckingAuth = useRef(false);
  const mountedRef = useRef(true);

  // ✅ SOLUTION 1: Create a ref to hold the current user state for use in callbacks
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);


  // Clear user data - removed from dependencies to prevent loops
  const clearUserData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      await Promise.all([
        storage.user.clearUserData(),
        storage.removeItem('isLoggedIn'),
        storage.removeItem('fcmToken')
      ]);

      if (mountedRef.current) {
        setUser(new UserModel());
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }, []);

  // Check login status from storage
  const checkLoginStatus = useCallback(async () => {
    // Prevent multiple simultaneous checks
    if (hasCheckedAuth.current || isCheckingAuth.current) {
      return;
    }

    hasCheckedAuth.current = true;
    isCheckingAuth.current = true;

    try {
      if (!mountedRef.current) return;

      setIsLoading(true);

      const [userData, loggedInFlag, accessToken, refreshToken] = await Promise.all([
        storage.user.getUserInfo(),
        storage.getItem('isLoggedIn'),
        storage.user.getAccessToken(),
        storage.user.getRefreshToken(),
      ]);

      if (!mountedRef.current) return;

      if (userData && loggedInFlag === 'true') {
        const userModel = new UserModel({ ...userData, accessToken, refreshToken });

        if (!userModel.isEmpty() && userModel.isTokenValid()) {
          setUser(userModel);
          setIsLoggedIn(true);
        } else {
          // Clear invalid data without calling clearUserData to prevent loops
          setUser(new UserModel());
          setIsLoggedIn(false);
          // Clear storage asynchronously
          Promise.all([
            storage.user.clearUserData(),
            storage.removeItem('isLoggedIn')
          ]).catch(console.error);
        }
      } else {
        setUser(new UserModel());
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      if (mountedRef.current) {
        setUser(new UserModel());
        setIsLoggedIn(false);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
      isCheckingAuth.current = false;
    }
  }, []); // Empty dependencies to prevent loops

  // Login function
  const login = useCallback(async (userData) => {
    try {
      const userModel = new UserModel(userData);
      if (userModel.isEmpty() || !userModel.isTokenValid()) {
        throw new Error('Invalid user data or token');
      }

      const [profileStored, loginFlagStored] = await Promise.all([
        storage.user.setUserInfo(userData),
        storage.setItem('isLoggedIn', 'true')
      ]);
      if (!profileStored || !loginFlagStored) {
        throw new Error('Unable to persist the signed-in session.');
      }

      if (mountedRef.current) {
        setUser(userModel);
        setIsLoggedIn(true);
      }

      return { success: true, user: userModel };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const fcmToken = await storage.getItem('fcmToken');

    // 2. Delete from server (if token exists)
    if (fcmToken) {
      try {
       const res= await authService.clearFcmToken();
        console.log('FCM token deleted from server',res.data);
      } catch (err) {
        console.warn('Failed to delete FCM token from server', err);
        // Continue logout even if API fails
      }
    }
    await storage.removeItem('fcmToken');
  //  await storage.removeItem('fcmTokenLastSent'); // optional

    // 4. Cancel ALL local notifications (Notifee)
   // await notifee.cancelAllNotifications();

    // 5. Unregister FCM (optional – prevents new token generation)
    // await messaging().deleteToken();

      await clearUserData();
      hasCheckedAuth.current = false; // Reset the flag
      isCheckingAuth.current = false;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }, [clearUserData]);

  // Update user - use functional update to avoid stale closures
  const updateUser = useCallback(async (updatedData) => {
    try {
      setUser(currentUser => {
        const updatedUser = new UserModel({ ...currentUser, ...updatedData });
        // Update storage asynchronously
        storage.user.setUserInfo(updatedUser).catch(console.error);
        return updatedUser;
      });
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = await storage.user.getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(currentRefreshToken);
      const tokenData = response.data?.data || response.data;
      if (!tokenData?.accessToken) {
        throw new Error('The refresh response did not contain an access token.');
      }

      await storage.user.setAccessToken(tokenData.accessToken);
      await storage.user.setRefreshToken(tokenData.refreshToken || currentRefreshToken);
      const refreshedUser = new UserModel({
        ...userRef.current,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken || currentRefreshToken,
      });
      setUser(refreshedUser);
      return { success: true, user: refreshedUser };
    } catch (error) {
      console.error('Refresh token error:', error);
      await clearUserData();
      return { success: false, error: error.message };
    }
  }, [clearUserData]);

  // Initialize auth check only once
  useEffect(() => {
    mountedRef.current = true;

    // Only run if we haven't checked yet
    if (!hasCheckedAuth.current && !isCheckingAuth.current) {
      checkLoginStatus();
    }

    const unsubscribe = subscribeToSessionExpiration(() => {
      hasCheckedAuth.current = false;
      clearUserData();
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [checkLoginStatus, clearUserData]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      isLoading,
      user,
      login,
      logout,
      updateUser,
      refreshToken,
      checkLoginStatus: () => {
        // Reset flags and check again
        hasCheckedAuth.current = false;
        isCheckingAuth.current = false;
        return checkLoginStatus();
      }
    }),
    [isLoggedIn, isLoading, user, login, logout, updateUser, refreshToken, checkLoginStatus]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;