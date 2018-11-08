<script>
import youtube from '@/helpers/youtubeHelper';
import {mapMutations} from 'vuex';
import {updateElement} from '@/store/types';

export default {
  name: 'PanelVideo',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: Object,
      required: true
    },
    elementType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      youtubeUrl: this.attr.url
    };
  },

  computed: {
    autoplay: {
      get() {
        return this.attr.autoplay;
      },
      set(autoplay) {
        this.updateElement({autoplay});
      }
    },
    loop: {
      get() {
        return this.attr.loop;
      },
      set(loop) {
        this.updateElement({loop});
      }
    }
  },

  mounted() {
    this.$refs.youtubeUrl.addEventListener('blur', () => {
      if (youtube.isYoutubeUrl(this.youtubeUrl)) {
        this.updateElement({
          url: this.youtubeUrl
        });
      } else {
        this.youtubeUrl = this.attr.url;
      }
    });
  },

  methods: {
    ...mapMutations('scene', {_updateElement: updateElement}),
    updateElement(video) {
      this._updateElement({
        id: this.id,
        updating: {
          attrs: {
            video
          }
        }
      });
    }
  }
};
</script>
<template>
  <div class="videoPanel">
    <div class="line-wrap">
      <div class="path2_body video">
        <h3 class="path_ttl">YOUTUBE 주소</h3>
        <input
          ref="youtubeUrl"
          v-model="youtubeUrl"
          placeholder="유튜브 주소(URL)을 입력해주세요."
          class="inpbr input-normal video_input ti-videourlinput-panel"
          type="text">
        <div class="check-text">
          <div class="checkbox middle">
            <input
              id="checkbox3"
              v-model="autoplay"
              name="checkbox"
              class="inpbr"
              type="checkbox">
            <label class="box_img" for="checkbox3"/>
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="checkbox3">자동재생</label>
          </p>
        </div>
        <div class="check-text">
          <div class="checkbox middle">
            <input
              id="checkbox4"
              v-model="loop"
              name="checkbox"
              class="inpbr"
              type="checkbox">
            <label class="box_img" for="checkbox4"/>
          </div>
          <p class="label-wrap">
            <label class="txt_label" for="checkbox4">반복재생</label>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
