<template>
  <div>
    <div v-if="!isExistBoard" class="path2_body">
      <h3 class="path_ttl">게시판 선택</h3>
      <p class="path2_body_txt">생성된 게시판이 없습니다.
        <br>어드민에서 게시판을 생성해주세요.</p>
        <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
        <p class="path2_body_notes">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
    <div v-else class="path2_body">
      <h3 class="path_ttl">게시판 선택</h3>
      <select v-model="boardId" class="select-normal" >
        <option v-for="board in boardList" :key="board.boardId" :value="board.boardId">{{board.boardName}}</option>
      </select>
      <ul class="path2_body_txt">
        <li class="notice_text_li">회원 글쓰기: {{boardConfigValue('memberWrite')}}</li>
        <li class="notice_text_li">비회원 글쓰기: {{boardConfigValue('nonMemberWrite')}}</li>
        <li class="notice_text_li">비밀 글쓰기: {{boardConfigValue('secretWrite')}}</li>
        <li class="notice_text_li">답글: {{boardConfigValue('reply')}}</li>
      </ul>
      <p class="path2_body_txt">어드민에서 게시판을 변경해주세요.</p>
      <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
      <div class="contents_btm">
        <h3 class="path_ttl">페이지 당 상품 개수</h3>
        <select v-model="count" class="select-normal">
          <option v-for="countValue in countOptions" :key="countValue" :value="countValue">{{countValue}}개</option>
        </select>
      </div>
      <p class="path2_body_notes">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
    <div class="path2_foot">
      <button
        :disabled="!isExistBoard || !isPossibleAddFullColumnElement"
        type="button"
        class="foot_btn btn-blue ti-board-element-add"
        @click="addNewBoard">요소 추가</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import BButton from '@/components/BMenuButton';
import BBlueButton from '@/components/BBlueButton';
import {currentAddingTargetId, getBoard, addNewBoard, isPossibleAddFullColumnElement} from '../store/types';

export default {
  name: 'TopMenuGlobalElementBoard',

  components: {
    BButton,
    BBlueButton
  },

  data() {
    return {
      countOptions: [5, 10, 15, 20, 30, 40, 50, 60],
      count: 10,
      boardId: ''
    };
  },

  computed: {
    ...mapGetters('scene', [currentAddingTargetId, isPossibleAddFullColumnElement]),
    ...mapGetters([getBoard]),
    ...mapState(['board']),
    isExistBoard() {
      return this.board.enabled;
    },
    settingUrl() {
      return this.board.settingUrl;
    },
    boardConfig() {
      return this.getBoard(this.boardId).boardConfig;
    },
    boardList() {
      return this.board.boardList;
    }
  },

  created() {
    this.boardId = this.boardList[0].boardId;
  },

  methods: {
    ...mapActions('scene', {
      _addNewBoard: addNewBoard
    }),

    boardConfigValue(type) {
      return this.boardConfig[type] ? '사용함' : '사용안함';
    },

    addNewBoard() {
      const payload = {
        parentId: this.currentAddingTargetId,
        boardId: this.boardId,
        count: this.count
      };

      this._addNewBoard(payload);
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
