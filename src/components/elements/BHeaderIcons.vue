<template>
  <ul class="header_icons" @click.stop.prevent="select">
    <li
      v-for="icon in icons"
      :class="icon"
      :key="`headerIcon-${icon}`"
      class="header_icons_item"
    >
      <a href="#" />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BHeaderIcons',

  props: {
    attrs: {
      type: Object,
      required: true
    },
    select: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      icons: ['search', 'mypage', 'cart']
    };
  }
};
</script>
