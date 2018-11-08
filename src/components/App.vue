<template>
  <div class="editBody" @dragover="dragOver">
    <top-menu/>
    <panel-container/>
    <scene/>
    <div v-show="hasPopupChildren" class="layer_popup fixed" @click.stop="">
      <div class="layer_inner">
        <portal-target
          name="layer"
          multiple
          slim
          @change="handlePopupUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';

import {load, initialize, fetchImageList} from '@/store/types';

import TopMenu from './TopMenu';
import PanelContainer from './PanelContainer';
import Scene from './Scene';

export default {
  name: 'App',
  components: {
    TopMenu,
    PanelContainer,
    Scene
  },

  data() {
    return {
      hasPopupChildren: false
    };
  },

  computed: {
    ...mapState(['canUndo'])
  },

  created() {
    window.addEventListener('beforeunload', e => {
      if (this.canUndo) {
        const dialogText = '현재 페이지의 변경사항을 저장하지 않고 나가시겠습니까?';
        e.returnValue = dialogText;

        return dialogText;
      }

      return true;
    });
    this.fetchImageList();
  },

  mounted() {
    this.initialize();
  },

  methods: {
    ...mapActions([load, initialize, fetchImageList]),
    handlePopupUpdate(nextContents) {
      this.hasPopupChildren = !!nextContents.length;
    },

    dragOver(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    }
  }
};
</script>
