<template>
  <div
      :class="['editorCanvas ti-editor-canvas', {selected: isSelected}]"
      :style="style"
      @click="select"
  >
    <div class="section-cover">
      <div class="sectionMove">
        <button
          :disabled="isFirst"
          type="button"
          class="btn-move-up"
          @click="moveUp">위</button>
        <button
          :disabled="isLast"
          type="button"
          class="btn-move-down"
          @click="moveDown">아래</button>
      </div>
      <div class="sectionLine"/>
    </div>
    <section-resize
        v-show="isSelected"
        ref="sectionResize"
        :is-selected="isSelected"
        :id="id"
        :height="height"
        :set-height="setHeight"
    />
    <b-section
      :id="id"
      :children="children"
      :elements="elements"
      :attrs="attrs"
    >
      <section-column
        slot="item"
        slot-scope="{col}"
        :children="col.children"
        :elements="elements"
        :key="col.id"
        :id="col.id"
      />
    </b-section>
  </div>
</template>
<script>
import Vue from 'vue';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import {mapState, mapMutations, mapActions} from 'vuex';
import {selectElement, moveSectionToUp, moveSectionToDown} from '../store/types';
import BSection from '@/components/elements/BSection';
import SectionColumn from '@/components/SectionColumn';
import SectionResize from '@/components/SectionResize';

export default {
  components: {SectionColumn, BSection, SectionResize},

  props: {
    children: {
      type: Array,
      required: true
    },

    id: {
      type: String,
      required: true
    },

    elements: {
      type: Object,
      required: true
    },

    attrs: {
      type: Object,
      required: true
    },

    sectionDndEventBus: {
      type: Vue,
      required: true
    }
  },

  data() {
    return {
      height: 0
    };
  },

  computed: {
    ...mapState('scene', ['selectedElementIds', 'sectionIds']),

    isSelected() {
      return this.selectedElementIds.includes(this.id);
    },

    isLast() {
      const {sectionIds, id} = this;

      return sectionIds.indexOf(id) === sectionIds.length - 1;
    },

    isFirst() {
      return this.sectionIds.indexOf(this.id) === 0;
    },

    style() {
      const {
        attrs: {
          image: {id, isFixedBackground},
          color,
          fullWidth
        }
      } = this.elements[this.id];
      const style = {
        height: `${this.height}px`
      };
      const backgroundStyle = {
        backgroundImage: id ? `url("${this.getImageUrl(id)}")` : '',
        backgroundSize: '100% 100%',
        backgroundColor: color,
        backgroundAttachment: isFixedBackground ? 'fixed' : ''
      };
      if (fullWidth) {
        Object.assign(style, backgroundStyle);
      }

      return style;
    }
  },

  beforeMount() {
    this.height = this.elements[this.id].attrs.dimension.height;
  },

  mounted() {
    this.$refs.sectionResize.$on('sectionGrab', () => {
      this.sectionDndEventBus.$emit('sectionGrab');
    });

    this.$refs.sectionResize.$on('sectionRelease', () => {
      this.sectionDndEventBus.$emit('sectionRelease');
    });
  },

  methods: {
    ...mapGlobalOptionFunctions('getImageUrl'),
    ...mapMutations('scene', {
      selectElement: selectElement
    }),
    ...mapActions('scene', {
      moveSectionToUp: moveSectionToUp,
      moveSectionToDown: moveSectionToDown
    }),

    moveUp() {
      this.moveSectionToUp(this.id);
    },

    moveDown() {
      this.moveSectionToDown(this.id);
    },

    select() {
      this.selectElement({id: this.id});
    },

    setHeight(height) {
      this.height = height;
    }
  }
};
</script>
