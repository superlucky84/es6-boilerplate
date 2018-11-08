<template>
<div>
  <div class="path2_body">
    <h3 class="path_ttl">인스타그램</h3>
    <p v-if="isSnsEnabled" class="path2_body_txt">인스타그램 연동이 완료되었습니다.<br>어드민에서 설정을 변경할 수 있습니다.</p>
    <p v-else class="path2_body_txt">인스타그램 연동이 필요합니다.<br>어드민에서 연동을 설정해주세요.</p>
    <a :href="settingUrl" type="button" class="btn-blue shortcut">설정 바로가기</a>
    <p v-if="isSnsEnabled" class="path2_body_txt">요소 추가시 최신 Feed 12개(3*4)를 불러 옵니다. </p>
  </div>


  <div class="path2_foot">
    <button
        :disabled="!isPossibleAddElement"
        type="button"
        class="foot_btn btn-blue ti-add-element-button"
        @click="addSns">요소 추가</button>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import {currentAddingTargetId, addNewSns, isPossibleAddElement} from '@/store/types';

export default {
  name: 'TopMenuGlobalElementSns',

  computed: {
    ...mapGetters('scene', [currentAddingTargetId, isPossibleAddElement]),
    ...mapState(['sns']),
    isSnsEnabled() {
      return this.sns.enabled;
    },
    settingUrl() {
      return this.sns.settingUrl;
    }
  },

  methods: {
    ...mapActions('scene', [addNewSns]),
    addSns() {
      this.addNewSns({
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
