<template>
<div>
  <label>Color</label>
  <color-picker v-model="color" />
</div>
</template>
<script>
import {updateAttr} from '@/store/types';
import {mapActions} from 'vuex';

import ColorPicker from './ColorPicker';

export default {
  name: 'PanelColor',

  components: {
    ColorPicker
  },

  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: String,
      required: true
    }
  },

  computed: {
    color: {
      get() {
        return this.attr;
      },
      set(value) {
        this.updateAttr({
          id: this.id,
          type: 'color',
          newAttr: value
        });
      }
    }
  },

  methods: {
    ...mapActions('scene', [updateAttr])
  }
};
</script>
