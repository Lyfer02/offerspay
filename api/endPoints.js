export const endpoints = {
  auth: {
    login: 'api/v1/users/login',
    signup: 'api/v1/users/register',
    session: 'api/v1/users/current-user',
    logout: 'api/v1/users/logout',
    refreshToken: 'api/v1/users/refresh-token',
    updateFcmToken : 'api/v1/fcm/update-token-fcm',
    clearFcmToken : 'api/v1/fcm/clear-token-fcm'
  },
  banners: {
    list: 'api/v1/banners',
    getById: id => `api/v1/banners/${id}`,
  },

  product: {
    list: 'api/v1/products',
    getById: id => `api/v1/products/${id}`,
    recordActivity: id => `api/v1/products/analytics/${id}/record`,
    mostSharedList: 'api/v1/products/analytics/top/most-shared',
    flashList: 'api/v1/products',
  },

  videos: {
    list: 'api/v1/videos',
  },

  users: {
    list: 'api/v1/users/get-users',
    updateProfile: 'api/v1/users/update-profile-picture',

    getById: id => `api/v1/users/admin/${id}`,
    update: 'api/v1/users/update-details',
  },
  stores: {
    list: 'api/v1/stores',
    getById: id => `api/v1/stores/${id}`,
  },
  dashboard: {
    home: 'api/v1/dashboard/user-home-data',
  },
  tracking :{
    generate_link : '/api/generate-link',
    clicks : '/api/v1/clicks',
    shortLinkHistory : 'api/v1/shortLinks'
},
wallet :{
  getUserWalletHistory : 'api/v1/walletHistory/user',
  export : 'api/v1/walletHistory/export-excel',
  userWalletBalance : 'api/v1/walletHistory/get-wallet-details'
},
refer :{
  get :"api/v1/images/get-share-data",
},
notification:{
  get:"api/v1/notifications",
  markSeen : `api/v1/notifications/mark-seen`
}

};
