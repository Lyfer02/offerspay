import API from "../axios";
import { endpoints } from "../endPoints";


export const authService ={
    login : (formData)=>API.post(endpoints.auth.login,formData),
    logout :()=>API.post(endpoints.auth.logout),
    signup :  (formData)=>API.post(endpoints.auth.signup,formData),
    refreshToken: (refreshToken) => API.post(endpoints.auth.refreshToken, { refreshToken }),
    updateFcmToken: (data) => API.post(endpoints.auth.updateFcmToken, data), // Send { fcmToken: token }
    clearFcmToken: ()=>API.post(endpoints.auth.clearFcmToken)
}
