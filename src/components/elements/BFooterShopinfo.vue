<template>
  <div :style="style" class="footer-shopinfo" @click.stop.prevent="select">
    <ul>
      <li>상호명 : {{shopInfo('businessName')}}</li>
      <li>대표 : {{shopInfo('representative')}}</li>
      <li>개인정보처리담당자 : {{shopInfo('infomationManager')}}</li>
      <li>전화 : {{shopInfo('phone')}}</li>
      <li>이메일 : {{shopInfo('email')}}</li>
      <li>주소 : {{shopInfo('address')}}</li>
      <li>사업자번호 : {{shopInfo('registrationNumber')}}</li>
      <li>통신판매 : {{shopInfo('mailOrderInfo')}}</li>
    </ul>
    <p class="copyright">
      {{shopInfo('copyright')}}
    </p>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';

export default {
  name: 'BFooterShopinfo',

  props: {
    id: {
      type: String,
      required: true
    },

    attrs: {
      type: Object,
      required: false,
      default: () => {}
    },

    selected: {
      type: Boolean,
      default: false
    },

    select: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      info: {}
    };
  },

  computed: {
    shopInfo(state) {
      return infoName => this.info[infoName];
    },
    style() {
      return {
        color: this.attrs.color
      };
    }
  },
  mounted() {
    this.fetchPrimaryShopinfo(info => {
      this.info = info;
    });
  },

  methods: {
    ...mapGlobalOptionFunctions('fetchPrimaryShopinfo')
  }
};
</script>
