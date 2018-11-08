<template>
  <div class="footer-policy" @click.stop.prevent="select">
    <ul class="policy" >
      <li>
        <a :style="style" :title="shopInfo('terms')" href="#" >이용약관</a>
      </li>
      <li>
        <a :style="style" :title="shopInfo('personalInfo')" href="#">개인정보처리방침</a>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';

export default {
  name: 'BFooterPolicy',

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
    this.fetchPolicyShopinfo(info => {
       this.info = info;
    });
  },

  methods: {
    ...mapGlobalOptionFunctions('fetchPolicyShopinfo')
  }
};
</script>
