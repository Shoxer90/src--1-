importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp( {
  apiKey: "AIzaSyBLFIdFQbhE32TtfhNPEbIkIfTAnxw46RM",
  authDomain: "storex-45b2e.firebaseapp.com",
  projectId: "storex-45b2e",
  storageBucket: "storex-45b2e.firebasestorage.app",
  messagingSenderId: "931894215046",
  appId: "1:931894215046:web:be53ad4dccb7373a93ac07"
});

const messaging = firebase.messaging();
    
navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
  messaging.useServiceWorker(registration);
});

messaging.onBackgroundMessage(async(payload) => {
  console.log(payload, "messaging-sw");

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    clients.forEach(client => {
      client.postMessage({ type: 'REFRESH_PAGE', payload });
    });
  });

});

