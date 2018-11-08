<template>
  <b-section-column
    :class="{'drag-over': dragOver}"
    :elements="elements"
    :children="children"
    @dragover.prevent="handleDragOverToAppend"
    @drop.prevent.stop="handleDropToAppend"
    @dragleave="setDragOverStyle(false)"
  >
    <element-container
      slot="item"
      slot-scope="{child}"
      :parent-id="id"
      :child="child"
      :key="child.id"
    />
  </b-section-column>
</template>
<script>
import {mapMutations} from 'vuex';
import {selectElement, clearSelectedElementIds} from '@/store/types';
import ElementContainer from '@/components/ElementContainer';
import elementDnDChannel from '@/helpers/elementDnDChannel';
import BSectionColumn from '@/components/elements/BSectionColumn';
import {getBoundingRect} from '@/helpers/util';

export default {
  components: {
    BSectionColumn,
    ElementContainer
  },

  props: {
    children: {
      type: Array,
      required: true
    },

    elements: {
      type: Object,
      required: true
    },

    id: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dragOver: false
    };
  },

  mounted() {
    elementDnDChannel.setColumnRect(this.id, getBoundingRect(this.$el));
    elementDnDChannel.$on(['init', 'grab'], this.handleElementDnDGrab);
    elementDnDChannel.$on('update', this.handleElementDnDUpdate);
    elementDnDChannel.$on('release', this.handleElementDnDRelease);
    window.addEventListener('resize', this.clearSelectedElementIds);
  },

  destroyed() {
    elementDnDChannel.$off(['init', 'grab'], this.handleElementDnDGrab);
    elementDnDChannel.$off('update', this.handleElementDnDUpdate);
    elementDnDChannel.$off('release', this.handleElementDnDRelease);
    window.removeEventListener('resize', this.clearSelectedElementIds);
  },

  methods: {
    ...mapMutations('scene', [selectElement, clearSelectedElementIds]),
    setDragOverStyle(active = true) {
      this.dragOver = active;
    },

    handleElementDnDGrab() {
      elementDnDChannel.setColumnRect(this.id, getBoundingRect(this.$el));
    },

    handleElementDnDUpdate() {
      const dragOver = this.id === elementDnDChannel.currentColumnId;
      this.setDragOverStyle(dragOver);
    },

    handleElementDnDRelease() {
      this.setDragOverStyle(false);
    },

    hasDragDataToAppend(ev) {
      return [].includes.call(ev.dataTransfer.types, 'x-app-text/json');
    },

    getDragDataToAppend(ev) {
      return ev.dataTransfer.getData('x-app-text/json');
    },

    handleDragOverToAppend(ev) {
      if (this.hasDragDataToAppend(ev)) {
        this.setDragOverStyle();
      }
    },

    handleDropToAppend(ev) {
      this.setDragOverStyle(false);
      const data = this.getDragDataToAppend(ev);

      if (!data) {
        return;
      }
      const {actionType, payload = {}} = JSON.parse(data);
      payload.parentId = this.id;
      this.$store.dispatch(actionType, payload);
    }
  }
};
</script>
