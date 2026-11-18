import API from "../axios";
import { endpoints } from "../endPoints";

export const userService ={
    getById : (id)=>API.get(endpoints.users.getById(id)),
    update : (formData)=>API.put(endpoints.users.update , formData),
    updateProfile : (avatar)=>{
           const formData = new FormData();
       
        if (avatar) {
            formData.append("avatar", avatar);
        }

         return API.put(endpoints.users.updateProfile, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

    },
     
               // Debug: Log FormData contents
    // console.log('FormData contents before sending:');
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    }