import { PermissionsAndroid, Platform } from "react-native";
import { ErrorModalService } from "../modalService";
import messaging from "@react-native-firebase/messaging";
import storage from "../storage";
const requestToken =  async ()=>{
    if (Platform.OS === 'web') return;
    try {
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await messaging().getToken();
        if(fcmToken)
        {
            console.log("this is generated  fcm token", fcmToken);
            await storage.setItem('fcmToken', fcmToken);
        }
        
        
    } catch (error) {
        console.log("this is token request Error ",error);
        
    }
}
export const requestNotificationPermission = async ()=>{
    if (Platform.OS === 'web') return;
    try {
        let granted = true;
    
        // Android 13+ (API 33+) ke liye POST_NOTIFICATIONS permission
        if (Platform.OS === 'android') {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
    
          granted = result === PermissionsAndroid.RESULTS.GRANTED;
          if (!granted) {
            ErrorModalService.error('Notification permission denied. You will not receive deal alerts!');
            return false;
          }
        }
    
        // iOS pe automatically permission maangta hai getToken() call karne pe
        const authStatus = await messaging().requestPermission({
          alert: true,
          announcement: false,
          badge: true,
          carPlay: false,
          provisional: false,
          sound: true,
        });
    
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (!enabled && Platform.OS === 'ios') {
          ErrorModalService.error('Please enable notifications in Settings');
          return false;
        }
    
        // Ab token generate karo
        await requestToken();
    
        return true;
      } catch (error) {
        console.error('Permission request failed:', error);
        return false;
      }
}
