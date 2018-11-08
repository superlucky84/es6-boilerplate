<template>
  <ul class="ico-list cf">
    <li
      v-for="(buttonData, index) in elementToolButtons"
      :key="index"
      class="ico_li"
    >
      <button
        :disabled="isDisabledButton(buttonData.type)"
        :class="['btn-tool', buttonData.class]"
        :title="buttonData.title"
        @click="toggleToolPopup(buttonData.type)"
      >
        {{buttonData.title}}
      </button>
    </li>
  </ul>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import {selectedElements, toggleToolPopup} from '@/store/types';

const elementToolButtons = [
  {
    type: 'text',
    title: '텍스트',
    class: 'ico-text'
  },
  {
    type: 'color',
    title: '색상',
    class: 'ico-color'
  },
  {
    type: 'image',
    title: '이미지',
    class: 'ico-img'
  },
  {
    type: 'link',
    title: '링크',
    class: 'ico-link'
  },
  {
    type: 'video',
    title: '동영상',
    class: 'ico-video'
  },
  {
    type: 'board',
    title: '게시판',
    class: 'ico-bulletin'
  },
  {
    type: 'product',
    title: '상품',
    class: 'ico-products'
  },
  {
    type: 'column',
    title: '세션',
    class: 'ico-section'
  }
];

export default {
  data: () => {
    return {
      elementToolButtons
    };
  },

  computed: {
    ...mapGetters('scene', [selectedElements]),
    lastSelectedEl() {
      return this.selectedElements[this.selectedElements.length - 1];
    }
  },

  methods: {
    ...mapMutations('tools', [toggleToolPopup]),

    isDisabledButton(type) {
      const selectedEl = this.lastSelectedEl;

      if (selectedEl) {
        return !(type in selectedEl.attrs);
      }

      return true;
    }
  }
};
</script>
<style scoped>
button[disabled] {
  opacity: 0.2;
  cursor: not-allowed;
}
</style>
