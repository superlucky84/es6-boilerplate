import _ from 'lodash';

import {
  resetScene,
  updatePageContents,
  canUndo,
  canRedo,
  loadPageToScene,
  savePageFromScene,
  initialize,
  loadEditingPageHistoryList,
  loadEditingPageContentsFromHistory,
  updateSnsState,
  updateBoardState,
  updateMapState,
  updateProductCategoryState,
  updateProductSectionState,
  getBoard
} from './types';
import {getGlobalOptions} from '@/helpers/globalOptions';

import {fetchPageHistoryList, fetchPageHistoryContents} from '@/helpers/api';

export const state = {
  canUndo: false,
  canRedo: false,
  historyList: [],
  links: {},
  sns: {
    settingUrl: '',
    enabled: false,
    imageList: []
  },
  board: {
    settingUrl: '',
    enabled: false,
    boardList: []
  },
  map: {
    settingUrl: '',
    enabled: false,
    mapInfo: {}
  },
  productCategory: {
    settingUrl: '',
    enabled: false,
    categoryList: []
  },
  productSection: {
    settingUrl: '',
    enabled: false,
    sectionList: []
  }
};

export const getters = {
  [getBoard]({board: {boardList}}) {
    return boardId => _.keyBy(boardList, 'boardId')[boardId];
  }
};

export const mutations = {
  [canUndo](_state, bool) {
    _state.canUndo = bool;
  },
  [canRedo](_state, bool) {
    _state.canRedo = bool;
  },
  [updateSnsState](_state, newState) {
    if (newState.enabled) {
      _state.sns.enabled = newState.enabled;
    }

    if (newState.imageList) {
      _state.sns.imageList = newState.imageList;
    }
  },
  [updateBoardState](_state, newState) {
    if (newState.enabled) {
      _state.board.enabled = newState.enabled;
    }

    if (newState.boardList) {
      _state.board.boardList = newState.boardList;
    }
  },
  [updateMapState](_state, newState) {
    if (newState.enabled) {
      _state.board.enabled = newState.enabled;
    }

    if (newState.mapInfo) {
      _state.board.mapInfo = newState.mapInfo;
    }
  },
  [updateProductCategoryState](_state, newState) {
    if (newState.enabled) {
      _state.board.enabled = newState.enabled;
    }

    if (newState.categoryList) {
      _state.board.categoryList = newState.categoryList;
    }
  },
  [updateProductSectionState](_state, newState) {
    if (newState.enabled) {
      _state.board.enabled = newState.enabled;
    }

    if (newState.sectionList) {
      _state.board.sectionList = newState.sectionList;
    }
  },
  resetPage(_state, {entities, linked, unlinked, fontFamily}) {
    _state.page.entities = entities;
    _state.page.linked = linked;
    _state.page.unlinked = unlinked;

    if (fontFamily) {
      _state.page.fontFamily = fontFamily;
    }
  },
  resetSns(_state, {settingUrl, enabled, imageList}) {
    _state.sns.settingUrl = settingUrl;
    _state.sns.enabled = enabled;
    _state.sns.imageList = imageList;
  },
  resetBoard(_state, {settingUrl, enabled, boardList}) {
    _state.board.settingUrl = settingUrl;
    _state.board.enabled = enabled;
    _state.board.boardList = boardList;
  },
  resetMap(_state, {settingUrl, enabled, mapInfo}) {
    _state.map.settingUrl = settingUrl;
    _state.map.enabled = enabled;
    _state.map.mapInfo = mapInfo;
  },
  resetProductCategory(_state, {settingUrl, enabled, categoryList}) {
    _state.productCategory.settingUrl = settingUrl;
    _state.productCategory.enabled = enabled;
    _state.productCategory.categoryList = categoryList;
  },
  resetProductSection(_state, {settingUrl, enabled, sectionList}) {
    _state.productSection.settingUrl = settingUrl;
    _state.productSection.enabled = enabled;
    _state.productSection.sectionList = sectionList;
  },
  setHistoryList(_state, newList) {
    _state.historyList = newList;
  },
  setLinks(_state, newLinks) {
    _state.links = newLinks;
  }
};

export const actions = {
  [loadPageToScene]({getters: _getters, commit, dispatch}, {id}) {
    const page = _getters.pageEntityById(id);

    commit(`scene/${resetScene}`, {
      pageId: id,
      ...page
    });

    dispatch('loadEditingPageHistoryList', id);
  },
  [savePageFromScene]({state: {scene}, commit, dispatch}) {
    const data = {
      id: scene.pageId,
      sectionIds: scene.sectionIds,
      elements: scene.elements,
      background: scene.background
    };

    const gOptions = getGlobalOptions(['updatePageContents']);

    gOptions.updatePageContents(_.cloneDeep(data));

    commit(updatePageContents, _.cloneDeep(data));
    dispatch('loadEditingPageHistoryList', data.id);
  },
  [initialize]({commit, dispatch}) {
    const gOptions = getGlobalOptions(['initialize']);

    gOptions.initialize(data => {
      commit('resetPage', data.page);
      commit('resetSns', data.sns);
      commit('resetBoard', data.board);
      commit('resetMap', data.map);
      commit('resetProductCategory', data.productCategory);
      commit('resetProductSection', data.productSection);
      commit('setLinks', data.links);

      dispatch(loadPageToScene, {id: 'index'});
    });
  },
  async [loadEditingPageHistoryList]({state: _state, commit}) {
    let list = await fetchPageHistoryList(_state.scene.pageId);

    commit('setHistoryList', list);
  },
  async [loadEditingPageContentsFromHistory]({state: _state, commit}, {id}) {
    let history = await fetchPageHistoryContents({
      pageId: _state.scene.pageId,
      id: id
    });

    commit(`scene/${resetScene}`, {
      pageId: history.pageId,
      ...history.contents
    });
  }
};
