import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyBLFIdFQbhE32TtfhNPEbIkIfTAnxw46RM",
  authDomain: "storex-45b2e.firebaseapp.com",
  projectId: "storex-45b2e",
  storageBucket: "storex-45b2e.firebasestorage.app",
  messagingSenderId: "931894215046",
  appId: "1:931894215046:web:be53ad4dccb7373a93ac07"
};
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/firebase-messaging-sw.js')
// }
// const app = initializeApp(firebaseConfig);


// const VAPID_KEY = "BL9M8IRH_J6IAHVHod8G0_aVhdQfSDlAJBQ76VIYpnfGeCxtsbMuV3uxrP0ZjLLN0SPWu2CigsToA-2KVW9JI5c";

// if ('serviceWorker' in navigator) {
//   await navigator.serviceWorker.register('/firebase-messaging-sw.js');
// }
// export const messaging = getMessaging(app);

// export const generateToken = async() => {
//   const permission = await Notification.requestPermission();
//   if(permission === "granted") {
//     const token = await getToken(messaging, {
//       vappidKey: VAPID_KEY
//     })
//     return token
//   }
// }

