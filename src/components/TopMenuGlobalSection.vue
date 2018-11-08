<template>
  <li :class="['path1_list_li', {open: isOpenedDropdown}]">
    <a ref="dropdownActivator" class="linkon ti-section-button">섹션</a>
    <div v-if="isOpenedDropdown" class="path2_content">
      <div class="path2_head">
        <h2 class="path2_head_ttl">섹션</h2>
        <b-menu-back-button @click="closeDropdown" />
      </div>
      <div class="path2_body path2_bgPage">
        <h3 class="path_ttl">단 선택</h3>
        <ul class="stage_list">
          <li :class="['stage_li stage1 ti-stage1', {on: isActiveColumnCount(1)}]" @click="setColumnCount(1)">
            <p class="stage_txt">1단</p>
          </li>
          <li :class="['stage_li stage2 ti-stage2', {on: isActiveColumnCount(2)}]" @click="setColumnCount(2)">
            <p class="stage_txt">2단</p>
          </li>
          <li :class="['stage_li stage3 ti-stage3', {on: isActiveColumnCount(3)}]" @click="setColumnCount(3)">
            <p class="stage_txt">3단</p>
          </li>
          <li :class="['stage_li stage4 ti-stage4', {on: isActiveColumnCount(0)}]" @click="setColumnCount(0)">
            <p class="stage_txt">없음</p>
          </li>
        </ul>
        <h3 class="path_ttl">배경 선택</h3>
        <div class="bgPage_contents">
          <ul class="bgPage_style">
            <li :class="['bgstyle_li', {on: isActiveTab('color')}]">
              <a href="#" class="txt_link" @click.prevent="setActiveTab('color')">색상</a>
            </li>
            <li :class="['bgstyle_li', {on: isActiveTab('image')}]">
              <a href="#" class="txt_link" @click.prevent="setActiveTab('image')">이미지</a>
            </li>
          </ul>
          <div class="bgPage_body">
            <div v-show="isActiveTab('color')" class="colorpicker">
              <!-- Todo: ColorPicker component -->
              <color-picker v-model="backgroundColor"/>
            </div>
            <div v-show="isActiveTab('image')" class="bg_image">
              <image-list :selectable="true" :selected-id.sync="backgroundImageId"/>
            </div>
          </div>
        </div>
      </div>
      <div class="path2_foot">
        <button type="button" class="foot_btn btn-blue ti-add-section-button" @click="addNewSection">섹션 추가</button>
      </div>
    </div>
  </li>
</template>

<script>
import {mapActions} from 'vuex';
import Dropdown from '../mixins/dropdown';
import BMenuBackButton from './BMenuBackButton';
import ImageList from './ImageList';
import {addNewSection} from '../store/types';
import ColorPicker from './ColorPicker';

export default {
  name: 'TopMenuGlobalSection',

  components: {
    BMenuBackButton,
    ImageList,
    ColorPicker
  },

  mixins: [Dropdown],

  data() {
    return {
      activeTab: 'color',
      columnCount: 1,
      backgroundImageId: null,
      backgroundColor: ''
    };
  },

  methods: {
    ...mapActions('scene', {
      _addNewSection: addNewSection
    }),

    addNewSection() {
      const payload = {
        columnCount: this.columnCount === 0 ? 1 : this.columnCount,
        fullWidth: this.columnCount === 0
      };

      if (this.isActiveTab('color')) {
        payload.backgroundColor = this.backgroundColor;
      } else {
        payload.backgroundImageId = this.backgroundImageId;
      }

      this._addNewSection(payload);
    },

    setActiveTab(tab) {
      this.activeTab = tab;
    },

    isActiveTab(tab) {
      return this.activeTab === tab;
    },

    setColumnCount(count) {
      this.columnCount = count;
    },

    isActiveColumnCount(count) {
      return this.columnCount === count;
    },

    setBackgroundColor(color) {
      this.backgroundColor = color;
    }
  }
};
</script>
