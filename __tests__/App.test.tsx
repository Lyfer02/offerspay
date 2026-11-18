/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, jest} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer, {act} from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: require('react').forwardRef(
    ({children}: {children: React.ReactNode}, _ref: unknown) => children,
  ),
  getStateFromPath: () => undefined,
}));
jest.mock('../navigation/Routes', () => ({
  authRoutes: [],
  mainRoutes: [],
  publicRoutes: [],
}));
jest.mock('../navigation/AppNavigator', () => () => null);
jest.mock('../src/utils/Permission/permissions', () => ({
  requestNotificationPermission: () => undefined,
}));
jest.mock('../src/utils/PushNotification/pushNotification', () => ({
  setupPushNotifications: () => undefined,
}));
jest.mock('../navigation/AuthContext', () => ({
  AuthProvider: ({children}: {children: React.ReactNode}) => children,
}));
jest.mock('../src/utils/networkMonitor', () => ({
  startNetworkMonitoring: () => undefined,
}));
jest.mock('../src/utils/SplashNetworkChecker', () => ({
  runSplashNetworkCheck: () => new Promise(() => {}),
}));
jest.mock('react-native-paper-dates', () => ({
  registerTranslation: () => undefined,
}));
jest.mock('react-native-linear-gradient', () => ({
  __esModule: true,
  default: ({children}: {children: React.ReactNode}) => children,
}));
jest.mock('../src/utils/modalService', () => ({
  ModalProvider: ({children}: {children: React.ReactNode}) => children,
}));
jest.mock('../src/utils/loadingService', () => ({
  GlobalLoadingOverlay: () => null,
}));

it('renders correctly', () => {
  let app: renderer.ReactTestRenderer;
  act(() => {
    app = renderer.create(<App />);
  });
  act(() => {
    app.unmount();
  });
});
