import Vue from 'vue';
import Vuex from 'vuex';

import * as root from './root';
import * as tools from './tools';
import scene from './scene';
import page from './page';
import imageList from './imageList';
import {doManagerPlugin} from './doManager';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  plugins: [doManagerPlugin],
  modules: {
    scene,
    page,
    tools,
    imageList
  },
  ...root
});
