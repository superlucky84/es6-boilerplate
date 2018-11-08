<template>
  <div v-if="page">
    <b-page
      :background="background"
      :font-family-style="fontFamilyStyle"
    >
      <b-section
        v-for="section in childrenData"
        :children="section.children"
        :elements="elements"
        :attrs="section.attrs"
        :key="section.id"
        :id="section.id"
        :style="{height: `${section.attrs.dimension.height}px`}"
      />
    </b-page>
  </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex';
import BPage from './elements/BPage';
import BSection from '@/components/elements/BSection';

import {fontFamilyStyle} from '../store/types';

export default {
  components: {
    BSection,
    BPage
  },

  props: {
    pageId: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState({
      page({page}) {
        return page.entities[this.pageId];
      },
      sectionIds() {
        return this.page.sectionIds;
      },
      elements() {
        return this.page.elements;
      },
      background() {
        return this.page.background;
      }
    }),
    ...mapGetters([fontFamilyStyle]),
    childrenData() {
      return this.sectionIds.map(childId => this.elements[childId]);
    }
  }
};
</script>
