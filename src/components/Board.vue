<template>
  <b-board :board-name="boardName" @click="select" />

</template>
<script>
import {mapGetters, mapState} from 'vuex';
import {getBoard} from '@/store/types';
import BBoard from '@/components/elements/BBoard';

export default {
  name: 'Board',
  components: {
    BBoard
  },
  props: {
    attrs: {
      type: Object,
      required: true
    },
    select: {
      type: Function,
      default: () => {}
    }
  },

  computed: {
    ...mapState(['boardList']),
    ...mapGetters([getBoard]),
    boardName() {
      const boardId = this.attrs.board.boardId;

      return this.getBoard(boardId).boardName;
    }
  }
};
</script>
