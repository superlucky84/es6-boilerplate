<template>
  <div :style="style" class="wrap ti-section">
    <div :class="`columnArea column-${attrs.column}`" >
      <template v-for="col in childrenData">
        <slot :col="col" name="item">
          <b-section-column
            :key="col.id"
            :id="col.id"
            :children="col.children"
            :elements="elements"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script>
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import SectionColumn from '@/components/SectionColumn';
import BSectionColumn from '@/components/elements/BSectionColumn';

export default {
  name: 'BSection',

  components: {
    BSectionColumn,
    SectionColumn
  },

  props: {
    attrs: {
      type: Object,
      required: true
    },

    children: {
      type: Array,
      required: true
    },

    elements: {
      type: Object,
      required: true
    },

    id: {
      type: String,
      required: true
    }
  },

  computed: {
    style() {
      const {
        attrs: {
          image: {id, isFixedBackground},
          color
        }
      } = this;
      const style = {
        backgroundImage: id ? `url("${this.getImageUrl(id)}")` : '',
        backgroundSize: '100% 100%',
        backgroundColor: color,
        height: '100%',
        backgroundAttachment: isFixedBackground ? 'fixed' : ''
      };

      return this.isFullWidth ? '' : style;
    },

    childrenData() {
      return this.children.map(childId => this.elements[childId]);
    },

    isFullWidth() {
      return this.attrs.fullWidth;
    }
  },
  methods: {
    ...mapGlobalOptionFunctions('getImageUrl')
  }
};
</script>

<style scoped>
</style>
