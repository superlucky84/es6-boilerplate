<script>
import {updateElement, getBoard} from '@/store/types';
import {mapGetters, mapState, mapMutations} from 'vuex';

export default {
  name: 'PanelBoard',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: Object,
      required: true
    },
    elementType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      countOptions: [5, 10, 15, 20, 30, 40, 50, 60]
    };
  },
  computed: {
    ...mapGetters([getBoard]),
    ...mapState(['board']),
    boardId: {
      get() {
        return this.attr.boardId;
      },
      set(boardId) {
        this.updateElement({boardId});
      }
    },
    count: {
      get() {
        return this.attr.count;
      },
      set(count) {
        this.updateElement({count});
      }
    },
    boardConfig() {
      return this.getBoard(this.boardId).boardConfig;
    },
    settingUrl() {
      return this.board.settingUrl;
    },
    boardList() {
      return this.board.boardList;
    }
  },

  methods: {
    ...mapMutations('scene', {_updateElement: updateElement}),
    boardConfigValue(type) {
      return this.boardConfig[type] ? '사용함' : '사용안함';
    },
    updateElement(board) {
      this._updateElement({
        id: this.id,
        updating: {
          attrs: {
            board
          }
        }
      });
    }
  }
};
</script>
<template>
  <div class="messagePanel ti-messagePanel" style="top: 200px;left: 500px;">
    <div class="line-wrap">
      <div class="message">
        <ul class="mess_list">
          <li class="mess_li ttl">
            <strong class="mess_b">게시판 선택</strong>
            <span class="select">
              <select v-model="boardId" class="select-normal ti-board-selector" >
                <option v-for="board in boardList" :key="board.boardId" :value="board.boardId">{{board.boardName}}</option>
              </select>
            </span>
          </li>
          <li class="mess_li">회원 글쓰기: {{boardConfigValue('memberWrite')}}</li>
          <li class="mess_li">비회원 글쓰기: {{boardConfigValue('nonMemberWrite')}}</li>
          <li class="mess_li">비밀 글쓰기: {{boardConfigValue('secretWrite')}}</li>
          <li class="mess_li">답글: {{boardConfigValue('reply')}}</li>
        </ul>
        <p class="txt">어드민에서 게시판을 변경해주세요.</p>
        <span class="btn-cancel">
          <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
        </span>
        <ul class="mess_list topBor">
          <li class="mess_li ttl">
            <strong class="mess_b">페이지 당 게시글 개수</strong>
            <span class="select">
              <select v-model="count" class="select-normal">
                <option v-for="countValue in countOptions" :key="countValue" :value="countValue">{{countValue}}개</option>
              </select>
            </span>
          </li>
        </ul>
      </div>
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
