<template>
  <div>
    <ul v-if="linkedPages.length" class="header_menus" @click.stop.prevent="select">
      <li v-for="page in linkedPages" :key="page.id" class="header_menus_item">
        <a href="#" >{{page.title}}</a>
      </li>
    </ul>
    <ul v-else class="header_menus" @click.stop.prevent="select">
      <li class="header_menus_item">등록된 메뉴가 없습니다.</li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: 'BHeaderMenus',

  props: {
    select: {
      type: Function,
      required: false,
      default: () => {}
    },
    updateDemension: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  computed: {
    ...mapState({
      entity(state) {
        return pageId => state.page.entities[pageId];
      }
    }),
    linkedPages() {
      return this.$store.state.page.linked.map(pageId => this.entity(pageId));
    }
  },

  updated: function() {
    this.updateDemension();
  }
};
</script>
