<template>
  <!-- 마크업이 "Button"이 아니라 "Paragraph"-->
  <p class="btn">
    <a :style="style" class="btn white-1">
      <editing-text v-if="selected" v-bind="$props" />
      <b-text v-else v-bind="$props" @click.stop.prevent="select" />
    </a>
  </p>
</template>

<script>
import BText from '@/components/elements/BText';
import EditingText from '@/components/EditingText';

export default {
  name: 'BButton',

  components: {
    EditingText,
    BText
  },

  props: {
    id: {
      type: String,
      required: true
    },

    selected: {
      type: Boolean,
      default: false
    },

    attrs: {
      type: Object,
      required: true
    },

    select: {
      type: Function,
      default: () => {}
    },

    contents: {
      type: String,
      required: true
    }
  },

  computed: {
    style() {
      return {
        backgroundColor: this.attrs.color
      };
    }
  }
};
</script>
