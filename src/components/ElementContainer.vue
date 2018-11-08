<template>
  <portal v-if="isSelected" to="elementLayer">
    <b-content
      :selected="isSelected"
      :child="child"
      :parent-id="parentId"
      @mousedown.stop="grabElementDnD"
      @dragstart.prevent.stop=""
    >
      <focus-layer />
    </b-content>
  </portal>
  <b-content
    v-else
    :child="child"
    :parent-id="parentId"
    :select="select"
  />
</template>
<script>
import _ from 'lodash';
import {mapMutations, mapState, mapGetters} from 'vuex';
import {selectElement, updateElement} from '@/store/types';
import {getBoundingRect} from '@/helpers/util';
import elementDnDChannel, {
  MOVE,
  RESIZE_TR,
  RESIZE_BL,
  RESIZE_BR,
  RESIZE_TL,
  RESIZE_T,
  RESIZE_B,
  RESIZE_L,
  RESIZE_R
} from '@/helpers/elementDnDChannel';

import BContent from '@/components/BContent';
import FocusLayer from '@/components/FocusLayer';

export default {
  components: {
    FocusLayer,
    BContent
  },

  props: {
    parentId: {
      type: String,
      required: true
    },

    child: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters('scene', ['getParentSectionElementHeight']),
    ...mapState('scene', ['selectedElementIds']),
    ...mapState({
      originalImageInfo(state) {
        return state.imageList.entities[this.child.attrs.image.id];
      }
    }),

    isSelected() {
      return this.selectedElementIds.includes(this.child.id);
    },

    sectionHeight() {
      return this.getParentSectionElementHeight(this.child.id);
    }
  },
  watch: {
    isSelected(next) {
      const {
        parentId,
        child: {id: elementId}
      } = this;

      if (next) {
        elementDnDChannel.initDimension(
          {
            elementId,
            parentId,
            isFixedRatio: _.get(this.child, 'attrs.image.isFixedRatio'),
            draggable: this.child.draggable,
            fullColumn: this.child.fullColumn
          },
          getBoundingRect(this.$el)
        );
      } else if (elementDnDChannel.elementId === elementId) {
        elementDnDChannel.reset();
      }
    },
    sectionHeight() {
      if (this.child.fullColumn) {
        elementDnDChannel.$emit('init');
        let {height} = elementDnDChannel.columnsRect[this.parentId];

        this.updateElement({
          id: this.child.id,
          updating: {
            attrs: {
              dimension: {
                height: height - 14
              }
            }
          }
        });
      }
    }
  },

  methods: {
    ...mapMutations('scene', [selectElement, updateElement]),

    select() {
      this.selectElement({id: this.child.id});
    },

    // eslint-disable-next-line complexity
    grabElementDnD(ev) {
      switch (ev.target.className) {
        case 'top-left-resize':
          elementDnDChannel.grab(ev, RESIZE_TL);
          break;
        case 'top-resize':
          elementDnDChannel.grab(ev, RESIZE_T);
          break;
        case 'top-right-resize':
          elementDnDChannel.grab(ev, RESIZE_TR);
          break;
        case 'right-resize':
          elementDnDChannel.grab(ev, RESIZE_R);
          break;
        case 'bottom-right-resize':
          elementDnDChannel.grab(ev, RESIZE_BR);
          break;
        case 'bottom-resize':
          elementDnDChannel.grab(ev, RESIZE_B);
          break;
        case 'bottom-left-resize':
          elementDnDChannel.grab(ev, RESIZE_BL);
          break;
        case 'left-resize':
          elementDnDChannel.grab(ev, RESIZE_L);
          break;
        default:
          elementDnDChannel.grab(ev, MOVE);
          break;
      }
    }
  }
};
</script>
