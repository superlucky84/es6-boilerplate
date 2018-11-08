import Vue from 'vue';
import PortalVue from 'portal-vue';

import store from './store';

import {setGlobalOptions} from '@/helpers/globalOptions';

import globalKeymap from '@/plugins/globalKeymap';

import './directives';
import '../assets/css/import_new.css';
import '../assets/css/edit_new.css';
import '../assets/css/fe-override.css';

import '../node_modules/tui-color-picker/dist/tui-color-picker.css';
import '../node_modules/swiper/dist/css/swiper.min.css';

import App from './components/App.vue';
import * as serverStub from '@/helpers/serverStub';

import {
  updateSnsState,
  updateBoardState,
  updateMapState,
  updateProductCategoryState,
  updateProductSectionState
} from '@/store/types';

// Portal Vue - https://linusborg.github.io/portal-vue/#/guide
Vue.use(PortalVue);
Vue.config.productionTip = false;

Vue.use(globalKeymap);

/**
 * Get new instance
 * @param {object} options options
 * @returns {object}
 */
export function wysiwygContentsEditor(options) {
  setGlobalOptions(options);

  const vm = new Vue({
    el: options.el,
    store,
    render: h => h(App)
  });

  return {
    vm,
    updateSnsState(state) {
      store.commit(updateSnsState, state);
    },
    updateBoardState(state) {
      store.commit(updateBoardState, state);
    },
    updateMapState(state) {
      store.commit(updateMapState, state);
    },
    updateProductCategoryState(state) {
      store.commit(updateProductCategoryState, state);
    },
    updateProductSectionState(state) {
      store.commit(updateProductSectionState, state);
    }
  };
}

if (process.env.NODE_ENV === 'development') {
  const el = document.createElement('div');
  document.body.insertBefore(el, document.body.firstChild);

  window.wce = wysiwygContentsEditor({
    el,
    ...serverStub
  });
}
