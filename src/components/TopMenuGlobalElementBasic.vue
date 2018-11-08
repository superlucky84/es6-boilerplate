<template>
  <div>
    <div class="path2_body path2_bgPage">
      <ul class="basic_list">

        <li
            v-if="isShopInfoAvailable"
            :class="['basic_li', {basic_click: isFocused(elementTypes.shopinfo)}]"
            draggable="true"
            @click="handleClickElement(elementTypes.shopinfo)"
            @dragstart="handleDragStart($event, elementTypes.shopinfo)"
        >
          <span class="basic_lt">쇼핑몰정보</span>
          <div class="basic_list_con basic_shopinfo">
            쇼핑몰 정보
          </div>
        </li>
        <li
            v-if="isPolicyAvailable"
            :class="['basic_li', {basic_click: isFocused(elementTypes.policy)}]"
            draggable="true"
            @click="handleClickElement(elementTypes.policy)"
            @dragstart="handleDragStart($event, elementTypes.policy)"
        >
          <span class="basic_lt">정책</span>
          <div class="basic_list_con basic_policy">
            정책
          </div>
        </li>
        <li
            v-if="isHeaderIconsAvailable"
            :class="['basic_li', {basic_click: isFocused(elementTypes.shopmenu)}]"
            draggable="true"
            @click="handleClickElement(elementTypes.shopmenu)"
            @dragstart="handleDragStart($event, elementTypes.shopmenu)"
        >
          <span class="basic_lt">쇼핑몰메뉴</span>
          <div class="basic_list_con basic_shopmenu">
            <img src="../../assets/img/edit/dummy/header_icons.png" draggable="false">
          </div>
        </li>

        <li
            v-if="isHeaderMenuAvailable"
            :class="['basic_li', {basic_click: isFocused(elementTypes.menulist)}]"
            draggable="true"
            @click="handleClickElement(elementTypes.menulist)"
            @dragstart="handleDragStart($event, elementTypes.menulist)"
        >
          <span class="basic_lt">메뉴리스트</span>
          <div class="basic_list_con basic_menulist">
            <img src="../../assets/img/edit/dummy/header_menus.png" draggable="false">
          </div>
        </li>

        <li
          :class="['basic_li', 'ti-menu-element-text', {basic_click: isFocused(elementTypes.text)}]"
          draggable="true"
          @click="handleClickElement(elementTypes.text)"
          @dragstart="handleDragStart($event, elementTypes.text)"
        >
          <span class="basic_lt">텍스트</span>
          <div class="basic_list_con basic_text">새 텍스트</div>
        </li>
        <li
          :class="['basic_li', 'ti-menu-element-image', {basic_click: isFocused(elementTypes.image)}]"
          draggable="true"
          @click="handleClickElement(elementTypes.image)"
          @dragstart="handleDragStart($event, elementTypes.image)"
        >
          <span class="basic_lt">이미지</span>
          <div class="basic_list_con basic_image">
            <img src="../../assets/img/edit/dummy/img_pagebg_bnr.jpg" draggable="false">
          </div>
        </li>
        <li
          :class="['basic_li', {basic_click: isFocused(elementTypes.button)}]"
          draggable="true"
          @click="handleClickElement(elementTypes.button)"
          @dragstart="handleDragStart($event, elementTypes.button)"
        >
          <span class="basic_lt">버튼</span>
          <div class="basic_list_con basic_button">
            <b-button class="white-1 style-1">새 버튼</b-button>
          </div>
        </li>
        <li
          :class="['basic_li', 'ti-menu-element-box', {basic_click: isFocused(elementTypes.box)}]"
          draggable="true"
          @click="handleClickElement(elementTypes.box)"
          @dragstart="handleDragStart($event, elementTypes.box)"
        >
          <span class="basic_lt">상자</span>
          <div class="basic_list_con basic_box" />
        </li>
        <li
          :class="['basic_li', {basic_click: isFocused(elementTypes.slider)}]"
          draggable="true"
          @click="handleClickElement(elementTypes.slider)"
          @dragstart="handleDragStart($event, elementTypes.slider)"
        >
          <span class="basic_lt">슬라이드</span>
          <div class="basic_list_con basic_banner">
            <img src="../../assets/img/edit/dummy/img_slick.png" draggable="false">
          </div>
        </li>
      </ul>
    </div>
    <div class="path2_foot">
      <b-blue-button
        :disabled="!focusedType || !isPossibleAddElement"
        class="ti-add-element-button"
        @click="addElement">요소 추가</b-blue-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import {mapGetters} from 'vuex';
import BButton from '@/components/BMenuButton';
import BBlueButton from '@/components/BBlueButton';
import {
  addNewText,
  addNewImage,
  addNewSlider,
  addNewButton,
  addNewMenulist,
  addNewShopmenu,
  addNewShopinfo,
  addNewPolicy,
  addNewBox,
  currentAddingTargetId,
  isPossibleAddElement
} from '@/store/types';

const elementTypeToActionType = {
  text: addNewText,
  image: addNewImage,
  slider: addNewSlider,
  button: addNewButton,
  menulist: addNewMenulist,
  shopmenu: addNewShopmenu,
  shopinfo: addNewShopinfo,
  policy: addNewPolicy,
  box: addNewBox
};

export default {
  name: 'TopMenuGlobalElementBasic',

  components: {
    BButton,
    BBlueButton
  },

  data() {
    return {
      focusedType: null,
      elementTypes: {
        text: 'text',
        image: 'image',
        button: 'button',
        box: 'box',
        slider: 'slider',
        menulist: 'menulist',
        shopmenu: 'shopmenu',
        shopinfo: 'shopinfo',
        policy: 'policy'
      }
    };
  },

  computed: {
    ...mapGetters('scene', [currentAddingTargetId, isPossibleAddElement]),

    isHeaderMenuAvailable: {
      get() {
        const isHeader = this.$store.state.scene.pageId === 'header';
        const hasHeaderMenus = _.some(this.$store.state.scene.elements, ['type', 'headerMenus']);

        return isHeader && !hasHeaderMenus;
      }
    },

    isHeaderIconsAvailable: {
      get() {
        const isHeader = this.$store.state.scene.pageId === 'header';
        const hasHeaderIcons = _.some(this.$store.state.scene.elements, ['type', 'headerIcons']);

        return isHeader && !hasHeaderIcons;
      }
    },

    isShopInfoAvailable: {
      get() {
        const isFooter = this.$store.state.scene.pageId === 'footer';
        const hasFooterShopinfo = _.some(this.$store.state.scene.elements, ['type', 'footerShopinfo']);

        return isFooter && !hasFooterShopinfo;
      }
    },

    isPolicyAvailable: {
      get() {
        const isFooter = this.$store.state.scene.pageId === 'footer';
        const hasFooterPolicy = _.some(this.$store.state.scene.elements, ['type', 'footerPolicy']);

        return isFooter && !hasFooterPolicy;
      }
    }
  },

  methods: {
    handleClickElement(elementType) {
      this.focusedType = elementType;
    },

    isFocused(elementType) {
      return this.focusedType === elementType;
    },

    addElement() {
      const actionType = this.getActionType(this.focusedType);

      if (this.isPossibleAddElement) {
        this.$store.dispatch(actionType, {
          parentId: this.currentAddingTargetId
        });
      }
    },

    handleDragStart(ev, elementType) {
      const {target, dataTransfer} = ev;
      const dragImage = target.querySelector('.basic_list_con');
      const actionType = this.getActionType(elementType);

      this.focusedType = elementType;
      dataTransfer.setDragImage(dragImage, dragImage.clientWidth / 2, dragImage.clientHeight / 2);
      dataTransfer.setData(
        'x-app-text/json',
        JSON.stringify({
          actionType
        })
      );
    },

    getActionType(elementType) {
      return `scene/${elementTypeToActionType[elementType]}`;
    }
  }
};
</script>

<style scoped>
.basic_li:hover {
  background: #dbeafa;
}
</style>
