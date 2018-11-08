<template>
  <div class="video" @click.stop.prevent="select">
    <div ref="video" >video</div>
    <div ref="eventShild" :style="youtubeThumbnail" class="video-inner" />
  </div>
</template>
<script>
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import youtube from '@/helpers/youtubeHelper';
export default {
  name: 'BVideo',

  components: {},

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
      uid: ''
    };
  },

  computed: {
    youtubeId() {
      return youtube.getYoutubeId(this.attrs.video.url);
    },
    youtubeThumbnail() {
      const thumbNail = youtube.getYoutubeThumbnail(this.youtubeId);

      return `background: url(${thumbNail}); background-size: cover`;
    }
  },

  watch: {
    youtubeId(newId, prevId) {
      const prevVideoKey = this.uid;
      const prevPlayerInstance = youtube.playerInstances[prevVideoKey];
      prevPlayerInstance.destroy();
      delete youtube.playerInstances[prevVideoKey];

      this.addPlayer();
    }
  },

  created() {
    this.uid = youtube.makeVideoUid();
  },

  mounted() {
    this.addPlayer();
    this.$refs.eventShild.addEventListener('dblclick', () => {
      const player = youtube.playerInstances[this.uid];
      if (player.getPlayerState() !== 1) {
        player.playVideo();
      } else {
        player.stopVideo();
      }
    });
  },

  beforeDestroy() {
    const player = youtube.playerInstances[this.uid];
    player.destroy();
    delete youtube.playerInstances[this.uid];
  },

  methods: {
    ...mapGlobalOptionFunctions('fetchProductList'),
    addPlayer() {
      youtube.addPlayer({
        key: this.uid,
        id: this.youtubeId,
        element: this.$refs.video,
        autoplay: this.attrs.video.autoplay,
        loop: this.attrs.video.loop,
        cb: () => {
          this.$refs.eventShild.style.background = '';
        }
      });
    }
  }
};
</script>
