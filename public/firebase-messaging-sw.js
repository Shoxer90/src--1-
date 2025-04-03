// importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');
// importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');


importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js')

firebase.initializeApp( {
    apiKey: "AIzaSyBLFIdFQbhE32TtfhNPEbIkIfTAnxw46RM",
    authDomain: "storex-45b2e.firebaseapp.com",
    projectId: "storex-45b2e",
    storageBucket: "storex-45b2e.firebasestorage.app",
    messagingSenderId: "931894215046",
    appId: "1:931894215046:web:be53ad4dccb7373a93ac07"
  });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});