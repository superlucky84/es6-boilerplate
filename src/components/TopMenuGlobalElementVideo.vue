<template>
  <div>
    <div class="path2_body minHeight">
      <h3 class="path_ttl">YOUTUBE 주소</h3>
      <input
          v-model="url"
          class="inpbr input-normal video_input ti-videourlinput"
          placeholder="유튜브 주소(URL)을 입력해주세요."
          type="text">
      <div class="check-text">
        <div class="checkbox middle">
          <input
              id="checkbox1"
              v-model="autoplay"
              class="inpbr"
              name="checkbox"
              type="checkbox">
          <label class="box_img" for="checkbox1" />
        </div>
        <p class="label-wrap">
          <label class="txt_label" for="checkbox1">자동재생</label>
        </p>
      </div>
      <div class="check-text">
        <div class="checkbox middle">
          <input
              id="checkbox2"
              v-model="loop"
              class="inpbr"
              name="checkbox"
              type="checkbox">
          <label class="box_img" for="checkbox2" />
        </div>
        <p class="label-wrap">
          <label class="txt_label" for="checkbox2">반복재생</label>
        </p>
      </div>
      <p class="path2_body_notes">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
    <div class="path2_foot">
      <button
          :disabled="!isYoutubeUrl || !isPossibleAddElement"
          type="button"
          class="foot_btn btn-blue ti-video-element-add"
          @click="addNewVideoWithPayload">요소 추가</button>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {currentAddingTargetId, addNewVideo, isPossibleAddElement} from '../store/types';
import youtube from '@/helpers/youtubeHelper';
import BButton from '@/components/BMenuButton';
import BBlueButton from '@/components/BBlueButton';

export default {
  name: 'TopMenuGlobalElementVideo',
  components: {
    BButton,
    BBlueButton
  },

  data() {
    return {
      url: '',
      autoplay: false,
      loop: false
    };
  },

  computed: {
    ...mapGetters('scene', [currentAddingTargetId, isPossibleAddElement]),
    isYoutubeUrl() {
      return youtube.isYoutubeUrl(this.url);
    }
  },

  methods: {
    ...mapActions('scene', [addNewVideo]),
    addNewVideoWithPayload() {
      const payload = {
        url: this.url,
        autoplay: this.autoplay,
        loop: this.loop,
        parentId: this.currentAddingTargetId
      };

      this.addNewVideo(payload);
    }
  }
};
</script>

<style scoped>
.basic_li:hover {
  background: #dbeafa;
}
</style>
