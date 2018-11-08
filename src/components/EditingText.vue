<template>
  <b-text
    ref="btext"
    :attrs="editingAttrs"
    :contents="contents"
    @click="select"
    @blur="editDone"
    @keyup.esc="editDone"
    @keyup.stop=""
    @dblclick="turnEditableOn"
    @mousedown="handleMouseDown"
  />
</template>
<script>
import {mapActions} from 'vuex';
import _ from 'lodash';
import {modifyText} from '@/store/types';
import BText from './elements/BText';
import elementDnDChannel from '@/helpers/elementDnDChannel';

export default {
  components: {
    BText
  },

  props: {
    id: {
      type: String,
      required: true
    },

    attrs: {
      type: Object,
      required: true
    },

    contents: {
      type: String,
      required: true
    },

    select: {
      type: Function,
      required: false,
      default: _.noop
    }
  },

  data() {
    return {
      // 현재 엘리먼트의 사이즈를 수정 중일 때, 실시간으로 업데이트하여 정렬을 유지시키기 위함.
      editingAttrs: {
        ...this.attrs,
        dimension: {
          ...this.attrs.dimension
        }
      }
    };
  },

  mounted() {
    elementDnDChannel.$on('grab', this.handleElementDnDGrab);
  },

  beforeDestroy() {
    elementDnDChannel.$off('grab', this.handleElementDnDGrab);
  },

  methods: {
    ...mapActions('scene', [modifyText]),
    handleElementDnDGrab() {
      if (elementDnDChannel.elementId === this.id) {
        elementDnDChannel.$on('update', this.handleElementDnDUpdate);
      } else {
        elementDnDChannel.$off('update', this.handleElementDnDUpdate);
      }
    },

    handleElementDnDUpdate() {
      this.editingAttrs.dimension.width = elementDnDChannel.width;
      this.editingAttrs.dimension.height = elementDnDChannel.height;
    },

    handleMouseDown(ev) {
      if (this.$el.getAttribute('contenteditable') === 'true') {
        ev.stopPropagation();
      }
    },

    editDone(ev) {
      ev.stopPropagation();
      this.turnEditableOff();

      this.modifyText({
        id: this.id,
        contents: ev.target.innerText
      });
    },

    turnEditableOff() {
      elementDnDChannel.setFocusedInput(false);
      this.$el.setAttribute('contenteditable', 'false');
    },

    turnEditableOn() {
      elementDnDChannel.setFocusedInput(true);
      this.$el.setAttribute('contenteditable', 'true');
      this.$el.focus();
    }
  }
};
</script>
