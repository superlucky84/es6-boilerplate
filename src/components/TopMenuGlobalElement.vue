<template>
  <li :class="['path1_list_li', {open: isOpenedDropdown}]">
    <a ref="dropdownActivator" class="linkon ti-element-button">요소</a>
    <div v-if="isOpenedDropdown" class="path2_content basic">
      <ul class="path2_subMenu">
        <li :class="['submenu_li', {on: selectedMenu === 'basic'}]" @click.prevent="selectMenu('basic')">
          <a :class="{linkon: selectedMenu === 'basic'}" href="#">기본 요소</a>
        </li>
        <li :class="['submenu_li  ti-element-video-button', {on: selectedMenu === 'video'}]" @click.prevent="selectMenu('video')">
          <a :class="{linkon: selectedMenu === 'video'}" href="#">동영상</a>
        </li>
        <li :class="['submenu_li', 'ti-element-sns-button', {on: selectedMenu === 'sns'}]" @click.prevent="selectMenu( 'sns')">
          <a :class="{linkon: selectedMenu === 'sns'}" href="#">SNS</a>
        </li>
        <li :class="['submenu_li ti-element-map-button', {on: selectedMenu === 'map'}]" @click.prevent="selectMenu('map')">
          <a :class="{linkon: selectedMenu === 'map'}" href="#">지도</a>
        </li>
        <li :class="['submenu_li ti-element-board-button', {on: selectedMenu === 'board'}]" @click.prevent="selectMenu('board')">
          <a :class="{linkon: selectedMenu === 'board'}" href="#">게시판</a>
        </li>
        <li
          :class="['submenu_li ti-element-product-button', {on: selectedMenu === 'productDisplay'}]"
          @click.prevent="selectMenu('productDisplay')"
        >
          <a :class="{linkon: selectedMenu === 'productDisplay'}" href="#">상품전시</a>
        </li>
        <li
          :class="['submenu_li', {on: selectedMenu === 'productSectionList'}]"
          @click.prevent="selectMenu('productSectionList')"
        >
          <a :class="{linkon: selectedMenu === 'productSectionList'}" href="#">
            상품 섹션<span class="small_txt">(리스트)</span>
          </a>
        </li>
        <li
          :class="['submenu_li ti-element-product-slide-button', {on: selectedMenu === 'productSectionSlide'}]"
          @click.prevent="selectMenu('productSectionSlide')"
        >
          <a :class="{linkon: selectedMenu === 'productSectionSlide'}" href="#">
            상품 섹션<span class="small_txt">(슬라이드)</span>
          </a>
        </li>
      </ul>
      <div class="path2_head">
        <h2 class="path2_head_ttl">{{menuText[selectedMenu]}}</h2>
        <b-menu-back-button @click="closeDropdown"/>
      </div>
      <template v-if="selectedMenu === 'basic'"><top-menu-global-element-basic /></template>
      <template v-if="selectedMenu === 'productDisplay'"><top-menu-global-element-product-display /></template>
      <template v-if="selectedMenu === 'productSectionList'"><top-menu-global-element-product-section /></template>
      <template v-if="selectedMenu === 'productSectionSlide'"><top-menu-global-element-product-section-slide /></template>
      <template v-if="selectedMenu === 'map'"><top-menu-global-element-map /></template>
      <template v-if="selectedMenu === 'sns'"><top-menu-global-element-sns /></template>
      <template v-if="selectedMenu === 'video'"><top-menu-global-element-video /></template>
      <template v-if="selectedMenu === 'board'"><top-menu-global-element-board /></template>
    </div>
  </li>
</template>

<script>
import BButton from './BMenuButton';
import BBlueButton from './BBlueButton';
import Dropdown from '../mixins/dropdown';
import BMenuBackButton from './BMenuBackButton';
import TopMenuGlobalElementBasic from './TopMenuGlobalElementBasic';
import TopMenuGlobalElementProductDisplay from './TopMenuGlobalElementProductDisplay';
import TopMenuGlobalElementProductSection from './TopMenuGlobalElementProductSection';
import TopMenuGlobalElementProductSectionSlide from './TopMenuGlobalElementProductSectionSlide';
import TopMenuGlobalElementMap from './TopMenuGlobalElementMap';
import TopMenuGlobalElementSns from './TopMenuGlobalElementSns';
import TopMenuGlobalElementVideo from './TopMenuGlobalElementVideo';
import TopMenuGlobalElementBoard from './TopMenuGlobalElementBoard';

export default {
  name: 'TopMenuGlobalElement',

  components: {
    BButton,
    BMenuBackButton,
    BBlueButton,
    TopMenuGlobalElementBasic,
    TopMenuGlobalElementProductDisplay,
    TopMenuGlobalElementProductSection,
    TopMenuGlobalElementProductSectionSlide,
    TopMenuGlobalElementMap,
    TopMenuGlobalElementSns,
    TopMenuGlobalElementVideo,
    TopMenuGlobalElementBoard
  },

  mixins: [Dropdown],

  data() {
    return {
      selectedMenu: 'basic',
      menuText: {
        basic: '기본 요소',
        video: '비디오',
        sns: 'SNS',
        map: '지도',
        board: '게시판',
        productDisplay: '상품 전시',
        productSectionList: '상품 섹션 리스트',
        productSectionSlide: '상품 섹션 슬라이드'
      }
    };
  },

  methods: {
    selectMenu(menuType) {
      this.selectedMenu = menuType;
    }
  }
};
</script>
