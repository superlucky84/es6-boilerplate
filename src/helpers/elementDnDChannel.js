import Vue from 'vue';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import store from '@/store';
import {updateElementDimension, clearSelectedElementIds, isMonopolyColumn, childrenIds} from '@/store/types';
import {preventUserSelect, restoreUserSelect} from '@/helpers/util';
import {resizeFn, adjustRatioSize} from '@/helpers/resizeHelper';
export {
  RESIZE_TL,
  RESIZE_T,
  RESIZE_TR,
  RESIZE_R,
  RESIZE_BR,
  RESIZE_B,
  RESIZE_BL,
  RESIZE_L
} from '@/helpers/resizeHelper';
export const MOVE = 'MOVE';

export default new Vue({
  store,

  data() {
    return {
      elementId: null,
      originalParentId: null,
      left: null,
      top: null,
      width: null,
      height: null,
      columnsRect: {},
      fixedRatio: null,
      draggable: null,
      shiftX: null,
      shiftY: null,
      actionType: null,
      savedDimension: null,
      focusedInput: null
    };
  },

  computed: {
    ...mapGetters('scene', [isMonopolyColumn, childrenIds]),
    currentColumnId() {
      const {columnsRect, left, top} = this;

      for (const [columnId, rect] of Object.entries(columnsRect)) {
        const {left: cLeft, right: cRight, top: cTop, bottom: cBottom} = rect;

        if (left >= cLeft && left < cRight && top >= cTop && top < cBottom) {
          return columnId;
        }
      }

      return null;
    },

    dimension() {
      const {left, top, width, height, fixedRatio} = this;

      return {left, top, width, height, fixedRatio};
    },

    limitRect() {
      let left = Infinity;
      let top = Infinity;
      let right = -Infinity;
      let bottom = -Infinity;

      for (const [, rect] of Object.entries(this.columnsRect)) {
        const {left: cLeft, right: cRight, top: cTop, bottom: cBottom} = rect;

        left = Math.min(cLeft, left);
        right = Math.max(cRight, right);
        top = Math.min(cTop, top);
        bottom = Math.max(cBottom, bottom);
      }

      return {
        top,
        left,
        right,
        bottom
      };
    },

    isSection() {
      return !this.originalParentId;
    }
  },
  watch: {
    currentColumnId() {
      if (this.fullColumn && this.currentColumnId) {
        const {width, height} = this.columnsRect[this.currentColumnId];
        this._setDimensionValues({
          width,
          height
        });

        this.$emit('update');
      }
    }
  },

  methods: {
    ...mapMutations('scene', {clearSelectedElementIds}),
    ...mapActions('scene', {updateElementDimension}),

    initDimension({elementId, parentId, isFixedRatio, draggable = true, fullColumn = false}, dimension) {
      this.reset();
      this.originalParentId = parentId;
      this.elementId = elementId;

      this._setDimensionValues(dimension);
      if (isFixedRatio) {
        this.fixedRatio = this.width / this.height;
      }
      this.draggable = draggable;
      this.fullColumn = fullColumn;
      this.$emit('init');
    },

    _setDimensionValues({left = this.left, top = this.top, width = this.width, height = this.height}) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
    },

    grab(ev, actionType) {
      this.actionType = actionType;
      this.$emit('grab');

      if (actionType === MOVE) {
        this.shiftX = ev.clientX - this.left;
        this.shiftY = ev.clientY - this.top;
      } else if (!this.draggable) {
        return;
      }

      preventUserSelect();
      window.addEventListener('mousemove', this._handleMouseMove);
      window.addEventListener('mouseup', this._handleMouseUp);
    },

    _handleMouseMove({clientX, clientY, pageX, pageY}) {
      if (this.actionType === MOVE) {
        this._moveFromMouse({clientX, clientY});
      } else {
        this._resizeFromMouse({pageX, pageY});
      }
    },

    _handleMouseUp() {
      this.actionType = null;
      this.release();

      restoreUserSelect();
      window.removeEventListener('mousemove', this._handleMouseMove);
      window.removeEventListener('mouseup', this._handleMouseUp);
    },

    _moveFromMouse({clientX, clientY}) {
      const left = clientX - this.shiftX;
      const top = clientY - this.shiftY;

      this.setDimension({left, top}, {shouldAdjust: !this.fullColumn});
    },

    fixRatio({width, height} /* OriginalWidth, OriginalHeight */) {
      this.fixedRatio = width / height;
      this.setDimension(adjustRatioSize(this.dimension));
    },

    unfixRatio() {
      this.fixedRatio = null;
    },

    setFocusedInput(isFocused) {
      this.focusedInput = isFocused;
    },

    _resizeFromMouse({pageX, pageY}) {
      const {limitRect} = this;

      const next = resizeFn[this.actionType](this.dimension, {pageX, pageY}, limitRect);
      this.setDimension(next, {shouldAdjust: false});
    },

    setDimension(dimension, {shouldAdjust = true} = {}) {
      let {left = this.left, top = this.top, width = this.width, height = this.height} = dimension;
      const {limitRect: limit, fixedRatio} = this;

      if (shouldAdjust) {
        const maxWidth = limit.right - this.left;
        const maxHeight = limit.bottom - this.top;

        width = _.clamp(width, 1, maxWidth);
        height = _.clamp(height, 1, maxHeight);

        if (fixedRatio) {
          const dx = Math.abs(width - this.width);
          const dy = Math.abs(height - this.height);
          const scaleTo = dx > dy ? 'width' : 'height';

          ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo, maxWidth, maxHeight}));
        }

        left = _.clamp(left, limit.left, limit.right - width);
        top = _.clamp(top, limit.top, limit.bottom - height);
      }

      this._setDimensionValues({left, top, width, height});
      this.$emit('update');
    },
    setDimensionAndUpdateStore(dimension, options) {
      this.setDimension(dimension, options);
      this.updateToStore();
      this.$emit('release');
    },

    checkIfElementNeedsRestore() {
      let result = false;
      if (this.isSection) {
        result = false;
      } else if (!this.currentColumnId) {
        result = true;
      } else if (this.isMonopolyColumn(this.currentColumnId)) {
        result = true;
      } else if (this.fullColumn && this.childrenIds(this.currentColumnId).length) {
        result = true;
      }

      return result;
    },

    release() {
      if (this.checkIfElementNeedsRestore()) {
        this.restore();
      } else if (!this.isSection) {
        if (this.fullColumn) {
          const {top, left} = this.columnsRect[this.currentColumnId];

          this._setDimensionValues({
            top,
            left
          });
          this.$emit('update');
        }

        this.updateToStore();
      }

      this.$emit('release');
    },

    updateToStore() {
      const newParentId = this.currentColumnId;
      const {elementId, originalParentId, left, top, width, height} = this;
      const {left: columnLeft, top: columnTop} = this.columnsRect[newParentId];
      const relativeDimension = {
        left: left - columnLeft,
        top: top - columnTop,
        width,
        height
      };

      this.updateElementDimension({
        id: elementId,
        originalParentId,
        newParentId,
        updating: {
          attrs: {
            dimension: relativeDimension
          }
        }
      });
      this.save();
      this.originalParentId = newParentId;
    },

    setColumnRect(id, rect) {
      this.columnsRect[id] = rect;
      this.$emit('setColumnRect', id);
    },

    save() {
      const {left, top, width, height} = this;
      this.savedDimension = {left, top, width, height};
    },

    restore() {
      this.setDimension(this.savedDimension, {shouldAdjust: false});
    },

    reset() {
      // prettier-ignore
      this.elementId
        = this.originalParentId
        = this.left
        = this.top
        = this.width
        = this.height
        = this.savedDimension
        = this.shiftX
        = this.shiftY
        = this.fixedRatio
        = this.draggable
        = this.actionType
        = this.focusedInput
        = null;
      this.columnsRect = {};
    }
  }
});
