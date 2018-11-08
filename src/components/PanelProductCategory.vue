<script>
import {mapGetters, mapMutations, mapState} from 'vuex';
import _ from 'lodash';
import {currentAddingTargetId, updateElement} from '@/store/types';

export default {
  name: 'PanelProductCategory',

  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters('scene', [currentAddingTargetId]),
    ...mapState(['productCategory']),
    productCountOptions() {
      return _.range(this.attr.columnCount, 49, this.attr.columnCount);
    },
    categoryList() {
      return this.productCategory.categoryList;
    },
    settingUrl() {
      return this.productCategory.settingUrl;
    }
  },

  methods: {
    ...mapMutations('scene', {updateElement}),
    update(product) {
      this.updateElement({
        id: this.id,
        updating: {
          attrs: {
            product
          }
        }
      });
    },

    setColumnCount(count) {
      this.update({
        columnCount: count
      });
      this.update({
        productCount: count
      });
    },

    changeProductCount(ev) {
      this._changeProductCount(Number(ev.target.value));
    },

    _changeProductCount(count) {
      this.update({
        productCount: count
      });
    },

    changeCategoryId(ev) {
      this.update({
        id: ev.target.value
      });
    },

    setSortBy(type) {
      this.update({
        sortBy: type
      });
    },

    isActiveColumnCount(count) {
      return this.attr.columnCount === count;
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

<template>
  <div class="ti-panel-prjoduct-category">
    <div class="path2_body">
      <h3 class="path_ttl">상품/카테고리 선택</h3>
      <select class="select-normal" @change="changeCategoryId($event)">
        <option value="all">상품 전체</option>
        <option
            v-for="category in categoryList"
            :key="category.categoryId"
            :value="category.categoryId"
            :selected="attr.id === category.categoryId"
        >{{category.categoryName}}</option>
      </select>
      <p class="path2_body_txt">어드민에서 카테고리를 설정해주세요.</p>
      <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
      <div class="contents_btm">
        <h3 class="path_ttl">전시 선택</h3>
        <ul class="exhibition_list">
          <li :class="['exhibition_list_li exhibition4', {selected: isActiveColumnCount(4)}]" @click="setColumnCount(4)">
            <p class="exhibition_txt">4단</p>
          </li>
          <li :class="['exhibition_list_li exhibition3', {selected: isActiveColumnCount(3)}]" @click="setColumnCount(3)">
            <p class="exhibition_txt">3단</p>
          </li>
        </ul>
      </div>
      <div class="contents_btm">
        <h3 class="path_ttl">페이지 당 상품 개수</h3>
        <select ref="productCount" class="select-normal" @change="changeProductCount($event)">
          <option
              v-for="count in productCountOptions"
              :key="count"
              :value="count"
              :selected="attr.productCount === count"
          >{{count}}개</option>
        </select>
      </div>
      <div class="contents_btm">
        <h3 class="path_ttl">정렬 선택</h3>
        <div class="radio-text">
          <div class="radio middle">
            <input
                id="mode-1"
                :checked="attr.sortBy === 'new'"
                class="inpbr"
                name="mode"
                type="radio"
                value="new"
                @click="setSortBy('new')"
            >
            <label class="radio_img" for="mode-1" />
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="mode-1">최신순
              <span class="sub_txt">- 최근 상품등록일시 순</span>
            </label>
          </p>
        </div>
        <div class="radio-text">
          <div class="radio middle">
            <input
                id="mode-2"
                :checked="attr.sortBy === 'sale'"
                class="inpbr"
                name="mode"
                type="radio"
                value="sale"
                @click="setSortBy('sale')"
            >
            <label class="radio_img" for="mode-2" />
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="mode-2">판매순
              <span class="sub_txt">- 판매수량 많은 순
                <br>- 판매수량 동일한 경우, 최신순</span>
            </label>
          </p>
        </div>
      </div>
      <p class="path2_body_notes relative">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
  </div>
</template>

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
