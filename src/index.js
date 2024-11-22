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


root.render(
    <Suspense fallback={<div><Loader /></div>}>
      <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
      </BrowserRouter>
    </Suspense>
);
