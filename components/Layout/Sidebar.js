import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X, User, User2Icon, UserCircle } from 'lucide-react-native';
import { useAuth } from '../../navigation/AuthContext';
import { getVisibleRoutes } from '../../navigation/Routes';
import { colors } from '../../src/utils/color';

const Sidebar = ({ isOpen, onClose, onNavigate, activeRoute, isPermanent = false }) => {
  const { user } = useAuth();
  const visibleRoutes = getVisibleRoutes();
  
  //console.log('=== SIDEBAR DEBUG ===');
  //console.log('Active Route in Sidebar:', activeRoute);
  //console.log('Visible Routes:', visibleRoutes.map(r => ({ name: r.name, label: r.label, visible: r.visible })));
  //console.log('==================');
  
  const handleRoutePress = (routeName, routePath) => {
    //console.log('Navigating to:', routeName);
    onNavigate(routeName, routePath);
    // Only close the sidebar if it is NOT permanent
    if (!isPermanent) {
      onClose();
    }
  };

  // Helper function to check if a route is active
  const isRouteActive = (route) => {
    // Direct match first
    if (activeRoute === route.name) {
      //console.log(`✓ DIRECT MATCH: ${route.name}`);
      return true;
    }
    
    // Tab route mappings - based on your BottomTabNavigator
    const tabRouteMappings = {
      'Home': ['Home'],
      'Store': ['Store', 'Stores'], // Your Routes.js might use "Stores"
      'MakeLink': ['MakeLink', 'Convert', 'Converter'], // Your Routes.js might use "Convert"
      'MyActivity': ['MyActivity', 'Activity'], // Your Routes.js might use "Activity"
      'Profile': ['Profile']
    };
    
    // Check if this route should match the current active route
    const possibleNames = tabRouteMappings[route.name] || [route.name];
    const isMatch = possibleNames.includes(activeRoute);
    
    if (isMatch) {
      //console.log(`✓ MAPPED MATCH: ${route.name} matches ${activeRoute}`);
    }
    
    return isMatch;
  };

  if (!isOpen) return null;

  // This is the actual sidebar UI
  const SidebarContent = (
    <View style={styles.sidebar}>
      {/* Header */}
      <View style={styles.sidebarHeader}>
        <View style={styles.userInfo}>
          {/* <UserCircle size={40} color={colors.colorPrimary} /> */}
          {/* <View style={[styles.profileImgContainer, defaultStyleSheet.shadowProvider]}>
                        {user?.profileImage ? (
                          <Image
                            style={styles.profileImage}
                            resizeMode="cover"
                            source={{ uri: user.profileImage }}
                          />
                        ) : (
                          <View style={styles.initialsContainer}>
                            <Text style={styles.initialsText}>
                              {getInitials(user?.name || user?.email)}
                            </Text>
                          </View>
                        )}
                      </View> */}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
        {/* Only show the close button if it's not a permanent sidebar */}
        {!isPermanent && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation */}
      <ScrollView style={styles.navigationContainer}>
        {visibleRoutes.map((route, index) => {
          const IconComponent = route.icon;
          const isActive = isRouteActive(route);
          
          //console.log(`Route: ${route.name}, Label: ${route.label}, Active: ${isActive}`);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.navigationItem,
                isActive && styles.navigationItemActive
              ]}
              onPress={() => handleRoutePress(route.name, route.path)}
            >
              {IconComponent && (
                <IconComponent 
                  size={20} 
                  color={isActive ? colors.colorPrimary : '#666'} 
                />
              )}
              <Text style={[
                styles.navigationText,
                isActive && styles.navigationTextActive
              ]}>
                {route.label || route.name}
              </Text>
              {/* Debug indicator */}
              {isActive && (
                <View style={styles.activeIndicator}>
                  <Text style={styles.activeIndicatorText}>●</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.sidebarFooter}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );

  // If the sidebar is permanent, render it directly without an overlay
  if (isPermanent) {
    return SidebarContent;
  }

  // Otherwise, render it as an overlay with a backdrop for smaller screens
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      {SidebarContent}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles for the MODAL version on tablet/mobile
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 100,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Common styles for the sidebar panel
  sidebar: {
    width: 300,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    elevation: 5,
    height: '100%',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius:8,
    elevation:4,
    backgroundColor: colors.white,
    borderBottomWidth:1,
    borderBottomColor:colors.gray,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  navigationContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  navigationItemActive: {
    backgroundColor: `${colors.colorPrimary}15`,
  },
  navigationText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
    flex: 1,
  },
  navigationTextActive: {
    color: colors.colorPrimary,
    fontWeight: '600',
  },
  activeIndicator: {
    marginLeft: 8,
  },
  activeIndicatorText: {
    color: colors.colorPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default Sidebar;