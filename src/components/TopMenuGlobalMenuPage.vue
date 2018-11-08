<template>
  <li :class="{open: isOpenedDropdown}" class="path1_list_li">
    <a ref="dropdownActivator" class="linkon">메뉴 &amp; 페이지</a>
    <div v-if="isOpenedDropdown" class="path2_content">
      <div class="path2_head">
        <h2 class="path2_head_ttl">메뉴 &amp; 페이지</h2>
        <b-menu-back-button @click="closeDropdown"/>
      </div>
      <menu-page-tree />
      <div class="path2_foot">
        <b-blue-button class="foot_btn" @click="openPopupToAddPage">페이지 추가</b-blue-button>
      </div>
    </div>
  </li>
</template>

<script>
import {Wormhole} from 'portal-vue';
import Dropdown from '@/mixins/dropdown';
import BMenuBackButton from '@/components/BMenuBackButton';
import BBlueButton from '@/components/BBlueButton';
import MenuPageTree from '@/components/MenuPageTree';
import PopupPageSetting from '@/components/PopupPageSetting';

export default {
  name: 'TopMenuGlobalMenuPage',

  components: {
    BBlueButton,
    BMenuBackButton,
    MenuPageTree
  },

  mixins: [Dropdown],

  methods: {
    openPopupToAddPage() {
      const popupVNode = this.$createElement(PopupPageSetting, {
        props: {
          close: this.closePopupToAddPage
        }
      });

      Wormhole.open({
        to: 'layer',
        from: 'globalMenuPage',
        passengers: [popupVNode]
      });
    },

    closePopupToAddPage() {
      Wormhole.close({
        to: 'layer',
        from: 'globalMenuPage'
      });
    }
  }
};
</script>
