import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Suspense } from "react";
import "./i18next/i18n"
import Loader from "./Container2/loading/Loader";

import { Provider } from "react-redux";
import store from "./store";

const container = document.getElementById("root");
const root = createRoot(container);

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js').then((registration) => {
//           console.log('ServiceWorker registration successful with scope: ', registration.scope);

//           registration.onupdatefound = () => {
//               const installingWorker = registration.installing;
//               installingWorker.onstatechange = () => {
//                   if (installingWorker.state === 'installed') {
//                       if (navigator.serviceWorker.controller) {
//                           // Новое содержимое доступно, перезагружаем страницу
//                           window.location.reload();
//                       }
//                   }
//               };
//           };
//       }).catch((error) => {
//           console.error('ServiceWorker registration failed: ', error);
//       });
//   });
// }



root.render(
  // <React.StrictMode>
    <Suspense fallback={<div><Loader /></div>}>
      <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
      </BrowserRouter>
    </Suspense>
  // </React.StrictMode>
);
