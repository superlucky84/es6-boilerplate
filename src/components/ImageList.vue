<template>
  <ul class="image_list">
    <li class="image_li add">
      <!-- Fake Input Button Image -->
      <img src="@/../assets/img/edit/img_add.png">
      <!--항상 새로운 File input 렌더링을 위해 key 사용-->
      <input
        :key="Date.now()"
        type="file"
        class="__image_upload_input"
        accept="image/*"
        multiple
        @change="handleImageInputChange"
      >
    </li>
    <li
      v-for="(imageId, index) in imageIds"
      :key="imageId"
      :class="['image_li', 'ti-image-item', {selected: isSelected(imageId)}]"
      @click="handleClickImage(imageId)"
    >
      <template v-if="checkable">
        <label :for="imageId" class="img_label">
          <img :src="getImageUrl(imageId)" alt="">
        </label>
        <div class="check-text">
          <div class="checkbox small">
            <input
              :id="imageId"
              :checked="isChecked(imageId)"
              type="checkbox"
              class="inpbr"
              name="checkbox"
              @change="handleCheckImage(imageId)"
            >
            <label :for="imageId" class="box_img" />
          </div>
        </div>
      </template>
      <template v-else-if="deletable">
        <img :src="getImageUrl(imageId)" alt="">
        <a
          href="#"
          class="delete"
          @click="deleteImage(imageId)"
        >
          Delete
        </a>
      </template>
      <template v-else>
        <img :src="getImageUrl(imageId)" alt="">
      </template>
    </li>
  </ul>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import {deleteImage, fetchImageList, uploadImages} from '@/store/types';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';

/**
 * @see
 * deletable 또는 checkable 또는 selectable을 같이 사용하는 UX 없음
 * ==> 같이 사용하는 경우가 생긴다면 마크업 전면 수정 필요 (select 상태, check 상태, hover시 삭제 버튼 상태)
 */
export default {
  name: 'ImageList',

  props: {
    selectable: {
      type: Boolean,
      default: false
    },

    checkable: {
      type: Boolean,
      default: false
    },

    deletable: {
      type: Boolean,
      default: false
    },

    selectedId: {
      type: String,
      default: null
    },

    checkedIds: {
      type: Array,
      default: () => []
    }
  },

  computed: mapState({
    imageIds: state => state.imageList.ids
  }),

  mounted() {
    this.fetchImageList();
  },

  methods: {
    ...mapGlobalOptionFunctions(['getImageUrl']),
    ...mapActions({uploadImages, fetchImageList, deleteImage}),

    handleImageInputChange(ev) {
      this.uploadImages(ev.target.files);
      this.$forceUpdate(); // 새로운 File Input 렌더링 위함
    },

    handleClickImage(selectedId) {
      if (this.selectable && this.selectedId !== selectedId) {
        this.$emit('update:selectedId', selectedId);
      }
    },

    handleCheckImage(id) {
      const checkedIds = this.checkedIds;
      let newIds;

      if (this.isChecked(id)) {
        newIds = checkedIds.filter(_id => _id !== id);
      } else {
        newIds = [...checkedIds, id];
      }

      this.$emit('update:checkedIds', newIds);
    },

    isChecked(id) {
      return this.checkedIds.includes(id);
    },

    isSelected(id) {
      return this.selectedId === id;
    }
  }
};
</script>

<style scoped>
.__image_upload_input {
  position: absolute;
  left: 0;
  top: 0;
  background: transparent;
  overflow: hidden;
  font-size: 1000px;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.__image_upload_input:focus {
  border: 0;
  outline: 0;
  box-shadow: inset 0 0 0 2px #0a9ff4;
}
</style>
