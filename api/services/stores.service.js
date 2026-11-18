import API from "../axios";
import { endpoints } from "../endPoints";


export const  storeService = {

    list: (page = 1, filters = {}) => {
  const params = { 
    page: page,
    ...filters  // Spread all filters as individual parameters
  };
  
  return API.get(endpoints.stores.list, { params });
},

  
    getById: (id) => API.get(endpoints.stores.getById(id)),

}