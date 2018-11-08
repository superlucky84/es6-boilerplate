<template>
  <div :class="['product columnArea ti-productlist-component', `column-${columnCount}`]" @click.stop.prevent="select">
    <div v-for="(product, index) in productList" :key="index" class="column">
      <ul class="productsList">
        <li>
          <p class="img">
            <a href="#">
              <img :src="product.imageUrl">
              <strong v-if="product.discount" class="ico-discount">
                <span>할인</span>
              </strong>
            </a>
          </p>
          <dl class="info">
            <dt>Ready made A project</dt>
            <dd>
              <s v-if="product.discount">{{product.originalPrice}}</s>
              <strong class="discount">{{product.finalPrice}}</strong>
            </dd>
            <dd v-if="product.soonSoldOut">
              <span>품절임박</span>
            </dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BProductList',

  props: {
    select: {
      type: Function,
      required: false,
      default: () => {}
    },
    productList: {
      type: Array,
      required: true
    },
    columnCount: {
      type: Number,
      required: true
    }
  }
};
</script>
