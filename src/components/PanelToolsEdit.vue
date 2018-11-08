<template>
  <ul class="ico-list cf">
    <li class="ico_li">
      <button
        class="btn-tool ico-copy ti-copy-button"
        title="복사(Ctrl + C)"
        @click="copy">복사(Ctrl + C)</button>
    </li>
    <li class="ico_li">
      <button
        class="btn-tool ico-cut ti-cut-button"
        title="자르기(Ctrl + X)"
        @click="cut">자르기(Ctrl + X)</button>
    </li>
    <li class="ico_li">
      <button
        class="btn-tool ico-paste ti-paste-button"
        title="붙여넣기(Ctrl + V)"
        @click="paste">붙여넣기(Ctrl + V)</button>
    </li>
    <li class="ico_li">
      <button
        class="btn-tool ico-delete ti-delete-button"
        title="삭제(Delete)"
        @click="deleteel">삭제(Delete)</button>
    </li>
  </ul>
</template>
<script>
import {mapActions} from 'vuex';
import {copyToClipboard, pasteFromClipboard, cutToClipboard, deleteElements} from '@/store/types';
import elementDnDChannel from '@/helpers/elementDnDChannel';

export default {
  name: 'PanelToolsEdit',
  methods: {
    ...mapActions('scene', {
      copyToClipboard,
      cutToClipboard,
      deleteElements,
      pasteFromClipboard
    }),
    paste() {
      this.excuteEvent('pasteFromClipboard', {
        columnsRect: elementDnDChannel.columnsRect
      });
    },
    copy() {
      this.excuteEvent('copyToClipboard');
    },
    cut() {
      this.excuteEvent('cutToClipboard');
    },
    deleteel() {
      this.excuteEvent('deleteElements');
    },
    excuteEvent(actionName, params = null) {
      if (!elementDnDChannel.focusedInput) {
        this[actionName](params);
      }
    }
  },
  globalKeymap: {
    mac: {
      'META+C': 'copy',
      'META+V': 'paste',
      'META+X': 'cut'
    },
    win: {
      'CTRL+C': 'copy',
      'CTRL+V': 'paste',
      'CTRL+X': 'cut'
    },
    DELETE: 'deleteel',
    BACK_SPACE: 'deleteel'
  }
};
</script>
