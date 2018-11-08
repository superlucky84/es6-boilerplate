<template>
  <div id="__popup_alert" class="layer_contents ti-popup">
    <div class="bx_tit">
      <strong class="tit">{{headerText}}</strong>
    </div>
    <div class="area_contents">
      <p v-html="bodyText"></p>
      <div v-if="isConfirm" class="confirm-button-box">
        <b-blue-button class="ti-popup-yes-button" @click="close({confirmed: true})">예</b-blue-button>
        <b-blue-button @click="close({confirmed: false})">아니오</b-blue-button>
      </div>
    </div>
    <button type="button" class="btn-close" @click="close">Close</button>
  </div>
</template>

<script>
import BBlueButton from '@/components/BBlueButton';

export default {
  name: 'PopupAlert',

  components: {
    BBlueButton
  },

  props: {
    isConfirm: {
      type: Boolean,
      default: false
    },

    headerText: {
      type: String,
      default: ''
    },

    bodyText: {
      type: String,
      default: ''
    },

    close: {
      type: Function,
      required: true
    }
  }
};
</script>

<style scoped>
#__popup_alert {
  position: relative;
  font-size: 14px;
  min-width: 200px;
  text-align: center;
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.1);
}

#__popup_alert .bx_tit {
  padding-left: 0;
  background: #fff;
  height: 35px;
  color: #464646;
  border-bottom: 1px solid #f4f4f4;
}

#__popup_alert .area_contents {
  padding: 10px;
  border: 0;
  font-size: 12px;
  min-height: 30px;
  vertical-align: middle;
}

#__popup_alert .confirm-button-box {
  margin-top: 10px;
  font-size: 12px;
}
</style>
