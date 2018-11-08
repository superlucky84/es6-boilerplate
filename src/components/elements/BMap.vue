<template>
  <div ref="map" class="map" @click.stop.prevent="select">Map</div>
</template>

<script>
import loadScriptOnce from 'load-script-once';
import {mapState} from 'vuex';

export default {
  name: 'BMap',

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

  data() {
    return {
      daum: {}
    };
  },

  computed: {
    ...mapState(['map']),
    mapInfo() {
      return this.map.mapInfo;
    }
  },

  mounted() {
    const {
      level,
      apiKey,
      LatLng: {latitude, longitude}
    } = this.mapInfo;

    loadScriptOnce(`//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${apiKey}`, err => {
      if (err) {
        console.error(err);

        return;
      }
      /* global daum:true */
      daum.maps.load(() => {
        const container = this.$refs.map;
        const options = {
          center: new daum.maps.LatLng(latitude, longitude),
          level: level,
          disableDoubleClickZoom: true
        };

        const map = new daum.maps.Map(container, options);
        map.setDraggable(false);
        map.setZoomable(false);
      });
    });
  }
};
</script>
<style>
.map {
  width: 100%;
  height: 100%;
}
</style>
