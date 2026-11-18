import AsyncStorage from "@react-native-async-storage/async-storage";
import { isWeb } from "./dimension";

export const storage = {
  setItem: async (key, value) => {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
      return true;
    } catch (error) {
      console.error("Storage setItem error:", error);
      return false;
    }
  },

  getItem: async (key) => {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error("Storage getItem error:", error);
      return null;
    }
  },

  removeItem: async (key) => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error("Storage removeItem error:", error);
      return false;
    }
  },

  // Clear all storage
  clear: async () => {
    try {
      if (isWeb) {
        localStorage.clear();
      } else {
        await AsyncStorage.clear();
      }
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  },

  // Get multiple items
  getMultiple: async (keys) => {
    try {
      if (isWeb) {
        const result = {};
        keys.forEach(key => {
          result[key] = localStorage.getItem(key);
        });
        return result;
      } else {
        const result = await AsyncStorage.multiGet(keys);
        return Object.fromEntries(result);
      }
    } catch (error) {
      console.error("Storage getMultiple error:", error);
      return {};
    }
  },

  // Set multiple items
  setMultiple: async (keyValuePairs) => {
    try {
      if (isWeb) {
        Object.entries(keyValuePairs).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
      } else {
        const pairs = Object.entries(keyValuePairs);
        await AsyncStorage.multiSet(pairs);
      }
      return true;
    } catch (error) {
      console.error("Storage setMultiple error:", error);
      return false;
    }
  },

  // User-specific storage methods
  user: {
    // Store user info
    setUserInfo: async (userInfo) => {
      try {
        const { accessToken, access_token, refreshToken, refresh_token, ...profile } = userInfo;
        const stored = await storage.setItem('userData', JSON.stringify(profile));
        if (!stored) throw new Error('Unable to store user profile.');

        const nextAccessToken = accessToken || access_token;
        const nextRefreshToken = refreshToken || refresh_token;
        if (nextAccessToken && !(await storage.user.setAccessToken(nextAccessToken))) {
          throw new Error('Unable to store access token.');
        }
        if (nextRefreshToken && !(await storage.user.setRefreshToken(nextRefreshToken))) {
          throw new Error('Unable to store refresh token.');
        }

        return true;
      } catch (error) {
        console.error("Error storing user info:", error);
        return false;
      }
    },

    // Get user info
    getUserInfo: async () => {
      try {
        const userData = await storage.getItem('userData');
        if (!userData) return null;

        const profile = JSON.parse(userData);
        const { accessToken, access_token, refreshToken, refresh_token, ...userProfile } = profile;
        if (accessToken || access_token) {
          await storage.user.setAccessToken(accessToken || access_token);
        }
        if (refreshToken || refresh_token) {
          await storage.user.setRefreshToken(refreshToken || refresh_token);
        }
        if (accessToken || access_token || refreshToken || refresh_token) {
          await storage.setItem('userData', JSON.stringify(userProfile));
        }
        return userProfile;
      } catch (error) {
        console.error("Error getting user info:", error);
        return null;
      }
    },

    // Get access token
    getAccessToken: async () => {
      try {
        if (isWeb) {
          const currentToken = sessionStorage.getItem('accessToken');
          if (currentToken) return currentToken;

          const legacyToken = localStorage.getItem('accessToken');
          if (legacyToken) {
            sessionStorage.setItem('accessToken', legacyToken);
            localStorage.removeItem('accessToken');
          }
          return legacyToken;
        }
        return await AsyncStorage.getItem('accessToken');
      } catch (error) {
        console.error("Error getting access token:", error);
        return null;
      }
    },

    // Set access token
    setAccessToken: async (token) => {
      try {
        if (isWeb) {
          sessionStorage.setItem('accessToken', token);
          localStorage.removeItem('accessToken');
        } else {
          await AsyncStorage.setItem('accessToken', token);
        }
        return true;
      } catch (error) {
        console.error("Error setting access token:", error);
        return false;
      }
    },

    getRefreshToken: async () => {
      try {
        if (isWeb) {
          const currentToken = sessionStorage.getItem('refreshToken');
          if (currentToken) return currentToken;

          const legacyToken = localStorage.getItem('refreshToken');
          if (legacyToken) {
            sessionStorage.setItem('refreshToken', legacyToken);
            localStorage.removeItem('refreshToken');
          }
          return legacyToken;
        }
        return await AsyncStorage.getItem('refreshToken');
      } catch (error) {
        console.error("Error getting refresh token:", error);
        return null;
      }
    },

    setRefreshToken: async (token) => {
      try {
        if (isWeb) {
          sessionStorage.setItem('refreshToken', token);
          localStorage.removeItem('refreshToken');
        } else {
          await AsyncStorage.setItem('refreshToken', token);
        }
        return true;
      } catch (error) {
        console.error("Error setting refresh token:", error);
        return false;
      }
    },

    // Clear user data
    clearUserData: async () => {
      try {
        const removed = await Promise.all([
          storage.removeItem('userData'),
          storage.removeItem('isLoggedIn'),
          storage.removeItem('accessToken'),
          storage.removeItem('refreshToken'),
        ]);
        if (isWeb) {
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
        }
          return removed.every(Boolean);
      } catch (error) {
        console.error("Error clearing user data:", error);
        return false;
      }
    }
  },

  // App preferences and settings
  preferences: {
    // Store filter preferences
    setFilterPreference: async (filter) => {
      try {
        await storage.setItem('preferredFilter', filter);
        return true;
      } catch (error) {
        console.error("Error setting filter preference:", error);
        return false;
      }
    },

    getFilterPreference: async () => {
      try {
        return await storage.getItem('preferredFilter') || '';
      } catch (error) {
        console.error("Error getting filter preference:", error);
        return '';
      }
    },

    // Store grid view preferences
    setGridView: async (viewType) => {
      try {
        await storage.setItem('gridView', viewType);
        return true;
      } catch (error) {
        console.error("Error setting grid view:", error);
        return false;
      }
    },

    getGridView: async () => {
      try {
        return await storage.getItem('gridView') || 'grid';
      } catch (error) {
        console.error("Error getting grid view:", error);
        return 'grid';
      }
    },

    // Store theme preference
    setTheme: async (theme) => {
      try {
        await storage.setItem('theme', theme);
        return true;
      } catch (error) {
        console.error("Error setting theme:", error);
        return false;
      }
    },

    getTheme: async () => {
      try {
        return await storage.getItem('theme') || 'light';
      } catch (error) {
        console.error("Error getting theme:", error);
        return 'light';
      }
    },

    // Store sort preferences
    setSortPreference: async (sortType) => {
      try {
        await storage.setItem('sortPreference', sortType);
        return true;
      } catch (error) {
        console.error("Error setting sort preference:", error);
        return false;
      }
    },

    getSortPreference: async () => {
      try {
        return await storage.getItem('sortPreference') || 'default';
      } catch (error) {
        console.error("Error getting sort preference:", error);
        return 'default';
      }
    }
  },

  // Search and history functionality
  search: {
    // Add to search history
    addToSearchHistory: async (query) => {
      try {
        if (!query || query.trim() === '') return false;
        
        const history = await storage.getItem('searchHistory');
        const searches = history ? JSON.parse(history) : [];
        
        // Remove if already exists and add to beginning
        const filteredSearches = searches.filter(item => item !== query);
        const updatedSearches = [query, ...filteredSearches].slice(0, 10);
        
        await storage.setItem('searchHistory', JSON.stringify(updatedSearches));
        return true;
      } catch (error) {
        console.error("Error adding to search history:", error);
        return false;
      }
    },

    // Get search history
    getSearchHistory: async () => {
      try {
        const history = await storage.getItem('searchHistory');
        return history ? JSON.parse(history) : [];
      } catch (error) {
        console.error("Error getting search history:", error);
        return [];
      }
    },

    // Clear search history
    clearSearchHistory: async () => {
      try {
        await storage.removeItem('searchHistory');
        return true;
      } catch (error) {
        console.error("Error clearing search history:", error);
        return false;
      }
    },

    // Remove specific search from history
    removeFromSearchHistory: async (query) => {
      try {
        const history = await storage.getItem('searchHistory');
        if (!history) return true;
        
        const searches = JSON.parse(history);
        const updatedSearches = searches.filter(item => item !== query);
        
        await storage.setItem('searchHistory', JSON.stringify(updatedSearches));
        return true;
      } catch (error) {
        console.error("Error removing from search history:", error);
        return false;
      }
    }
  },

  // Recently viewed items
  recent: {
    // Add to recently viewed
    addToRecentlyViewed: async (item) => {
      try {
        if (!item || !item._id) return false;
        
        const recent = await storage.getItem('recentlyViewed');
        const items = recent ? JSON.parse(recent) : [];
        
        // Remove if already exists and add to beginning
        const filteredItems = items.filter(i => i._id !== item._id);
        const updatedItems = [item, ...filteredItems].slice(0, 20);
        
        await storage.setItem('recentlyViewed', JSON.stringify(updatedItems));
        return true;
      } catch (error) {
        console.error("Error adding to recently viewed:", error);
        return false;
      }
    },

    // Get recently viewed
    getRecentlyViewed: async () => {
      try {
        const recent = await storage.getItem('recentlyViewed');
        return recent ? JSON.parse(recent) : [];
      } catch (error) {
        console.error("Error getting recently viewed:", error);
        return [];
      }
    },

    // Clear recently viewed
    clearRecentlyViewed: async () => {
      try {
        await storage.removeItem('recentlyViewed');
        return true;
      } catch (error) {
        console.error("Error clearing recently viewed:", error);
        return false;
      }
    },

    // Remove from recently viewed
    removeFromRecentlyViewed: async (itemId) => {
      try {
        const recent = await storage.getItem('recentlyViewed');
        if (!recent) return true;
        
        const items = JSON.parse(recent);
        const updatedItems = items.filter(item => item._id !== itemId);
        
        await storage.setItem('recentlyViewed', JSON.stringify(updatedItems));
        return true;
      } catch (error) {
        console.error("Error removing from recently viewed:", error);
        return false;
      }
    }
  },

  // Favorites functionality
  favorites: {
    // Add to favorites
    addToFavorites: async (item) => {
      try {
        if (!item || !item._id) return false;
        
        const favorites = await storage.getItem('favorites');
        const items = favorites ? JSON.parse(favorites) : [];
        
        // Check if already exists
        if (items.find(i => i._id === item._id)) {
          return true; // Already in favorites
        }
        
        items.push(item);
        await storage.setItem('favorites', JSON.stringify(items));
        return true;
      } catch (error) {
        console.error("Error adding to favorites:", error);
        return false;
      }
    },

    // Remove from favorites
    removeFromFavorites: async (itemId) => {
      try {
        const favorites = await storage.getItem('favorites');
        if (!favorites) return true;
        
        const items = JSON.parse(favorites);
        const updatedItems = items.filter(item => item._id !== itemId);
        
        await storage.setItem('favorites', JSON.stringify(updatedItems));
        return true;
      } catch (error) {
        console.error("Error removing from favorites:", error);
        return false;
      }
    },

    // Get favorites
    getFavorites: async () => {
      try {
        const favorites = await storage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
      } catch (error) {
        console.error("Error getting favorites:", error);
        return [];
      }
    },

    // Check if item is favorite
    isFavorite: async (itemId) => {
      try {
        const favorites = await storage.getFavorites();
        return favorites.some(item => item._id === itemId);
      } catch (error) {
        console.error("Error checking favorite status:", error);
        return false;
      }
    },

    // Clear all favorites
    clearFavorites: async () => {
      try {
        await storage.removeItem('favorites');
        return true;
      } catch (error) {
        console.error("Error clearing favorites:", error);
        return false;
      }
    }
  },

  // Configuration and responsive settings
  config: {
    // Store responsive grid configuration
    setGridConfig: async (config) => {
      try {
        await storage.setItem('gridConfig', JSON.stringify(config));
        return true;
      } catch (error) {
        console.error("Error setting grid config:", error);
        return false;
      }
    },

    getGridConfig: async () => {
      try {
        const config = await storage.getItem('gridConfig');
        return config ? JSON.parse(config) : null;
      } catch (error) {
        console.error("Error getting grid config:", error);
        return null;
      }
    },

    // Store store item configuration
    setStoreItemConfig: async (config) => {
      try {
        await storage.setItem('storeItemConfig', JSON.stringify(config));
        return true;
      } catch (error) {
        console.error("Error setting store item config:", error);
        return false;
      }
    },

    getStoreItemConfig: async () => {
      try {
        const config = await storage.getItem('storeItemConfig');
        return config ? JSON.parse(config) : null;
      } catch (error) {
        console.error("Error getting store item config:", error);
        return null;
      }
    }
  },

  // Analytics and tracking
  analytics: {
    // Track share statistics
    trackShare: async (itemId, platform = 'general') => {
      try {
        const stats = await storage.getItem('shareStats');
        const shareStats = stats ? JSON.parse(stats) : {};
        
        if (!shareStats[itemId]) {
          shareStats[itemId] = { total: 0, platforms: {} };
        }
        
        shareStats[itemId].total += 1;
        shareStats[itemId].platforms[platform] = (shareStats[itemId].platforms[platform] || 0) + 1;
        shareStats[itemId].lastShared = Date.now();
        
        await storage.setItem('shareStats', JSON.stringify(shareStats));
        return true;
      } catch (error) {
        console.error("Error tracking share:", error);
        return false;
      }
    },

    // Get share statistics
    getShareStats: async (itemId = null) => {
      try {
        const stats = await storage.getItem('shareStats');
        const shareStats = stats ? JSON.parse(stats) : {};
        
        return itemId ? shareStats[itemId] || null : shareStats;
      } catch (error) {
        console.error("Error getting share stats:", error);
        return itemId ? null : {};
      }
    },

    // Track view statistics
    trackView: async (itemId) => {
      try {
        const stats = await storage.getItem('viewStats');
        const viewStats = stats ? JSON.parse(stats) : {};
        
        if (!viewStats[itemId]) {
          viewStats[itemId] = { count: 0, firstViewed: Date.now() };
        }
        
        viewStats[itemId].count += 1;
        viewStats[itemId].lastViewed = Date.now();
        
        await storage.setItem('viewStats', JSON.stringify(viewStats));
        return true;
      } catch (error) {
        console.error("Error tracking view:", error);
        return false;
      }
    },

    // Get view statistics
    getViewStats: async (itemId = null) => {
      try {
        const stats = await storage.getItem('viewStats');
        const viewStats = stats ? JSON.parse(stats) : {};
        
        return itemId ? viewStats[itemId] || null : viewStats;
      } catch (error) {
        console.error("Error getting view stats:", error);
        return itemId ? null : {};
      }
    },

    // Clear analytics data
    clearAnalytics: async () => {
      try {
        const analyticsKeys = ['shareStats', 'viewStats'];
        await Promise.all(analyticsKeys.map(key => storage.removeItem(key)));
        return true;
      } catch (error) {
        console.error("Error clearing analytics:", error);
        return false;
      }
    }
  },

  // Utility methods for app data
  app: {
    // Store app state
    setAppState: async (state) => {
      try {
        await storage.setItem('appState', JSON.stringify(state));
        return true;
      } catch (error) {
        console.error("Error setting app state:", error);
        return false;
      }
    },

    // Get app state
    getAppState: async () => {
      try {
        const state = await storage.getItem('appState');
        return state ? JSON.parse(state) : {};
      } catch (error) {
        console.error("Error getting app state:", error);
        return {};
      }
    },

    // Store onboarding status
    setOnboardingComplete: async (isComplete = true) => {
      try {
        await storage.setItem('onboardingComplete', isComplete.toString());
        return true;
      } catch (error) {
        console.error("Error setting onboarding status:", error);
        return false;
      }
    },

    // Check onboarding status
    isOnboardingComplete: async () => {
      try {
        const status = await storage.getItem('onboardingComplete');
        return status === 'true';
      } catch (error) {
        console.error("Error getting onboarding status:", error);
        return false;
      }
    },

    // Store app version
    setAppVersion: async (version) => {
      try {
        await storage.setItem('appVersion', version);
        return true;
      } catch (error) {
        console.error("Error setting app version:", error);
        return false;
      }
    },

    // Get app version
    getAppVersion: async () => {
      try {
        return await storage.getItem('appVersion') || '1.0.0';
      } catch (error) {
        console.error("Error getting app version:", error);
        return '1.0.0';
      }
    }
  }
};

export default storage;