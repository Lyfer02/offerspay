import API from "../axios";
import { endpoints } from "../endPoints";

export const walletHistory ={
    list: (params = {}) => {
        const { page = 1, limit = 10, startDate, endDate } = params;
        let query = `page=${page}&limit=${limit}`;
        if (startDate) query += `&startDate=${startDate}`;
        if (endDate) query += `&endDate=${endDate}`;
    
        return API.get(`${endpoints.wallet.getUserWalletHistory}?${query}`);
      },

    
    export: (query) => {
      return API.get(`${endpoints.wallet.export}?${query}`, {
        responseType: "blob", // ✅ Correct placement
        withCredentials: true, // if backend requires cookies/auth
      });

    },

    walletBalance :()=>{
        return API.get(endpoints.wallet.userWalletBalance)},
}