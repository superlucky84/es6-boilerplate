<template>
  <main id="main">
    <b-page :background="background" :font-family-style="fontFamilyStyle">
      <draggable
        v-model="draggableSectionIds"
        :options="{disabled: !sectionDraggable}"
      >
        <section-container
          v-for="section in childrenData"
          :section-dnd-event-bus="sectionDndEventBus"
          :children="section.children"
          :elements="elements"
          :attrs="section.attrs"
          :key="section.id"
          :id="section.id"
        />
      </draggable>
    </b-page>
    <portal-target name="elementLayer" slim @change="handlePortalChange" />
  </main>
</template>
<script>
import Vue from 'vue';
import {mapState, mapGetters, mapActions} from 'vuex';
import SectionContainer from './SectionContainer';
import BPage from './elements/BPage';
import draggable from 'vuedraggable';
import {fontFamilyStyle, setSectionIds} from '../store/types';
import elementDnDChannel from '../helpers/elementDnDChannel';

export default {
  components: {
    SectionContainer,
    BPage,
    draggable
  },

  data() {
    return {
      sectionDraggable: true,
      sectionDndEventBus: new Vue()
    };
  },

  computed: {
    ...mapState('scene', ['elements', 'sectionIds', 'background']),
    ...mapGetters([fontFamilyStyle]),

    draggableSectionIds: {
      get() {
        return this.sectionIds;
      },
      set(newSectionOrder) {
        this.setSectionIds(newSectionOrder);
      }
    },

    childrenData() {
      return this.sectionIds.map(childId => this.elements[childId]);
    }
  },

  mounted() {
    elementDnDChannel.$on('grab', () => elementDnDChannel.save());
    elementDnDChannel.$on('update', this.setMovingElementDimension);

    this.sectionDndEventBus.$on('sectionGrab', () => {
      this.setSectionDraggable(false);
    });

    this.sectionDndEventBus.$on('sectionRelease', () => {
      this.setSectionDraggable(true);
    });
  },

  destroyed() {
    elementDnDChannel.$off();
    this.draggableEventBus.$off();
  },

  methods: {
    ...mapActions('scene', [setSectionIds]),

    setSectionDraggable(sectionDraggable) {
      this.sectionDraggable = sectionDraggable;
    },
    handlePortalChange({passengers = []}) {
      const [vNode] = passengers;

      if (vNode) {
        this.movingElement = vNode.elm;
        this.setMovingElementDimension();
      } else {
        this.movingElement = null;
      }
    },

    setMovingElementDimension() {
      const {movingElement} = this;

      if (movingElement) {
        const {left, top, width, height} = elementDnDChannel;

        movingElement.style.left = `${left}px`;
        movingElement.style.top = `${top}px`;
        movingElement.style.width = `${width}px`;
        movingElement.style.height = `${height}px`;
      }
    }
  }
};
</script>

<style scoped>
.sortable-drag {
  opacity: 0;
}
.sortable-ghost {
  box-shadow: inset 0 0 0 3px darkred;
}
</style>
