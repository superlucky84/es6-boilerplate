<template>
  <!--
    Dependency: Swiper
    http://idangero.us/swiper/
  -->
  <div class="swiper-container goods-list ti-productslide-component">
    <div :class="['product swiper-wrapper', `column-${columnCount}`]" @click.stop.prevent="select">
      <div v-for="(productColumn, index) in productList" :key="`produnctColumn-${index}`" class="swiper-slide">
        <div v-for="(product, pIndex) in productColumn" :key="`produnct-${pIndex}`" class="column">
          <div class="productsList goods-list-li ti-productslide-item">
            <p class="img">
              <span v-if="product.soldOut" class="sold-out">
                <i>
                  <em>SOLD OUT</em>
                </i>
              </span>
              <a href="#">
                <img :src="product.imageUrl">
              </a>
            </p>
            <dl v-if="product.discount" class="info">
              <dt><a href="#">{{product.productName}}</a></dt>
              <dd>
                <s>{{product.originalPrice}}</s>
                <strong class="discount">{{product.finalPrice}}</strong>
              </dd>
              <dd v-if="product.soonSoldOut"><span>품절임박</span></dd>
            </dl>
            <dl v-else class="info">
              <dt><a href="#">Ready made A project</a></dt>
              <dd><strong>{{product.finalPrice}}</strong></dd>
              <dd v-if="product.soonSoldOut"><span>품절임박</span></dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-button-prev" @click.stop="" />
    <div class="swiper-button-next" @click.stop="" />
    <div class="swiper-pagination" />
  </div>
</template>
<script>
import Swiper from 'swiper';

export default {
  name: 'BProductSlide',

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
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    this.swiper = new Swiper(this.$el, {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination'
      },
      observer: true,
      observeParents: true // 리사이즈 => slide 엘리먼트 사이즈 반영
    });

    if (this.selected) {
      // Touch move X
      // DND mouse move O
      this.swiper.allowTouchMove = false;
    }
  }
};
</script>
