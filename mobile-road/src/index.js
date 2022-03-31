import 'core-js/es/map'; 
import 'core-js/es/set';
import React from 'react';
import { Provider } from "react-redux";
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing/esm/browser/index.js";
import App from './App.js';
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';
import {store} from "./store"

// if(process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://34ca0a5a48b14267b5a18b350b171de6@o461731.ingest.sentry.io/6295150",
    integrations: [new BrowserTracing()],
  
    tracesSampleRate: 1.0,
  });
// }

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


