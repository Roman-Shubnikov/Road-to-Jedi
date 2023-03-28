import 'core-js/es/map'; 
import 'core-js/es/set';
import React from 'react';
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing/esm/browser/index.js";
import App from './App.js';
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, Platform} from '@vkontakte/vkui';
import { createRoot } from 'react-dom/client';
import {store} from "./store"
import erudaModule from './eruda';

// if(process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://34ca0a5a48b14267b5a18b350b171de6@o461731.ingest.sentry.io/6295150",
    integrations: [new BrowserTracing()],
  
    tracesSampleRate: 1.0,
  });
// }

if(platform() === Platform.IOS) {
    mVKMiniAppsScrollHelper(root); 
}

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<ReduxApp />)

if (process.env.NODE_ENV === 'development') {
  erudaModule()
}

