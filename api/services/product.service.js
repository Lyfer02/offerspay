import API from "../axios";
import { endpoints } from "../endPoints";

export const productService = {

    list: (page = 1, filters = {}) => {
        const params = { 
            page: page,
            ...filters
        };
        
        return API.get(endpoints.product.list, { params });
    },

    getById: (id) => API.get(endpoints.product.getById(id)),

      // ✅ Record product click
  recordClick: (productId) => {
    return API.post(endpoints.product.recordActivity(productId), {
      action: "click",
    });
  },

  // ✅ Record product share
  recordShare: (productId, platform = "other") => {
    return API.post(endpoints.product.recordActivity(productId), {
      action: "share",
      platform,
    });
  },

   // ✅ Get Flash Deals (most clicked products)
  getFlashDeals: (page = 1, filters = {}) => {
    const params = { 
      page: page,
      ...filters  // Spread all filters as individual parameters
    };

    return API.get(endpoints.product.flashList, { params });
  },

  // ✅ Get Most Shared Deals
  getMostSharedDeals: (limit = 10) => {
    return API.get(endpoints.product.mostSharedList, {
      params: { limit },
    });
  },

    

}