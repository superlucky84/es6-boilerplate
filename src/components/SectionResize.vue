<template>
  <div class="sectionResize">
    <span
      class="bottom-resize ti-section-resize-bottom"
      @mousedown.stop.prevent="grabSectionDnD"
    />
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
import {updateElement} from '@/store/types';
import elementDnDChannel from '@/helpers/elementDnDChannel';

export default {
  props: {
    id: {
      type: String,
      required: true
    },

    isSelected: {
      type: Boolean,
      required: true
    },

    height: {
      type: Number,
      required: true
    },

    setHeight: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      initY: 0,
      originalHeight: 0,
      resizeType: ''
    };
  },

  watch: {
    isSelected(next) {
      if (next) {
        elementDnDChannel.initDimension(
          {
            elementId: this.id,
            parentId: null,
            isFixedRatio: false
          },
          {height: this.height}
        );
      }
    }
  },

  mounted() {
    elementDnDChannel.$on('update', this._setHeightFromPanel);
  },

  beforeDestroy() {
    elementDnDChannel.$off('update', this._setHeightFromPanel);
  },

  methods: {
    ...mapMutations('scene', {
      updateElement: updateElement
    }),

    grabSectionDnD(ev) {
      this.$emit('sectionGrab');

      const {clientY} = ev;
      this.initY = clientY;
      this.originalHeight = this.height;
      this.resizeType = ev.target.className;
      this._toggleScrollFixedStatus();

      window.addEventListener('mousemove', this._handleMouseMove);
      window.addEventListener('mouseup', this._handleMouseUp);
    },

    _setHeightFromPanel() {
      if (this.isSelected) {
        this.setHeight(elementDnDChannel.height);
      }
    },

    _handleMouseMove(ev) {
      const {clientY} = ev;
      const diffHeight = clientY - this.initY;
      const height = this.originalHeight + diffHeight;

      this.setHeight(height);
      elementDnDChannel.setDimension({height}, {shouldAdjust: false});
    },

    _handleMouseUp() {
      this.updateElement({
        id: this.id,
        updating: {
          attrs: {
            dimension: {
              height: this.height
            }
          }
        }
      });

      this.$emit('sectionRelease');
      this._toggleScrollFixedStatus();

      window.removeEventListener('mousemove', this._handleMouseMove);
      window.removeEventListener('mouseup', this._handleMouseUp);
    },

    _toggleScrollFixedStatus() {
      let scrollCorrectionElement = document.getElementById('scrollCorrectionElement');
      const {scrollTop, style: scrollStyle} = document.documentElement;

      if (scrollCorrectionElement) {
        scrollStyle.overflowY = 'auto';
        scrollCorrectionElement.remove();
      } else {
        scrollStyle.overflowY = 'hidden';
        scrollCorrectionElement = document.createElement('div');
        scrollCorrectionElement.id = 'scrollCorrectionElement';
        scrollCorrectionElement.style.height = `${this.originalHeight}px`;

        document.body.appendChild(scrollCorrectionElement);
        document.documentElement.scrollTop = scrollTop;
      }
    }
  }
};
</script>
