<template>
  <div class="path2_body path2_menuPage">
    <h3 class="path_ttl"><span class="ico-menu">menu</span>메뉴 관리</h3>
    <draggable
      v-model="linkedPages"
      :options="draggableOption"
      element="ul"
      class="menuPage_list"
    >
      <menu-page-tree-node
        v-for="pageId in linkedPages"
        :key="pageId"
        :page-id="pageId"
        @onEditing="onEditingNode"
      />
    </draggable>
    <h3 class="path_ttl"><span class="ico-file">file</span>페이지 관리</h3>
    <ul class="menuPage_list">
      <menu-page-tree-node
        v-for="pageId in fixedUnlinkedPages"
        :key="pageId"
        :page-id="pageId"
        fixed
      />
    </ul>
    <draggable
      v-model="unlinkedPages"
      :options="draggableOption"
      element="ul"
      class="menuPage_list"
    >
      <menu-page-tree-node
        v-for="pageId in unlinkedPages"
        :key="pageId"
        :page-id="pageId"
        @onEditing="onEditingNode"
      />
    </draggable>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import Draggable from 'vuedraggable';
import {setLinkedPageIds, setUnlinkedPageIds} from '@/store/types';
import BBlueButton from './BBlueButton';
import MenuPageTreeNode from './MenuPageTreeNode';

export default {
  name: 'MenuPageTree',

  components: {
    BBlueButton,
    Draggable,
    MenuPageTreeNode
  },

  data() {
    return {
      draggableOption: {
        group: 'pages',
        ghostClass: '_drag-ghost',
        disabled: false
      }
    };
  },

  computed: {
    linkedPages: {
      get() {
        return this.$store.state.page.linked;
      },
      set(newIdList) {
        this.setLinkedPageIds(newIdList);
      }
    },
    unlinkedPages: {
      get() {
        return this.$store.state.page.unlinked;
      },
      set() {}
    },
    ...mapState({
      fixedUnlinkedPages: state => state.page.fixedUnlinked
    })
  },

  methods: {
    onEditingNode(isEditing) {
      this.draggableOption.disabled = isEditing;
    },
    ...mapActions([setLinkedPageIds, setUnlinkedPageIds])
  }
};
</script>

<style>
._drag-ghost {
  opacity: 0.5;
  border: 1px black dotted;
}

.menuPage_list {
  min-height: 15px;
}
</style>
