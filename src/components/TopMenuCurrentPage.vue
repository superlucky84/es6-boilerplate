<template>
  <div :class="{open: isOpenedDropdown}" class="currentPage">
    <p ref="dropdownActivator" class="currentPage_txt ti-change-page-button">현재 페이지:<span class="sel_txt">{{currentPageTitle}}</span></p>
    <ul v-if="isOpenedDropdown" class="currentPage_list">
      <li
        v-for="page in pageList"
        :key="page.id"
        class="currentPage_li ti-select-page-button"
        @click="tryToChangePage(page.id)">
        <button type="button">{{page.title}}</button>
      </li>
    </ul>
  </div>
</template>
<script>
import _ from 'lodash';
import {mapState, mapActions} from 'vuex';

import {loadPageToScene, savePageFromScene} from '@/store/types';
import Dropdown from '../mixins/dropdown';
import elementDnDChannel from '@/helpers/elementDnDChannel';

import {uiConfirm} from '@/helpers/uiAlert';

export default {
  name: 'TopMenuCurrentPage',
  mixins: [Dropdown],
  computed: {
    ...mapState({
      pageList({page}) {
        return _.map(page.entities, (pageEntity, id) => {
          return {
            id,
            title: pageEntity.title
          };
        });
      },
      currentPageTitle({page, scene}) {
        return scene.pageId ? page.entities[scene.pageId].title : '';
      },
      canUndo: state => state.canUndo
    })
  },
  methods: {
    ...mapActions([loadPageToScene, savePageFromScene]),
    loadPage(id) {
      this.loadPageToScene({id});
      this.toggleDropdown();
      elementDnDChannel.reset();
    },
    async tryToChangePage(id) {
      if (!this.canUndo) {
        this.loadPage(id);
      } else {
        const {confirmed} = await uiConfirm({
          headerText: '알림',
          bodyText:
            '현재 페이지의 변경사항이 저장되지 않았습니다.<br />변경사항을 저장하고 선택한 페이지를 편집하시겠습니까?'
        });

        if (confirmed) {
          this.savePageFromScene();
          this.loadPage(id);
        }
      }
    }
  }
};
</script>
