/**
 * @fileoverview Managing Undo, Redo
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import _ from 'lodash/fp';
import {resetScene} from './types';

const undoStack = makeStackProxy(canUndoStateMutater);
const redoStack = makeStackProxy(canRedoStateMutater);

const MAX_STACK_SIZE = 50;

let currentStore;
let isResetByDo = false;

/**
 * Do manager vuex plugin
 * @param {object} store store
 */
export const doManagerPlugin = store => {
  currentStore = store;

  store.subscribeAction((action, state) => {
    if (action.type.startsWith('scene/')) {
      pushNewState(state.scene);
    }
  });

  store.subscribe(mutation => {
    if (mutation.type === `scene/${resetScene}` && !isResetByDo) {
      resetDoStack();
    }
  });
};

/**
 * Control do stacks
 * @param {[]} popStack stack be popped
 * @param {[]} pushStack stack be pushed
 */
function doControl(popStack, pushStack) {
  const nextState = popStack.pop();
  pushStack.push(_.cloneDeep(currentStore.state.scene));
  isResetByDo = true;
  currentStore.commit(`scene/${resetScene}`, nextState);
  isResetByDo = false;
}

/**
 * Redo
 */
export function redo() {
  if (canRedo()) {
    doControl(redoStack, undoStack);
  }
}

/**
 * Undo
 */
export function undo() {
  if (canUndo()) {
    doControl(undoStack, redoStack);
  }
}

/**
 * Can undo?
 * @returns {bool} result
 */
export function canUndo() {
  return undoStack.length > 0;
}

/**
 * Can redo?
 * @returns {bool} result
 */
export function canRedo() {
  return redoStack.length > 0;
}

/**
 * Reset undo, redo stack
 */
export function resetDoStack() {
  undoStack.length = 0;
  redoStack.length = 0;
}

function pushNewState(state) {
  if (undoStack.length === MAX_STACK_SIZE) {
    undoStack.shift();
  }

  undoStack.push(_.cloneDeep(state));

  if (redoStack.length) {
    redoStack.length = 0;
  }
}

function canUndoStateMutater(bool) {
  currentStore.commit('canUndo', bool);
}

function canRedoStateMutater(bool) {
  currentStore.commit('canRedo', bool);
}

function makeStackProxy(stateMutater) {
  return new Proxy([], {
    set: (target, key, value) => {
      target[key] = value;

      if (key === 'length') {
        if (value === 0) {
          stateMutater(false);
        } else {
          stateMutater(true);
        }
      }

      return true;
    }
  });
}
