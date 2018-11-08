<script>
import {mapActions, mapMutations} from 'vuex';
import {removeElement, changeParent, changeColumnCount} from '../store/types';

export default {
  name: 'PanelColumn',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: Number,
      required: true
    },
    elementType: {
      type: String,
      required: true
    }
  },
  computed: {
    column() {
      return this.attr;
    }
  },
  methods: {
    ...mapActions('scene', {
      _changeColumnCount: changeColumnCount
    }),
    ...mapMutations('scene', {
      _removeElement: removeElement,
      _changeParent: changeParent
    }),

    isColumnSelected(column) {
      return this.column === column;
    },

    changeColumnCount(column) {
      this._changeColumnCount({
        sectionId: this.id,
        column
      });
    }
  }
};
</script>
<template>
  <div class="columnPanel">
    <div class="line-wrap">
      <div class="column">
        <h3 class="path_ttl">단 선택</h3>
        <ul class="stage_list">
          <li :class="{on: isColumnSelected(1)}" class="stage_li stage1" @click="changeColumnCount(1)">
            <p class="stage_txt">1단</p>
          </li>
          <li :class="{on: isColumnSelected(2)}" class="stage_li stage2" @click="changeColumnCount(2)">
            <p class="stage_txt">2단</p>
          </li>
          <li :class="{on: isColumnSelected(3)}" class="stage_li stage3" @click="changeColumnCount(3)">
            <p class="stage_txt">3단</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
