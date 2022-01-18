import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { NotificationContainer } from "react-notifications";

// todo: use less with typescript

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <NotificationContainer />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
