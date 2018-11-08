<template>
  <li :class="{open: isOpenedDropdown}" class="path1_list_li">
    <a ref="dropdownActivator" class="linkon">이미지 업로드</a>
    <div v-if="isOpenedDropdown" class="path2_content">
      <div class="path2_head">
        <h2 class="path2_head_ttl">이미지 업로드</h2>
        <b-menu-back-button @click="closeDropdown" />
      </div>
      <div class="path2_body">
        <div class="bg_image upload">
          <image-list deletable />
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import ImageList from '@/components/ImageList';
import Dropdown from '@/mixins/dropdown';
import BMenuBackButton from '@/components/BMenuBackButton';

export default {
  name: 'TopMenuGlobalImageUpload',

  components: {BMenuBackButton, ImageList},

  mixins: [Dropdown]
};
</script>
