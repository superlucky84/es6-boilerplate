<template>
  <div
    :class="['commonMovePanel', {onDrag: isDrag}, {toolPanel: isTools}, 'ti-panel']"
    :style="style"
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    @mousedown="$emit('panelControl', this)"
  >
    <p class="headMove" @mouseover="allowDrag" @mouseout="disallowDrag"/>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'Panel',
  components: {},
  props: {
    type: {
      type: String,
      required: true
    },
    initPosition: {
      type: Object,
      required: true
    },
    zIndex: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      isDrag: false,
      isAllowDrag: false,
      position: {
        x: this.initPosition.x,
        y: this.initPosition.y
      },
      dragStartPosition: {
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    isTools() {
      return this.type === 'tools';
    },
    style() {
      return {
        top: this.position.y + 'px',
        left: this.position.x + 'px',
        zIndex: this.zIndex
      };
    }
  },

  mounted() {
    window.addEventListener('resize', this.resizeHandler);
  },

  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },

  methods: {
    dragStart(ev) {
      if (!this.isAllowDrag) {
        ev.preventDefault();

        return;
      }

      // const emptyGhost = new Image();
      // emptyGhost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      // ev.dataTransfer.setDragImage(emptyGhost, 0, 0);
      this.isDrag = true;

      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.effectAllowed = 'move';

      this.dragStartPosition.x = ev.clientX - this.position.x;
      this.dragStartPosition.y = ev.clientY - this.position.y;
    },
    resizeHandler() {
      this.repositionPanel();
    },
    dragEnd(ev) {
      this.isDrag = false;
      this.repositionPanel({
        x: ev.clientX - this.dragStartPosition.x,
        y: ev.clientY - this.dragStartPosition.y
      });
    },
    allowDrag() {
      this.isAllowDrag = true;
    },
    disallowDrag() {
      this.isAllowDrag = false;
    },
    repositionPanel(repositionXy) {
      if (repositionXy) {
        this.position = repositionXy;
      }

      const panalWidth = this.$el.offsetWidth;
      const bodyWidth = document.body.clientWidth;
      const position = this.position;

      if (position.y < 50) {
        position.y = 50;
      }

      if (position.x + panalWidth > bodyWidth) {
        position.x = bodyWidth - panalWidth;
      }

      this.$emit('positionChange', this.position);
    }
  }
};
</script>

<style scoped>
.onDrag {
  opacity: 0.3;
}
.commonMovePanel {
  position: fixed;
}
</style>
