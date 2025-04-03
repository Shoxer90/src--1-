import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBLFIdFQbhE32TtfhNPEbIkIfTAnxw46RM",
  authDomain: "storex-45b2e.firebaseapp.com",
  projectId: "storex-45b2e",
  storageBucket: "storex-45b2e.firebasestorage.app",
  messagingSenderId: "931894215046",
  appId: "1:931894215046:web:be53ad4dccb7373a93ac07"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const vapidKey = "BL9M8IRH_J6IAHVHod8G0_aVhdQfSDlAJBQ76VIYpnfGeCxtsbMuV3uxrP0ZjLLN0SPWu2CigsToA-2KVW9JI5c"

export const generateToken = async() => {
  const permission = await Notification.requestPermission();
  if(permission === "granted") {
    const token = await getToken(messaging, { vapidKey: vapidKey })
    console.log(token,"token")
    return token
  }
}



export const db = getFirestore(app);

// export { messaging, getToken, onMessage };



// export const requestFirebaseNotificationPermission = async () => {
//   try {
//     const token = await getToken(messaging, { vapidKey: vapidKey });
//     localStorage.setItem("notifToken", JSON.stringify(token))
//     console.log('FCM Token:', token);
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//   }
// };

// export const listenForNotifications = () => {
//   onMessage(messaging, (payload) => {
//     console.log('Message received. ', payload);
//     // Здесь вы можете обновить состояние вашего приложения или показать уведомление
//   });
// };


