<template>
  <div>
    <div v-if="isMapSetting" class="path2_body">
      <h3 class="path_ttl">카카오 맵</h3>
      <p class="path2_body_txt">카카오 맵 연동 및 설정 완료
        <br>어드민에서 설정을 변경할 수 있습니다.</p>
        <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
        <p class="path2_body_txt">설정된 지도를 불러옵니다. </p>
        <p class="path2_body_notes">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
    <div v-else class="path2_body">
      <h3 class="path_ttl">카카오 맵</h3>
      <p class="path2_body_txt">카카오 맵 연동 및 설정이 필요합니다.
        <br>어드민에서 연동을 설정해주세요.</p>
        <button type="button" class="btn-blue shortcut">설정 바로가기</button>
        <p class="path2_body_notes">선택한 섹션이나 최하단 섹션에 추가됩니다.</p>
    </div>
    <div class="path2_foot">
      <button
          :disabled="!isPossibleAddElement || !isPossibleAddElement"
          type="button"
          class="foot_btn btn-blue ti-map-element-add"
          @click="addNewMap">요소 추가</button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import BButton from '@/components/BMenuButton';
import BBlueButton from '@/components/BBlueButton';
import {currentAddingTargetId, addNewMap, isPossibleAddElement} from '../store/types';

export default {
  name: 'TopMenuGlobalElementProductDisplay',

  components: {
    BButton,
    BBlueButton
  },

  computed: {
    ...mapGetters('scene', [currentAddingTargetId, isPossibleAddElement]),
    ...mapState(['map']),
    isMapSetting() {
      return this.map.enabled;
    },
    mapInfo() {
      return this.map.mapInfo;
    },
    settingUrl() {
      return this.map.settingUrl;
    }
  },

  methods: {
    ...mapActions('scene', {
      _addNewMap: addNewMap
    }),

    addNewMap() {
      this._addNewMap({
        parentId: this.currentAddingTargetId
      });
    }
  }
};
</script>

<style scoped>
.basic_li:hover {
  background: #dbeafa;
}
a.btn-blue,
a.btn-blue:hover {
  display: inline-block;
  margin-top: 10px;
  padding: 0 10px;
  text-align: center;
  color: #fff;
}
</style>
