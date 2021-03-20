import 'core-js/es/map'; 
import 'core-js/es/set';
import React from 'react';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom';
// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";
import App from './App.js';
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';
import {store} from "./store"

// Sentry.init({
//     dsn: "https://0045161b140249dcbc378fe70d966605@o461731.ingest.sentry.io/5465956",
//     integrations: [
//       new Integrations.BrowserTracing(),
//     ],

//     tracesSampleRate: 2.0,
//   });


const root = document.getElementById('root');
if(platform() === IOS) {
    mVKMiniAppsScrollHelper(root); 
}
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)
ReactDOM.render(<ReduxApp/>, root);


