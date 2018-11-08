<template>
  <li :class="{open: isOpenedDropdown}" class="menu_main_li">
    <a ref="dropdownActivator" class="ti-history-button">히스토리</a>
    <div v-if="isOpenedDropdown" class="history_list">
      <ul class="history_ul">
        <li
          v-for="item in historyList"
          :key="item.id"
          class="history_li ti-history"
          @click="loadHistoryItem(item.id)">
          <a href="#">{{item.timestamp | formatedDate}}</a>
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
import {mapState, mapActions} from 'vuex';

import {savePageFromScene, loadEditingPageContentsFromHistory} from '@/store/types';
import Dropdown from '../mixins/dropdown';
import BBlueButton from './BBlueButton';

import {uiConfirm} from '@/helpers/uiAlert';

export default {
  name: 'TopMenuHistory',

  components: {BBlueButton},
  filters: {
    formatedDate(ts) {
      var date = new Date(ts);

      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var hour = date.getHours();
      var min = date.getMinutes();

      return `${year}.${digitNumber(month)}.${day} ${hour}:${digitNumber(min)}`;
    }
  },
  mixins: [Dropdown],
  computed: {
    ...mapState(['canUndo', 'historyList'])
  },
  methods: {
    ...mapActions([loadEditingPageContentsFromHistory, savePageFromScene]),
    async loadHistoryItem(id) {
      if (!this.canUndo) {
        this.loadEditingPageContentsFromHistory({id});
      } else {
        const {confirmed} = await uiConfirm({
          headerText: '알림',
          bodyText: '현재 페이지의 변경사항이 저장되지 않았습니다.<br />변경사항을 저장하시겠습니까?'
        });

        if (confirmed) {
          this.savePageFromScene();
          this.loadEditingPageContentsFromHistory({id});
        }
      }

      this.closeDropdown();
    }
  }
};

function digitNumber(num) {
  return num > 9 ? num : '0' + num;
}
</script>
