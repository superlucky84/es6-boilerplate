<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import _ from 'lodash';
import {updateElement, addNewProductList, currentAddingTargetId} from '@/store/types';

export default {
  name: 'PanelProductSection',
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
    ...mapState(['productSection']),
    productCountOptions() {
      return _.range(this.attr.columnCount, 49, this.attr.columnCount);
    },
    sectionList() {
      return this.productSection.sectionList;
    },
    settingUrl() {
      return this.productSection.settingUrl;
    }
  },

  methods: {
    ...mapMutations('scene', {updateElement}),
    ...mapActions('scene', {
      _addNewProductList: addNewProductList
    }),

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

    changeSectionId(ev) {
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
  <div>
    <div class="path2_body">
      <h3 class="path_ttl">상품섹션 선택</h3>
      <select class="select-normal" @change="changeSectionId($event)">
        <option
            v-for="section in sectionList"
            :key="section.sectionId"
            :value="section.sectionId"
            :selected="attr.id === section.sectionId"
        >{{section.sectionName}}</option>
      </select>
      <p class="path2_body_txt">어드민에서 상품섹션을 설정해주세요.</p>
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
        <h3 class="path_ttl">전시 상품 개수</h3>
        <select class="select-normal" @change="changeProductCount($event)">
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
                class="inpbr"
                name="mode"
                type="radio"
                :checked="attr.sortBy === 'admin'"
                value="admin"
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
                :checked="attr.sortBy === 'new'"
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
                :checked="attr.sortBy === 'sale'"
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
