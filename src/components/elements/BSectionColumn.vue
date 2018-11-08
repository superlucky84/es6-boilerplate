<template>
  <div v-bind="$attrs" class="column" v-on="$listeners">
    <template v-for="child in childrenData">
      <slot :child="child" name="item">
        <b-content :key="child.id" :child="child" />
      </slot>
    </template>
  </div>
</template>

<script>
import BContent from '@/components/BContent';

export default {
  name: 'BSectionColumn',

  components: {BContent},

  props: {
    children: {
      type: Array,
      default: () => []
    },

    elements: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    childrenData() {
      return this.children.map(childId => this.elements[childId]);
    }
  }
};
</script>
