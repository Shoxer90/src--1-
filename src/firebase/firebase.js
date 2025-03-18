// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
//   measurementId: "YOUR_MEASUREMENT_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBLFIdFQbhE32TtfhNPEbIkIfTAnxw46RM",
  authDomain: "storex-45b2e.firebaseapp.com",
  projectId: "storex-45b2e",
  storageBucket: "storex-45b2e.firebasestorage.app",
  messagingSenderId: "931894215046",
  appId: "1:931894215046:web:be53ad4dccb7373a93ac07"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const messaging = getMessaging(app);
const vapidKey = "BL9M8IRH_J6IAHVHod8G0_aVhdQfSDlAJBQ76VIYpnfGeCxtsbMuV3uxrP0ZjLLN0SPWu2CigsToA-2KVW9JI5c"

export const requestFirebaseNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: vapidKey });
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const listenForNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Здесь вы можете обновить состояние вашего приложения или показать уведомление
  });
};


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBLFIdFQbhE32TtfhNPEbIkIfTAnxw46RM",
//   authDomain: "storex-45b2e.firebaseapp.com",
//   projectId: "storex-45b2e",
//   storageBucket: "storex-45b2e.firebasestorage.app",
//   messagingSenderId: "931894215046",
//   appId: "1:931894215046:web:be53ad4dccb7373a93ac07"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);