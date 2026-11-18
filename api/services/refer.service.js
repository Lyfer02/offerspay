import API from "../axios";
import { endpoints } from "../endPoints";

export const referService = {
    refer : ()=>API.get(endpoints.refer.get)
}