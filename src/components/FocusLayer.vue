<template>
  <div :style="style" :class="{disabled: !isDraggable}" class="element-transform-ui">
    <span class="top-left-resize" />
    <span class="top-resize" />
    <span class="top-right-resize" />
    <span class="right-resize" />
    <span class="bottom-right-resize" />
    <span class="bottom-resize" />
    <span class="bottom-left-resize" />
    <span class="left-resize" />
  </div>
</template>

<script>
import elementDnDChannel from '../helpers/elementDnDChannel';
export default {
  name: 'FocusLayer',

  computed: {
    isDraggable() {
      return elementDnDChannel.draggable;
    },
    style() {
      return {
        width: `${elementDnDChannel.width + 8}px`,
        height: `${elementDnDChannel.height + 8}px`,
        left: '-4px',
        top: '-4px',
        zIndex: -1
      };
    }
  },

  globalKeymap: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },

  methods: {
    left(ev) {
      this.setPosition(ev, {left: elementDnDChannel.left - 1});
    },
    right(ev) {
      this.setPosition(ev, {left: elementDnDChannel.left + 1});
    },
    up(ev) {
      this.setPosition(ev, {top: elementDnDChannel.top - 1});
    },
    down(ev) {
      this.setPosition(ev, {top: elementDnDChannel.top + 1});
    },
    setPosition(ev, changeDirection) {
      if (!elementDnDChannel.focusedInput) {
        ev.preventDefault();
        elementDnDChannel.setDimensionAndUpdateStore(changeDirection);
      }
    }
  }
};
</script>
