import API from "../axios";
import { endpoints } from "../endPoints";

export const homeService ={
    home :()=> API.get(endpoints.dashboard.home),
}