import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles-premium-uk.css";
import "./styles-the-mechnic.css";
import App from "./App";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Toaster position="top-right" containerStyle={{ zIndex: 2147483646 }} />
    <App />
  </React.StrictMode>,
);

