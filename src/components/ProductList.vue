<template>
  <b-product-list
      :select="select"
      :product-list="productList"
      :column-count="attrs.product.columnCount"
  />
</template>
<script>
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import BProductList from '@/components/elements/BProductList';

export default {
  name: 'ProductList',

  components: {
    BProductList
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
            type: this.attrs.product.type,
            id: this.attrs.product.id,
            count: this.attrs.product.productCount,
            sortBy: this.attrs.product.sortBy
          },
          productList => {
            this.productList = productList;
          }
        );
      });
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.fetchProductList(
        {
          type: this.attrs.product.type,
          id: this.attrs.product.id,
          count: this.attrs.product.productCount,
          sortBy: this.attrs.product.sortBy
        },
        productList => {
          this.productList = productList;
        }
      );
    });
  },

  methods: {
    ...mapGlobalOptionFunctions('fetchProductList')
  }
};
</script>
