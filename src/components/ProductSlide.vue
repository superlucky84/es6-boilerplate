<template>
  <b-product-slide
      :select="select"
      :selected="selected"
      :product-list="productList"
      :column-count="attrs.product.columnCount"
  />
</template>
<script>
import _ from 'lodash';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import BProductSlide from '@/components/elements/BProductSlide';

export default {
  name: 'ProductSlide',

  components: {
    BProductSlide
  },

  props: {
    id: {
      type: String,
      required: true
    },
    attrs: {
      type: Object,
      required: true
    },
    select: {
      type: Function,
      required: false,
      default: () => {}
    },
    selected: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      productList: []
    };
  },

  computed: {
    productCount() {
      return this.attrs.product.productCount;
    }
  },

  watch: {
    productCount() {
      this.$nextTick(() => {
        this.fetchProductList(
          {
            type: 'section',
            id: this.attrs.product.id,
            count: this.attrs.product.productCount,
            sortBy: this.attrs.product.sortBy
          },
          productList => {
            const columnCount = this.attrs.product.columnCount;
            this.productList = _.chunk(productList, columnCount);
          }
        );
      });
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.fetchProductList(
        {
          type: 'section',
          id: this.attrs.product.id,
          count: this.attrs.product.productCount,
          sortBy: this.attrs.product.sortBy
        },
        productList => {
          const columnCount = this.attrs.product.columnCount;
          this.productList = _.chunk(productList, columnCount);
        }
      );
    });
  },

  methods: {
    ...mapGlobalOptionFunctions('fetchProductList')
  }
};
</script>
