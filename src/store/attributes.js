import Vue from 'vue';
import {updateAttrIfNeed, updateAttr} from './types';
import {forEach} from 'lodash';

export const getters = {};

export const mutations = {
  [updateAttrIfNeed]({elements}, {id, type, newAttr}) {
    const attrData = elements[id].attrs[type];

    if (typeof newAttr === 'object') {
      forEach(newAttr, (value, key) => {
        if (attrData[key] !== value) {
          Vue.set(attrData, key, value);
        }
      });
    } else if (attrData !== newAttr) {
      Vue.set(elements[id].attrs, type, newAttr);
    }
  }
};

export const actions = {
  [updateAttr]({commit}, {id, type, newAttr}) {
    commit(updateAttrIfNeed, {
      id,
      type,
      newAttr
    });
  }
};
