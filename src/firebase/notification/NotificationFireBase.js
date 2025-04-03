// import React, { memo, useEffect } from "react";
// // import { messaging, getToken, onMessage } from "./firebase-config";
// import { getToken, messaging, onMessage, vapidKey } from "../firebase";

// const NotificationFireBase = () => {
//   useEffect(() => {
//     // Запрос на разрешение на получение уведомлений
//     Notification.requestPermission().then(permission => {
//       if (permission === "granted") {
//         console.log("Notification permission granted.");
//         // Получение токена для push-уведомлений
//         getToken(messaging, { vapidKey: vapidKey})
//           .then((currentToken) => {
//             if (currentToken) {
//               console.log("Current token for client: ", currentToken);
//               // Сохраните токен на сервере или отправьте на API для отправки уведомлений
//             } else {
//               console.log("No registration token available.");
//             }
//           })
//           .catch((err) => {
//             console.log("An error occurred while retrieving token. ", err);
//           });
//       } else {
//         console.log("Notification permission denied.");
//       }
//     });

//     // Обработка входящих уведомлений, когда приложение активно
//     onMessage(messaging, (payload) => {
//       console.log("Message received. ", payload);
//       // Здесь можно показать уведомление с помощью Notification API
//       new Notification(payload.notification.title, {
//         body: payload.notification.body,
//       });
//     });
//   }, []);

//   return <div className="App">Push Notifications Example</div>;
// }

// export default memo(NotificationFireBase);