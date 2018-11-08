<template>
  <li :class="{open: isOpenedDropdown}" class="path1_list_li">
    <a ref="dropdownActivator" class="linkon ti-page-button">페이지 배경</a>
    <div v-if="isOpenedDropdown" class="path2_content">
      <div class="path2_head">
        <h2 class="path2_head_ttl ti-popup-title">페이지 배경</h2>
        <b-menu-back-button @click="closeDropdown"/>
      </div>
      <div class="path2_body path2_bgPage">
        <div v-if="isActiveTab('color')" :style="{backgroundColor: color}" class="bgPage_selected ti-bg-demo"></div>
        <div v-else-if="isActiveTab('image')" class="bgPage_selected ti-bg-demo"><img :src="imgSrc"></div>
        <div class="bgPage_contents">
          <ul class="bgPage_style">
            <li :class="['bgstyle_li', {on: isActiveTab('color')}]">
              <a href="#" class="txt_link ti-tab-button" @click.prevent="setActiveTab('color')">색상</a>
            </li>
            <li :class="['bgstyle_li', {on: isActiveTab('image')}]">
              <a href="#" class="txt_link ti-tab-button" @click.prevent="setActiveTab('image')">이미지</a>
            </li>
          </ul>
          <div class="bgPage_body">
            <div v-show="isActiveTab('color')" class="colorpicker ti-colorpicker-tab">
              <color-picker ref="colorPicker" v-model="color" />
            </div>
            <div v-show="isActiveTab('image')" class="bg_image ti-image-tab">
              <image-list :selectable="true" :selected-id.sync="imageId"/>
            </div>
          </div>
        </div>
      </div>
      <div class="path2_foot">
        <b-blue-button
          class="foot_btn ti-apply-to-current-page-button"
          @click="applyToCurrentPage">현재 페이지 적용</b-blue-button>
        <b-blue-button
          class="foot_btn ti-apply-to-all-page-button"
          @click="applyToAllPage">모든 페이지 적용</b-blue-button>
      </div>
    </div>
  </li>
</template>

<script>
import {mapState, mapActions} from 'vuex';

import {updatePageBackground, updateAllPageBackground} from '@/store/types';

import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';

import Dropdown from '@/mixins/dropdown';
import BMenuBackButton from '@/components/BMenuBackButton';
import BBlueButton from '@/components/BBlueButton';
import ImageList from './ImageList';
import ColorPicker from './ColorPicker';

export default {
  name: 'TopMenuGlobalPage',

  components: {
    BBlueButton,
    BMenuBackButton,
    ImageList,
    ColorPicker
  },

  mixins: [Dropdown],
  data() {
    return {
      activeTab: 'color',
      columnCount: 1,
      imageId: '',
      color: ''
    };
  },
  computed: {
    ...mapState('scene', ['background']),
    imgSrc() {
      if (this.imageId) {
        return this.getImageUrl(this.imageId);
      }

      return 'https://upload.wikimedia.org/wikipedia/commons/6/62/%22No_Image%22_placeholder.png';
    },
    currentBackgroundData() {
      return {
        type: this.activeTab,
        value: this.activeTab === 'color' ? this.color : this.imageId
      };
    }
  },
  mounted() {
    const {type, value} = this.background;

    if (type === 'color') {
      this.color = value;
    } else {
      this.imageId = value;
    }

    this.activeTab = type;
  },
  methods: {
    ...mapGlobalOptionFunctions('getImageUrl'),
    ...mapActions('scene', [updatePageBackground]),
    ...mapActions([updateAllPageBackground]),
    setActiveTab(tab) {
      this.activeTab = tab;
    },

    isActiveTab(tab) {
      return this.activeTab === tab;
    },

    setBackgroundColor(color) {
      this.color = color;
    },
    applyToCurrentPage() {
      this.updatePageBackground(this.currentBackgroundData);
    },
    applyToAllPage() {
      this.updateAllPageBackground(this.currentBackgroundData);
    }
  }
};
</script>
