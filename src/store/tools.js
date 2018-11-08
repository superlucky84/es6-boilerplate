import {toggleToolPopup, closeAllToolPopup} from './types';

export const namespaced = true;

export const state = {
  openedPanels: ['tools']
};

export const getters = {};

export const mutations = {
  [toggleToolPopup]({openedPanels}, type) {
    const index = openedPanels.indexOf(type);

    if (index > -1) {
      openedPanels.splice(index, 1);
    } else {
      openedPanels.push(type);
    }
  },
  [closeAllToolPopup]({openedPanels}) {
    openedPanels.splice(1, openedPanels.length);
  }
};

export const actions = {};
