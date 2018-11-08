<template>
    <draggable
      v-if="dndImageIds.length"
      v-model="dndImageIds"
      :component-data="getComponentData()"
      element="ul"
      class="image_list"
    >
      <!--
        드래그시 엘리먼트 위치 틀어짐
          - 3n+1 아이템에 margin-left: 0; 문제
          - 추후 마크업 css 변경 개선
      -->
      <li
        v-for="(imageId, index) in dndImageIds"
        :key="imageId"
        class="image_li"
      >
        <img :src="getImageUrl(imageId)">
        <span class="num">{{index + 1}}</span>
      </li>
    </draggable>
    <ul v-else class="image_list">
      <li v-if="!dndImageIds.length" class="image_li none" />
    </ul>
</template>

<script>
import {mapActions} from 'vuex';
import draggable from 'vuedraggable';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import {updateAttr} from '@/store/types';

export default {
  name: 'SlideImageList',

  components: {draggable},

  props: {
    imageIds: {
      type: Array,
      required: true
    }
  },

  computed: {
    dndImageIds: {
      get() {
        return this.imageIds;
      },
      set(newIds) {
        this.$emit('update:imageIds', newIds);
      }
    }
  },

  methods: {
    ...mapGlobalOptionFunctions('getImageUrl'),
    getComponentData() {
      return {
        on: {
          // panel 컴포넌트의 drag에 영향 막음
          dragstart: ev => ev.stopPropagation(),
          dragend: ev => ev.stopPropagation()
        }
      };
    },

    ...mapActions('scene', [updateAttr])
  }
};
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.3;
}
</style>
