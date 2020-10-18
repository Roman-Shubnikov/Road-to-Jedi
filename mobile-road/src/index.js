import 'core-js/es/map'; 
import 'core-js/es/set';
import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vk-bridge';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from './App.js';
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, IOS} from '@vkontakte/vkui';

Sentry.init({
    dsn: "https://0045161b140249dcbc378fe70d966605@o461731.ingest.sentry.io/5465956",
    integrations: [
      new Integrations.BrowserTracing(),
    ],
  
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

connect.send('VKWebAppInit', {});
const root = document.getElementById('root');
if(platform() === IOS) {
    mVKMiniAppsScrollHelper(root); 
}

ReactDOM.render(<App />, root);

