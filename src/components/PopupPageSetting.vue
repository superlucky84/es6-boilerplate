<template>
  <div class="layer_contents layer_addPage">
    <div class="bx_tit">
      <strong class="tit">페이지</strong>
    </div>
    <div class="area_contents">
      <ul class="addPage_form">
        <li class="addpage_li">
          <span class="form_txt">페이지명</span>
          <input
            ref="titleInput"
            v-model="title"
            class="inpbr input-normal"
            type="text"
          >
        </li>
        <li class="addpage_li">
          <span class="form_txt">페이지 주소(영문)</span>
          <input v-model="url" class="inpbr input-normal" type="text">
        </li>
        <li class="addpage_li">
          <div class="checkbox middle">
            <input
              id="register"
              v-model="isLinked"
              class="inpbr"
              type="checkbox"
            >
            <label class="box_img" for="register"/>
          </div>
          <label class="txt_label" for="register">메뉴로 등록</label>
        </li>
      </ul>
    </div>
    <div class="area_foot">
      <button type="button" class="btn-blue width-80" @click="apply">적용</button>
    </div>
    <button type="button" class="btn-close" @click="close">close</button>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import {addPage, modifyPage} from '../store/types';
export default {
  name: 'PopupPageSetting',

  props: {
    idToModify: {
      type: String,
      required: false,
      default: null
    },
    close: {
      type: Function,
      required: true
    }
  },

  data() {
    const {idToModify} = this;
    let isLinked = false;
    let title = '';
    let url = '';

    if (idToModify) {
      const pageState = this.$store.state.page.entities[idToModify];

      ({title, url} = pageState);
      isLinked = this.$store.state.page.linked.includes(idToModify);
    }

    return {
      isLinked,
      title,
      url
    };
  },

  mounted() {
    // portal로 popup이 나타남 --> 다음 tick에서 focus 처리가 필요. (portal-vue 이슈로 보임)
    this.$nextTick(() => {
      this.$refs.titleInput.focus();
    });
  },

  methods: {
    ...mapActions({
      addPage,
      modifyPage
    }),
    apply() {
      const {idToModify, title, url, isLinked} = this;
      let id, actionType;

      if (idToModify) {
        id = idToModify;
        actionType = modifyPage;
      } else {
        id = null;
        actionType = addPage;
      }

      this[actionType]({
        id,
        title,
        url,
        isLinked
      });

      this.close();
    }
  }
};
</script>
