import {getId, defaults} from '../helpers/defaultStates';
import {
  setSectionIds,
  removeSection,
  addElement,
  changeParent,
  updateElement,
  removeElement,
  updateElementDimension,
  addNewText,
  modifyText,
  addNewImage,
  modifyImage,
  addNewSlider,
  addNewButton,
  addNewMenulist,
  addNewShopmenu,
  addNewProductList,
  addNewProductSlide,
  addNewMap,
  addNewVideo,
  addNewBoard,
  addNewShopinfo,
  addNewPolicy,
  addNewSection,
  copyToClipboard,
  pasteFromClipboard,
  cutToClipboard,
  deleteElements,
  addElements,
  addNewColumn,
  addNewColumns,
  addNewBox,
  addNewSns,
  elementToFront,
  elementToBack,
  elementToForward,
  elementToBackward,
  elementChildrenZIndexRearrange,
  replaceElementChildren
} from './types';
import Vue from 'vue';
import _ from 'lodash';

let clipboard = [];

function cloneEls(elements, _state) {
  return _.chain(elements)
    .cloneDeep()
    .forEach(element => {
      delete element.id;

      if (element.children) {
        const children = cloneEls(
          element.children.map(cid => {
            return _state[cid];
          }),
          _state
        );

        element.children = children;
      }
    })
    .value();
}

function saveElementsToClipboard(elements, _state) {
  clipboard = cloneEls(elements, _state);
}

function remakePasteElement(element, columnRect) {
  const NEXT_EXTRA_PX = 7;
  const dimension = element.attrs.dimension;
  const {width: columnWidth, height: columnHeight} = columnRect;
  let {top, left, width, height} = dimension;

  const checkDimensionWidth = left + width + NEXT_EXTRA_PX;
  const checkDimensionHeight = top + height + NEXT_EXTRA_PX;

  Object.assign(dimension, {
    left: checkDimensionWidth <= columnWidth ? left + NEXT_EXTRA_PX : left - NEXT_EXTRA_PX,
    top: checkDimensionHeight <= columnHeight ? top + NEXT_EXTRA_PX : top - NEXT_EXTRA_PX
  });
}

export default {
  state: {},

  mutations: {
    [addElement](state, {id = getId(), parentId, element}) {
      element.id = id;

      if (parentId) {
        if (element.type !== 'section' && element.type !== 'column') {
          const oldChildrenLen = state[parentId].children.length;
          element.attrs.dimension.zIndex += oldChildrenLen;
        }

        state[parentId].children.push(id);
        element.parentId = parentId;
      }

      Vue.set(state, id, element);
    },

    [changeParent](state, {id, originalParentId, newParentId}) {
      if (originalParentId !== newParentId) {
        let parentChildren = state[originalParentId].children;
        parentChildren.splice(parentChildren.indexOf(id), 1);

        parentChildren = state[newParentId].children;
        parentChildren.push(id);

        state[id].parentId = newParentId;
      }
    },

    [updateElement](state, {id, updating}) {
      _.merge(state[id], updating);
    },

    [removeElement](state, {id}) {
      const {parentId} = state[id];
      const parentChildren = state[parentId].children;

      parentChildren.splice(parentChildren.indexOf(id), 1);

      delete state[id];
    },
    [replaceElementChildren](state, {id, change}) {
      const {parentId} = state[id];
      const parentChildren = state[parentId].children;
      const oldIndex = parentChildren.indexOf(id);
      let newIndex = oldIndex + change;

      const el = parentChildren.splice(oldIndex, 1);

      parentChildren.splice(newIndex, 0, ...el);
    },
    [elementChildrenZIndexRearrange](state, {columnId}) {
      state[columnId].children.map(id => state[id]).forEach((el, index) => {
        el.attrs.dimension.zIndex = 100 + index;
      });
    }
  },

  actions: {
    [updateElementDimension]({commit}, {id, originalParentId, newParentId, updating}) {
      commit(changeParent, {
        id,
        originalParentId,
        newParentId
      });
      commit(updateElement, {
        id,
        updating
      });
    },

    [addNewText]({commit}, {parentId}) {
      const element = defaults.createText();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewBox]({commit}, {parentId}) {
      const element = defaults.createBox();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewSns]({commit}, {parentId}) {
      const element = defaults.createSns();
      commit(addElement, {
        parentId,
        element
      });
    },

    [modifyText]({commit}, {id, contents}) {
      commit(updateElement, {
        id,
        updating: {contents}
      });
    },

    [addNewImage]({commit}, {parentId, id = null}) {
      const element = defaults.createImage({image: {id}});
      commit(addElement, {
        parentId,
        element
      });
    },

    [modifyImage]({commit}, {id, imageAttrs}) {
      const updating = {attrs: {image: {...imageAttrs}}};
      commit(updateElement, {
        id,
        updating
      });
    },

    [addNewSlider]({commit}, {parentId}) {
      const element = defaults.createSlider();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewButton]({commit}, {parentId}) {
      const element = defaults.createButton();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewMenulist]({commit}, {parentId}) {
      const element = defaults.createHeaderMenus();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewShopmenu]({commit}, {parentId}) {
      const element = defaults.createHeaderIcons();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewProductList]({commit}, {type, id, parentId, columnCount, productCount, sortBy}) {
      const element = defaults.createProductList({type, id, columnCount, productCount, sortBy});
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewProductSlide]({commit}, {type, id, parentId, columnCount, productCount, sortBy}) {
      const element = defaults.createProductSlide({type, id, columnCount, productCount, sortBy});
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewMap]({commit}, {parentId}) {
      const element = defaults.createMap();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewVideo]({commit}, {parentId, url, autoplay, loop}) {
      const element = defaults.createVideo({url, autoplay, loop});
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewBoard]({commit}, {parentId, boardId, count}) {
      const element = defaults.createBoard({boardId, count});
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewShopinfo]({commit}, {parentId}) {
      const element = defaults.createFooterShopinfo();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewPolicy]({commit}, {parentId}) {
      const element = defaults.createFooterPolicy();
      commit(addElement, {
        parentId,
        element
      });
    },

    [addNewSection](
      {commit, rootState},
      {sectionId = getId(), columnCount = 1, backgroundImageId, backgroundColor, fullWidth = false} = {}
    ) {
      const section = defaults.createSection({
        image: {id: backgroundImageId},
        color: backgroundColor,
        column: columnCount,
        fullWidth
      });
      const newSectionIds = [...rootState.scene.sectionIds, sectionId];
      commit(addElement, {
        id: sectionId,
        element: section
      });

      while (columnCount) {
        const column = defaults.createColumn();

        commit(addElement, {
          element: column,
          parentId: sectionId
        });
        columnCount -= 1;
      }
      commit(setSectionIds, newSectionIds);
    },

    [addNewColumn]({commit}, {parentId}) {
      const column = defaults.createColumn();
      commit(addElement, {
        element: column,
        parentId: parentId
      });
    },

    [addNewColumns]({commit}, {sectionId, columnCount}) {
      while (columnCount) {
        const column = defaults.createColumn();

        commit(addElement, {
          element: column,
          parentId: sectionId
        });
        columnCount -= 1;
      }
    },

    [copyToClipboard]({getters, state: _state}) {
      saveElementsToClipboard(getters.selectedElements, _state);
    },

    [pasteFromClipboard]({commit, getters, state: _state, rootState, dispatch}, {columnsRect}) {
      clipboard.forEach(element => {
        if (element.type === 'section') {
          element.id = getId();
          dispatch(addElements, {elements: [element]});
          commit(setSectionIds, [...rootState.scene.sectionIds, element.id]);
        } else {
          let parentId = element.parentId;
          let parentElement = _state[parentId];

          if (parentElement) {
            remakePasteElement(element, columnsRect[parentId]);
          } else {
            parentId = getters.currentAddingTargetId;
          }

          commit(addElement, {
            parentId,
            element: _.cloneDeep(element)
          });
        }
      });
    },

    [cutToClipboard]({getters, dispatch, state: _state}) {
      saveElementsToClipboard(getters.selectedElements, _state);
      dispatch(deleteElements);
    },

    [deleteElements]({commit, getters}) {
      getters.selectedElements.forEach(element => {
        if (element.type === 'section') {
          commit(removeSection, {id: element.id});
        } else {
          commit(removeElement, {id: element.id});
        }
      });
    },
    [addElements]({commit, dispatch}, {elements, parentId}) {
      elements.forEach(el => {
        const id = el.id ? el.id : getId();

        const children = el.children;
        el.children = [];

        commit(addElement, {
          parentId,
          id: id,
          element: _.cloneDeep(el)
        });

        if (children && children.length) {
          dispatch(addElements, {elements: children, parentId: id});
        }
      });
    },
    [elementToFront]({rootState, state, commit}) {
      const selectedId = rootState.scene.selectedElementIds[0];
      const {parentId} = state[selectedId];

      commit(replaceElementChildren, {
        id: selectedId,
        change: state[parentId].children.length
      });

      commit(elementChildrenZIndexRearrange, {
        columnId: parentId
      });
    },
    [elementToBack]({rootState, state, commit}) {
      const selectedId = rootState.scene.selectedElementIds[0];
      const {parentId} = state[selectedId];

      commit(replaceElementChildren, {
        id: selectedId,
        change: -state[parentId].children.indexOf(selectedId)
      });

      commit(elementChildrenZIndexRearrange, {
        columnId: parentId
      });
    },
    [elementToForward]({rootState, state, commit}) {
      const selectedId = rootState.scene.selectedElementIds[0];
      const {parentId} = state[selectedId];

      commit(replaceElementChildren, {
        id: selectedId,
        change: 1
      });

      commit(elementChildrenZIndexRearrange, {
        columnId: parentId
      });
    },
    [elementToBackward]({rootState, state, commit}) {
      const selectedId = rootState.scene.selectedElementIds[0];
      const {parentId} = state[selectedId];

      commit(replaceElementChildren, {
        id: selectedId,
        change: -1
      });

      commit(elementChildrenZIndexRearrange, {
        columnId: parentId
      });
    }
  }
};
