// Routes.js - Direct imports (no lazy loading for now)
import {
  Home as HomeIcon,
  Store as StoreIcon,
  Link as LinkIcon,
  Activity as ActivityIcon,
  User2 as UserIcon,     // ← Use User2, not User
  DollarSign as EarningsIcon,
  Trophy as ContestsIcon,
  Zap as FlashIcon,
  Share2 as ShareIcon,
  Users as ReferIcon,
  MessageCircle as TelegramIcon,
  Bot as BotIcon,
  TrendingUp as TrendingIcon,
  BellIcon,
} from 'lucide-react-native';  // ← THIS LINE

// Direct imports - avoid circular dependencies
import OnboardingScreen from '../components/Auth/Onboarding';
import Landing from '../LangingPages/Landing';
import AboutUs from '../LangingPages/AboutUs';
import Terms from '../LangingPages/Terms';
import PrivacyPolicy from '../LangingPages/PrivacyPolicy';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import Home from '../BottomTabNavigation/TabComponents/Home';
import Stores from '../BottomTabNavigation/TabComponents/Stores';
import MakeLink from '../BottomTabNavigation/TabComponents/MakeLink';
import MyActivity from '../BottomTabNavigation/TabComponents/MyActivity';
import MyAccount from '../components/MyAccount';
import MyEarningsTab from '../components/MyEarnings';
import AllContests from '../components/All Contest/AllContests';
import FlashDeals from '../components/FlashDeals';
import MostSharedDealsScreen from '../components/MostSharedDealsScreen';
import ReferAndEarn from '../components/ReferAndEarn';
import TelegramConfigure from '../components/TelegramConfigure/TelegramConfigure';
import TelegramBotPage from '../components/TelegramConfigure/TelegramBotPage';
import ProductDetails from '../components/ProductDetails';
import TrendingStoresScreen from '../components/TrendingStoresScreen';
import ProfileTab from '../BottomTabNavigation/TabComponents/ProfileTab';
import Notifications from '../components/Notification';


let _visibleRoutesCache = null;
let _tabRoutesCache = null;

// ----------------------
// Public Routes (no auth required)
// ----------------------
export const publicRoutes = [
  {
    name: 'OnBoarding',
    component: OnboardingScreen,
    path: 'onboarding',
    visible: false,
  },
  {
    name: 'Landing',
    component: Landing,
    path: '',
    visible: false,
  },
  {
    name: 'AboutUs',
    component: AboutUs,
    path: 'about',
    visible: false,
  },
  {
    name: 'Terms',
    component: Terms,
    path: 'terms',
    visible: false,
  },
  {
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    path: 'privacy',
    visible: false,
  },
];

// ----------------------
// Auth Routes
// ----------------------
export const authRoutes = [
  {
    name: 'Login',
    component: Login,
    path: 'login',
    visible: false,
  },
  {
    name: 'Signup',
    component: Signup,
    path: 'signup',
    visible: false,
  },
];

// ----------------------
// Main Tab Routes (Bottom Navigation)
// ----------------------
export const tabRoutes = [
  {
    name: 'Home',
    component: Home,
    path: 'home',
    icon: HomeIcon,
    visible: true,
    tabVisible: true,
  },
  {
    name: 'Store',
    component: Stores,
    path: 'store',
    icon: StoreIcon,
    visible: true,
    tabVisible: true,
  },
  {
    name: 'MakeLink',
    component: MakeLink,
    path: 'converter',
    icon: LinkIcon,
    label: 'Convert',
    visible: true,
    tabVisible: true,
  },
  {
    name: 'MyActivity',
    component: MyActivity,
    path: 'activity',
    icon: ActivityIcon,
    label: 'Activity',
    visible: true,
    tabVisible: true,
  },
  {
    name: 'Profile',
    component: ProfileTab,
    path: 'profile',
    icon: UserIcon,
    label: 'Profile',
    visible: false,
    tabVisible: true,
  },
];

// ----------------------
// Additional Protected Routes
// ----------------------
export const additionalRoutes = [
  {
    name: 'MyAccount',
    component: MyAccount,
    path: 'account',
    icon: UserIcon,
    label: 'My Account',
    visible: true,
    tabVisible: false,
  },
  {
    name: 'MyEarnings',
    component: MyEarningsTab,
    path: 'earnings',
    icon: EarningsIcon,
    label: 'My Earnings',
    visible: true,
    tabVisible: false,
  },
  {
    name: 'AllContests',
    component: AllContests,
    path: 'contests',
    icon: ContestsIcon,
    label: 'All Contests',
    visible: false,
    tabVisible: false,
    options: { headerShown: true, title: 'All Contests' }
  },
  {
    name: 'FlashDeals',
    component: FlashDeals,
    path: 'flash-deals',
    icon: FlashIcon,
    label: 'Flash Deals',
    visible: true,
    tabVisible: false,
    options: { headerShown: false, title: 'Flash Deals' }
  },
  {
    name: 'MostSharedDeals',
    component: MostSharedDealsScreen,
    path: 'most-shared',
    icon: ShareIcon,
    label: 'Most Shared',
    visible: true,
    tabVisible: false,
    options: { headerShown: false, title: 'Most Shared Deals' }
  },
  {
    name: 'ReferAndEarn',
    component: ReferAndEarn,
    path: 'refer',
    icon: ReferIcon,
    label: 'Refer & Earn',
    visible: true,
    tabVisible: false,
    options: { headerShown: false ,title: '' }
  },
  {
    name: 'TelegramConfiguration',
    component: TelegramConfigure,
    path: 'telegram-config',
    icon: TelegramIcon,
    label: 'Telegram Config',
    visible: false,
    tabVisible: false,
  },
  {
    name: 'TelegramBotPage',
    component: TelegramBotPage,
    path: 'telegram-bot',
    icon: BotIcon,
    label: 'Telegram Bot',
    visible: false,
    tabVisible: false
  },
  {
    name: 'Notifications',
    component: Notifications,
    path: 'notifications',
    icon: BellIcon,
    label: 'Notification',
    visible: false,
    tabVisible: false,
  },
  {
    name: 'ProductDetailsScreen',
    component: ProductDetails,
    path: 'product/:id',
    parse: {id: id => String(id)},
    visible: false,
    tabVisible: false,
  },
  {
    name: 'TrendingStoresScreen',
    component: TrendingStoresScreen,
    path: 'trending-stores',
    icon: TrendingIcon,
    label: 'Trending Stores',
    visible: false,
    tabVisible: false,
  },
];

// Combined main routes
export const mainRoutes = [...tabRoutes, ...additionalRoutes];

// Get visible routes for sidebar with memoization
export const getVisibleRoutes = () => {
  if (!_visibleRoutesCache) {
    _visibleRoutesCache = mainRoutes.filter(route => route.visible);
  }
  return _visibleRoutesCache;
};

// Get tab routes for bottom navigation with memoization
export const getTabRoutes = () => {
  if (!_tabRoutesCache) {
    _tabRoutesCache = tabRoutes.filter(route => route.tabVisible);
  }
  return _tabRoutesCache;
};

// Clear cache if needed
export const clearRoutesCache = () => {
  _visibleRoutesCache = null;
  _tabRoutesCache = null;
};
