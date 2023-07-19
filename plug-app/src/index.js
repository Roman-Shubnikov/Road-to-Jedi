import 'core-js/es/map'; 
import 'core-js/es/set';
import React from 'react';
import { AdaptiveApp } from './App.js';
import mVKMiniAppsScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';
import {platform, Platform} from '@vkontakte/vkui';
import { createRoot } from 'react-dom/client';
import erudaModule from './eruda';


if(platform() === Platform.IOS) {
    mVKMiniAppsScrollHelper(root); 
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<AdaptiveApp />)

if (process.env.NODE_ENV === 'development') {
  erudaModule()
}

