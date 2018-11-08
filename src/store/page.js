import Vue from 'vue';
import * as api from '@/helpers/api';
import _ from 'lodash';
import {
  setLinkedPageIds,
  setUnlinkedPageIds,
  addPage,
  modifyPage,
  deletePage,
  switchLinked,
  isLinkedPage,
  pageEntityById,
  updatePageContents,
  updatePageBackground,
  updateAllPageBackground,
  changeFontFamily,
  fontFamilyStyle,
  updateHeaderElement
} from './types';

import {defaults} from '@/helpers/defaultStates';

import {getGlobalOptions} from '@/helpers/globalOptions';

const page = {
  state: {
    linked: [],
    fixedUnlinked: ['index', 'header', 'footer'],
    unlinked: [],
    entities: {
      index: defaults.createPage({title: '메인(필수)'}),
      header: defaults.createPage({title: '해더(필수)'}),
      footer: defaults.createPage({title: '푸터(필수)'})
    },
    fontFamily: '나눔고딕'
  },

  getters: {
    [isLinkedPage]: state => id => state.linked.includes(id),
    [pageEntityById]: state => id => state.entities[id],
    [fontFamilyStyle]: ({fontFamily}) =>
      `${fontFamily}, 'NanumGothic', ng, '돋움', Dotum, 'Apple SD Gothic Neo', sans-serif`
  },

  mutations: {
    [setLinkedPageIds](state, newIdList) {
      state.linked = newIdList;
    },

    [setUnlinkedPageIds](state, newIdList) {
      state.unlinked = newIdList;
    },

    [addPage](state, {id, title, url, isLinked}) {
      Vue.set(
        state.entities,
        id,
        defaults.createPage({
          title,
          url
        })
      );

      if (isLinked) {
        state.linked.push(id);
      } else {
        state.unlinked.push(id);
      }
    },

    // eslint-disable-next-line complexity
    [modifyPage](state, {id, title, url, isLinked}) {
      const entity = state.entities[id];

      isLinked = _.isBoolean(isLinked) ? isLinked : state.linked.includes(id);
      entity.title = title || entity.title;
      entity.url = url || entity.url;

      if (isLinked && state.unlinked.includes(id)) {
        const index = state.unlinked.indexOf(id);
        state.unlinked.splice(index, 1);
        state.linked.push(id);
      } else if (!isLinked && state.linked.includes(id)) {
        const index = state.linked.indexOf(id);
        state.linked.splice(index, 1);
        state.unlinked.push(id);
      }
    },

    [deletePage](state, id) {
      if (state.linked.includes(id)) {
        const index = state.linked.indexOf(id);
        state.linked.splice(index, 1);
      } else {
        const index = state.unlinked.indexOf(id);
        state.unlinked.splice(index, 1);
      }

      state.entities[id] = null;
    },

    [switchLinked](state, id) {
      if (state.linked.includes(id)) {
        const index = state.linked.indexOf(id);
        state.linked.splice(index, 1);
        state.unlinked.push(id);
      } else {
        const index = state.unlinked.indexOf(id);
        state.unlinked.splice(index, 1);
        state.linked.push(id);
      }
    },

    [updatePageContents](state, {id, sectionIds, elements, background}) {
      state.entities[id].sectionIds = sectionIds;
      state.entities[id].elements = elements;
      state.entities[id].background = background;
    },

    [updateAllPageBackground](state, {type, value}) {
      _.forEach(state.entities, pageEntity => {
        pageEntity.background.type = type;
        pageEntity.background.value = value;
      });
    },

    [changeFontFamily](state, {fontFamily}) {
      state.fontFamily = fontFamily;
    },

    [updateHeaderElement](state, {id, updating}) {
      const targetElement = state.entities.header.elements[id];
      _.merge(targetElement, updating);
    }
  },
  actions: {
    [updateAllPageBackground]({commit}, newBackground) {
      commit(updateAllPageBackground, newBackground);
      commit('scene/' + updatePageBackground, newBackground);
    },

    async [addPage]({commit, state}, {title, url, isLinked}) {
      const pageId = await api.createPage(defaults.createPage({title, url}));

      commit(addPage, {id: pageId, title, url, isLinked});

      api.updateMenus({
        linked: state.linked,
        unlinked: state.unlinked
      });
    },

    [modifyPage]({commit, state}, {id, title, url, isLinked}) {
      commit(modifyPage, {id, title, url, isLinked});

      api.updatePage({id, title, url});
      api.updateMenus({
        linked: state.linked,
        unlinked: state.unlinked
      });
    },
    [deletePage]({commit, state}, id) {
      commit(deletePage, id);

      api.deletePage(id);
      api.updateMenus({
        linked: state.linked,
        unlinked: state.unlinked
      });
    },
    [switchLinked]({commit, state}, id) {
      commit(switchLinked, id);

      api.updateMenus({
        linked: state.linked,
        unlinked: state.unlinked
      });
    },

    [setLinkedPageIds]({commit, state}, newIdList) {
      const allLinks = state.linked.concat(state.unlinked);
      const unlinkedList = _.difference(allLinks, newIdList);

      api.updateMenus({
        linked: newIdList,
        unlinked: unlinkedList
      });

      commit(setLinkedPageIds, newIdList);
      commit(setUnlinkedPageIds, unlinkedList);
    },

    [changeFontFamily]({commit}, {fontFamily}) {
      commit(changeFontFamily, {fontFamily});
      getGlobalOptions(['changeFontFamily']).changeFontFamily(fontFamily);
    }
  }
};

export default page;
