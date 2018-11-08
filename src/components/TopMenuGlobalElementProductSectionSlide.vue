<template>
  <div :class="{off: !isProductSectionEnabled}">
    <div class="path2_body">
      <h3 class="path_ttl">상품섹션 선택</h3>
      <select ref="productId" class="select-normal" >
        <option
            v-for="section in sectionList"
            :key="section.sectionId"
            :value="section.sectionId"
        >{{section.sectionName}}</option>
      </select>
      <p class="path2_body_txt">어드민에서 상품섹션을 설정해주세요.</p>
      <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
      <div class="contents_btm">
        <h3 class="path_ttl">전시 선택</h3>
        <ul class="exhibition_list">

          <li :class="['exhibition_list_li exhibition3_g', {selected: isActiveColumnCount(3)}]" @click="setColumnCount(3)">
            <p class="exhibition_txt">3단</p>
          </li>
          <li :class="['exhibition_list_li exhibition1', {selected: isActiveColumnCount(1)}]" @click="setColumnCount(1)">
            <p class="exhibition_txt">1단</p>
          </li>
        </ul>
      </div>
      <div class="contents_btm">
        <h3 class="path_ttl">전시 상품 개수</h3>
        <select v-model="productCount" class="select-normal">
          <option
              v-for="count in productCountOptions"
              :key="count"
              :value="count"
          >{{count}}개</option>
        </select>
      </div>
      <div class="contents_btm">
        <h3 class="path_ttl">정렬 선택</h3>
        <div class="radio-text">
          <div class="radio middle">
            <input
                id="mode-1"
                class="inpbr"
                name="mode"
                type="radio"
                value="admin"
                checked
                @click="setSortBy('admin')"
            >
            <label class="radio_img" for="mode-1" />
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="mode-1">어드민 설정순</label>
          </p>
        </div>
        <div class="radio-text">
          <div class="radio middle">
            <input
                id="mode-2"
                class="inpbr"
                name="mode"
                type="radio"
                value="new"
                @click="setSortBy('new')"
            >
            <label class="radio_img" for="mode-2" />
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="mode-2">최신순
              <span class="sub_txt">- 최근 상품등록일시 순</span>
            </label>
          </p>
        </div>
        <div class="radio-text">
          <div class="radio middle">
            <input
                id="mode-3"
                class="inpbr"
                name="mode"
                type="radio"
                value="sale"
                @click="setSortBy('sale')"
            >
            <label class="radio_img" for="mode-3" />
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="mode-3">판매순
              <span class="sub_txt">- 판매수량 많은 순
                <br>- 판매수량 동일한 경우, 최신순</span>
            </label>
          </p>
        </div>
      </div>
      <p class="path2_body_notes relative">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
    <div class="path2_foot">
      <button
        :disabled="!isProductSectionEnabled || !isPossibleAddFullColumnElement"
        type="button"
        class="foot_btn btn-blue ti-product-slide-element-add"
        @click="addNewProductSlide">요소 추가</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import {mapActions, mapGetters, mapState} from 'vuex';
import BButton from '@/components/BMenuButton';
import BBlueButton from '@/components/BBlueButton';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import {currentAddingTargetId, addNewProductSlide, childrenIds, isPossibleAddFullColumnElement} from '../store/types';

export default {
  name: 'TopMenuGlobalElementProductSectionSlide',

  components: {
    BButton,
    BBlueButton
  },

  data() {
    return {
      columnCount: 3,
      sectionId: 'all',
      productCount: 3,
      sortBy: 'new'
    };
  },

  computed: {
    ...mapGetters('scene', [currentAddingTargetId, childrenIds, isPossibleAddFullColumnElement]),
    ...mapState(['productSection']),
    isProductSectionEnabled() {
      return this.productSection.enabled;
    },
    productCountOptions() {
      const maxProductCount = this.columnCount === 3 ? 22 : 8;

      return _.range(this.columnCount, maxProductCount, this.columnCount);
    },
    sectionList() {
      return this.productSection.sectionList;
    },
    settingUrl() {
      return this.productSection.settingUrl;
    },
    hasSection: {
      get() {
        return !!this.$store.state.scene.sectionIds.length;
      }
    }
  },

  methods: {
    ...mapGlobalOptionFunctions('fetchProductSection'),
    ...mapActions('scene', {
      _addNewProductSlide: addNewProductSlide
    }),

    addNewProductSlide() {
      const payload = {
        type: 'section',
        id: this.$refs.productId.value,
        parentId: this.currentAddingTargetId,
        columnCount: this.columnCount,
        productCount: this.productCount,
        sortBy: this.sortBy
      };

      this._addNewProductSlide(payload);
    },

    setColumnCount(count) {
      this.columnCount = count;
      this.productCount = count;
    },

    setSortBy(type) {
      this.sortBy = type;
    },

    isActiveColumnCount(count) {
      return this.columnCount === count;
    },

    addElement() {
      const actionType = this.getActionType(this.focusedType);
      if (this.hasSection) {
        this.$store.dispatch(actionType, {
          parentId: this.currentAddingTargetId
        });
      }
    }
  }
};
</script>

<style scoped>
.basic_li:hover {
  background: #dbeafa;
}
a.btn-blue,
a.btn-blue:hover {
  display: inline-block;
  margin-top: 10px;
  padding: 0 10px;
  text-align: center;
  color: #fff;
}
</style>
