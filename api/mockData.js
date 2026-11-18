const today = new Date();
const dateOffset = days => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const demoUser = {
  _id: 'demo-user-001',
  fullName: 'Demo User',
  email: 'demo@offerspay.test',
  phone: '9876543210',
  avatar: '',
  gender: 'male',
  dateOfBirth: '1995-05-15T00:00:00.000Z',
  whatsappLink: '',
  panName: '',
  panNumber: '',
  gstApplicable: false,
  referralCode: 'DEMO2026',
  role: 'affiliate',
  status: 'active',
};

export const demoStores = [
  {
    _id: 'store-fashion',
    name: 'Style Avenue',
    image: '',
    earn: '12%',
    about: 'Fashion, footwear and everyday essentials.',
    status: 'active',
    rating: 4.7,
    trackingSpeed: 'Within 24 hours',
    confirmation: '60-90 days',
    earningRates: [{ category: 'Fashion', rate: '12%' }, { category: 'Accessories', rate: '8%' }],
    termsAndConditions: ['Commission is subject to the store terms.', 'Self-purchases may not qualify.'],
  },
  {
    _id: 'store-electronics',
    name: 'Gadget Harbor',
    image: '',
    earn: '8%',
    about: 'Electronics and accessories for work and home.',
    status: 'active',
    rating: 4.5,
    trackingSpeed: 'Within 24 hours',
    confirmation: '45-60 days',
    earningRates: [{ category: 'Accessories', rate: '8%' }, { category: 'Electronics', rate: '4%' }],
    termsAndConditions: ['Commission varies by product.', 'Cancelled orders are not eligible.'],
  },
  {
    _id: 'store-home',
    name: 'Home & Living',
    image: '',
    earn: '10%',
    about: 'Home decor, kitchen and lifestyle products.',
    status: 'active',
    rating: 4.6,
    trackingSpeed: 'Within 48 hours',
    confirmation: '60 days',
    earningRates: [{ category: 'Home', rate: '10%' }, { category: 'Kitchen', rate: '7%' }],
    termsAndConditions: ['Only completed orders are eligible for commission.'],
  },
  {
    _id: 'store-beauty',
    name: 'Glow Market',
    image: '',
    earn: '15%',
    about: 'Beauty, personal care and wellness products.',
    status: 'active',
    rating: 4.8,
    trackingSpeed: 'Within 24 hours',
    confirmation: '30-45 days',
    earningRates: [{ category: 'Beauty', rate: '15%' }, { category: 'Wellness', rate: '9%' }],
    termsAndConditions: ['Offers may change without notice.'],
  },
];

export const demoProducts = [
  {
    _id: 'product-headphones',
    name: 'Wireless Headphones',
    description: 'Comfortable wireless headphones with clear sound and all-day battery life.',
    startingPrice: 2499,
    earningRate: 8,
    productUrl: 'https://example.com/demo/headphones',
    sliderImages: [],
    logo: '',
    store: demoStores[1],
    rating: 4.6,
    totalReviews: 1240,
    category: 'Electronics',
    isFlashDeal: true,
    isMostShared: true,
  },
  {
    _id: 'product-sneakers',
    name: 'Everyday Sneakers',
    description: 'Lightweight sneakers made for comfortable daily wear.',
    startingPrice: 1899,
    earningRate: 12,
    productUrl: 'https://example.com/demo/sneakers',
    sliderImages: [],
    logo: '',
    store: demoStores[0],
    rating: 4.4,
    totalReviews: 860,
    category: 'Fashion',
    isFlashDeal: true,
    isMostShared: true,
  },
  {
    _id: 'product-coffee-maker',
    name: 'Compact Coffee Maker',
    description: 'A compact coffee maker for quick, fresh coffee at home.',
    startingPrice: 3299,
    earningRate: 10,
    productUrl: 'https://example.com/demo/coffee-maker',
    sliderImages: [],
    logo: '',
    store: demoStores[2],
    rating: 4.5,
    totalReviews: 532,
    category: 'Home',
    isFlashDeal: true,
    isMostShared: false,
  },
  {
    _id: 'product-skincare',
    name: 'Daily Skincare Set',
    description: 'A simple skincare routine with cleanser and moisturizer.',
    startingPrice: 999,
    earningRate: 15,
    productUrl: 'https://example.com/demo/skincare',
    sliderImages: [],
    logo: '',
    store: demoStores[3],
    rating: 4.8,
    totalReviews: 2100,
    category: 'Beauty',
    isFlashDeal: false,
    isMostShared: true,
  },
];

export const demoBanners = [
  { _id: 'banner-1', title: 'Discover deals and earn', image: '', url: '' },
  { _id: 'banner-2', title: 'Share your favorite finds', image: '', url: '' },
];

export const demoClicks = [
  { _id: 'click-1', offer: { name: demoProducts[0].name }, store: demoStores[1], shortUrl: 'https://offerspay.test/d/headphones', createdAt: dateOffset(0), status: 'tracked' },
  { _id: 'click-2', offer: { name: demoProducts[1].name }, store: demoStores[0], shortUrl: 'https://offerspay.test/d/sneakers', createdAt: dateOffset(1), status: 'tracked' },
  { _id: 'click-3', offer: { name: demoProducts[3].name }, store: demoStores[3], shortUrl: 'https://offerspay.test/d/skincare', createdAt: dateOffset(2), status: 'tracked' },
];

export const demoShortLinks = demoProducts.slice(0, 3).map((product, index) => ({
  _id: `link-${index + 1}`,
  offer: { name: product.name },
  store: product.store,
  shortCode: ['headphones', 'sneakers', 'coffee'][index],
  shortUrl: `https://offerspay.test/d/${['headphones', 'sneakers', 'coffee'][index]}`,
  createdAt: dateOffset(index),
}));

export const demoWalletEntries = [
  { _id: 'wallet-1', description: 'Commission - Wireless Headphones', amount: 199.92, status: 'confirmed', createdAt: dateOffset(1) },
  { _id: 'wallet-2', description: 'Commission - Everyday Sneakers', amount: 227.88, status: 'pending', createdAt: dateOffset(3) },
  { _id: 'wallet-3', description: 'Referral reward', amount: 100, status: 'confirmed', createdAt: dateOffset(5) },
];

export const demoNotifications = [
  { _id: 'notification-1', title: 'Welcome to OffersPay', message: 'Explore deals and share your links to start earning.', isSeen: false, createdAt: dateOffset(0), data: {} },
  { _id: 'notification-2', title: 'Commission tracked', message: 'A recent order has been tracked in your account.', isSeen: true, createdAt: dateOffset(2), data: {} },
];

export const demoWalletBalance = {
  total_withdrawn: 500,
  available_for_withdrawal: 1275.5,
  total_earned: 2050.25,
  pending_balance: 274.75,
  balance: 1550.25,
};
