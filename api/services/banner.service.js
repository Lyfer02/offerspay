import API from "../axios";
import { endpoints } from "../endPoints";

export const bannerService = {

list: (page = 1, filters = {}) => {
  const params = { 
    source: 'dashboard',
    page: page,
    ...filters  // Spread all filters as individual parameters
  };
  
  return API.get(endpoints.banners.list, { params });
},
 
    // ✅ Get banner by ID
    getById: (id) => API.get(endpoints.banners.getById(id)),


};
