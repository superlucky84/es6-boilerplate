<template>
  <div id="wrapper" class="ti-scene" :style="{fontFamily: fontFamilyStyle}">
    <embed-page v-if="!isEmbedPageEditing" page-id="header" />
    <editing-page />
    <embed-page v-if="!isEmbedPageEditing" page-id="footer" />
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';

import EmbedPage from './EmbedPage';
import EditingPage from './EditingPage';
import {loadPageToScene, fontFamilyStyle} from '@/store/types';

import {mapState} from 'vuex';

export default {
  name: 'Scene',
  components: {
    EmbedPage,
    EditingPage
  },
  computed: {
    ...mapState('scene', ['pageId']),
    ...mapGetters([fontFamilyStyle]),
    isEmbedPageEditing() {
      return this.pageId === 'header' || this.pageId === 'footer';
    }
  },
  methods: {
    ...mapActions([loadPageToScene])
  }
};
</script>
