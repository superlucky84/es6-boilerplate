<template>
  <div class="packBox ti-image">
    <img :src="src" @click.stop.prevent="select">
  </div>
</template>

<script>
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';

export default {
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

  computed: {
    src() {
      const id = this.attrs.image.id;

      if (id) {
        return this.getImageUrl(id);
      }

      // @todo placeholder image
      return 'https://upload.wikimedia.org/wikipedia/commons/6/62/%22No_Image%22_placeholder.png';
    }
  },

  methods: {
    ...mapGlobalOptionFunctions('getImageUrl')
  }
};
</script>
