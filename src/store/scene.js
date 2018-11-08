import _ from 'lodash';

import Vue from 'vue';

import * as attributes from './attributes';
import elementsModule from './scene.elements';
import {
  selectedElements,
  lastSectionId,
  currentAddingTargetId,
  setSectionIds,
  updatePageBackground,
  resetScene,
  selectElement,
  clearSelectedElementIds,
  removeSection,
  moveSectionToUp,
  moveSectionToDown,
  changeColumnCount,
  childrenIds,
  getParentSectionElementHeight,
  isSceneElement,
  isMonopolyColumn,
  isPossibleAddElement,
  isPossibleAddFullColumnElement
} from './types';

export default {
  namespaced: true,

  modules: {
    elements: elementsModule
  },

  state: {
    pageId: '',
    sectionIds: [],
    selectedElementIds: [],
    background: {}
  },

  getters: {
    ...attributes.getters,
    [selectedElements]({selectedElementIds, elements}) {
      return selectedElementIds.map(id => elements[id]);
    },

    [lastSectionId]({sectionIds}) {
      return sectionIds[sectionIds.length - 1];
    },

    [currentAddingTargetId]({elements}, {lastSectionId}) {
      let id;

      if (lastSectionId && elements[lastSectionId].children.length) {
        [id] = elements[lastSectionId].children;
      }

      return id;
    },

    [childrenIds]({elements}) {
      return elementId => {
        return _.cloneDeep(elements[elementId].children);
      };
    },

    [getParentSectionElementHeight]({elements}) {
      return elementId => {
        const columnId = elements[elementId].parentId;
        const sectionId = elements[columnId].parentId;

        return elements[sectionId].attrs.dimension.height;
      };
    },

    [isMonopolyColumn]({elements}) {
      return elementId => {
        const element = elements[elementId];

        return element && element.children.some(childId => !!elements[childId].fullColumn);
      };
    },

    [isPossibleAddElement]({sectionIds}, getters) {
      const hasSection = !!sectionIds.length;

      return hasSection && !getters.isMonopolyColumn(getters.currentAddingTargetId);
    },

    [isPossibleAddFullColumnElement]({sectionIds}, getters) {
      const hasSection = !!sectionIds.length;
      const hasElement = getters.childrenIds(getters.currentAddingTargetId).length;

      return hasSection && !hasElement;
    },

    [isSceneElement]({elements}) {
      return elementId => {
        return !!elements[elementId];
      };
    }
  },

  mutations: {
    ...attributes.mutations,

    [setSectionIds](state, sectionIds) {
      state.sectionIds = sectionIds;
    },

    [updatePageBackground](state, {type, value}) {
      state.background.type = type;
      state.background.value = value;
    },

    [resetScene](state, {pageId, sectionIds, elements, background}) {
      state.pageId = pageId;
      state.sectionIds = _.cloneDeep(sectionIds);
      state.elements = _.cloneDeep(elements);
      state.background = _.cloneDeep(background);
      state.selectedElementIds.splice(0, state.selectedElementIds.length);
    },

    [selectElement]({selectedElementIds}, {id}) {
      if (selectedElementIds.length) {
        selectedElementIds.splice(0, selectedElementIds.length);
      }
      selectedElementIds.push(id);
    },

    [clearSelectedElementIds]({selectedElementIds}) {
      selectedElementIds.splice(0, selectedElementIds.length);
    },

    [removeSection](state, {id}) {
      const {sectionIds, elements} = state;
      const {children: colIds} = elements[id];

      sectionIds.splice(sectionIds.indexOf(id), 1);

      colIds.forEach(colId => {
        elements[colId].children.forEach(elId => {
          Vue['delete'](elements, elId);
        });

        Vue['delete'](elements, colId);
      });

      Vue['delete'](elements, id);
    }
  },

  actions: {
    ...attributes.actions,

    [setSectionIds]({commit}, sectionIds) {
      commit(setSectionIds, sectionIds);
    },

    [updatePageBackground]({commit}, newBackground) {
      commit(updatePageBackground, newBackground);
    },

    [moveSectionToUp]({commit, state}, id) {
      const sectionIds = [...state.sectionIds];
      const fromIndex = sectionIds.indexOf(id);
      const prevIndex = fromIndex - 1;
      const prevId = sectionIds[prevIndex];

      sectionIds[prevIndex] = id;
      sectionIds[fromIndex] = prevId;

      commit(setSectionIds, sectionIds);
    },

    [moveSectionToDown]({commit, state}, id) {
      const sectionIds = [...state.sectionIds];
      const fromIndex = sectionIds.indexOf(id);
      const nextIndex = fromIndex + 1;
      const nextId = sectionIds[nextIndex];

      sectionIds[nextIndex] = id;
      sectionIds[fromIndex] = nextId;

      commit(setSectionIds, sectionIds);
    },

    [changeColumnCount]({commit, dispatch, getters}, {sectionId, column}) {
      dispatch('updateAttr', {
        id: sectionId,
        type: 'column',
        newAttr: column
      });

      const childrens = getters.childrenIds(sectionId);
      const [adoptiveParent] = childrens;
      const spliceCount = childrens.length - column;

      if (spliceCount > 0) {
        const removeElements = childrens.slice(-1 * spliceCount, childrens.length);

        removeElements.forEach(removeId => {
          getters.childrenIds(removeId).forEach(orphanId => {
            commit('changeParent', {
              id: orphanId,
              originalParentId: removeId,
              newParentId: adoptiveParent
            });
          });
        });

        removeElements.forEach(removeId => {
          commit('removeElement', {
            id: removeId
          });
        });
      } else {
        const createElementCount = spliceCount * -1;
        dispatch('addNewColumns', {
          sectionId: sectionId,
          columnCount: createElementCount
        });
      }
    }
  }
};
