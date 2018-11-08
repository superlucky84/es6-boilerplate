<template>
  <!--
    Dependency: Swiper
    http://idangero.us/swiper/
  -->
  <div class="swiper-container">
    <div class="swiper-wrapper" @click.stop.prevent="select">
      <template v-if="!attrs.image.ids.length">
        <div class="swiper-slide">
          <p>슬라이드 이미지를<br>추가하세요.</p>
        </div>
      </template>
      <div v-for="imgId in attrs.image.ids" :key="imgId" class="swiper-slide">
        <img :src="getImageUrl(imgId)">
      </div>
    </div>
    <div class="swiper-button-prev" @click.stop="" />
    <div class="swiper-button-next" @click.stop="" />
    <div class="swiper-pagination" />
  </div>
</template>

<script>
import Swiper from 'swiper';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';

export default {
  name: 'BSlider',

  props: {
    attrs: {
      type: Object,
      required: true
    },

    select: {
      type: Function,
      default: () => {}
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
  },

  updated() {
    this.swiper.update(); // 이미지 추가/삭제 반영
  },

  beforeDestroy() {
    this.swiper.destroy();
  },

  methods: {
    ...mapGlobalOptionFunctions('getImageUrl')
  }
};
</script>
