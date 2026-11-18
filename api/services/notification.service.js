import API from "../axios";
import { endpoints } from "../endPoints";

export const notificationService = {
    getAllNotifications : (page = 1, filters = {})=>{
        const params = { 
            page: page,
            ...filters
        };
        
       return API.get(endpoints.notification.get,{params})
    },
     seen: (bulkData) =>{
       // console.log("this is path" ,endpoints.notification.markSeen );
        
        return API.patch(endpoints.notification.markSeen , bulkData,{
        headers: { 
            "Content-Type": "application/json" 
        }
     })
    },


} 