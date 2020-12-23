import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import TimeAgo from "javascript-time-ago";

import vi from "javascript-time-ago/locale/vi";
TimeAgo.addLocale(vi);
TimeAgo.setDefaultLocale("vi");
ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById("root")
);
