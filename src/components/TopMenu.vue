<template>
  <div id="editPanel">
    <top-menu-global />
    <top-menu-current-page/>
    <ul class="operating">
      <li class="operating_li">
        <button :class="['btn_undo', {disable: !canUndo}, 'ti-undo-button']" @click="undo">실행취소</button>
      </li>
      <li class="operating_li">
        <button :class="['btn_redo', {disable: !canRedo}, 'ti-redo-button']" @click="redo">실행취소</button>
      </li>
    </ul>
    <div class="editMenu">
      <ul class="editMenu_main">
        <top-menu-history />
        <li class="menu_main_li">
          <a
            href="#"
            class="ti-save-button"
            @click.prevent="save"
            >저장하기</a>
        </li>
        <li class="menu_main_li">
          <a
            href="#"
            class="ti-preview-button"
            @click.prevent="preview"
          >미리보기</a>
        </li>
        <li class="menu_main_li">
          <a
            href="#"
            class="ti-publish-button"
            @click.prevent="publish"
          >게시하기</a>
        </li>
      </ul>
      <ul class="editMenu_sub">
        <li class="menu_sub_li ti-link-admin">
          <a :href="links.admin" class="sub_link">어드민</a>
        </li>
        <li class="menu_sub_li">
          <a href="#" class="sub_link" @click.prevent="logout()" >로그아웃</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import {savePageFromScene} from '@/store/types';
import {undo, redo, resetDoStack} from '@/store/doManager';
import makeHtml from '@/helpers/htmlExport';
import TopMenuGlobal from './TopMenuGlobal';
import TopMenuCurrentPage from './TopMenuCurrentPage';
import TopMenuHistory from './TopMenuHistory';
import TopMenuGlobalElement from './TopMenuGlobalElement';
import TopMenuGlobalMenuPage from './TopMenuGlobalMenuPage';
import {getGlobalOptions} from '@/helpers/globalOptions';
import * as api from '@/helpers/api';
import {uiAlert} from '@/helpers/uiAlert';

export default {
  components: {
    TopMenuHistory,
    TopMenuCurrentPage,
    TopMenuGlobal,
    TopMenuGlobalElement,
    TopMenuGlobalMenuPage
  },
  computed: {
    ...mapState(['canUndo', 'canRedo', 'links']),
    ...mapState({
      currentPageUrl: ({page, scene}) => {
        return page.entities[scene.pageId].url;
      },
      currentPageId: ({scene}) => {
        return scene.pageId;
      }
    })
  },
  methods: {
    ...mapActions([savePageFromScene]),
    undo,
    redo,
    save() {
      this.savePageFromScene();
      resetDoStack();
    },
    logout() {
      const {logout} = getGlobalOptions('logout');
      logout(() => {
        location.reload();
      });
    },
    async publish() {
      const publishResult = makeHtml.makePageAll();
      const previewLink = await api.publishPageContents(publishResult);

      uiAlert({
        headerText: '페이지가 게시되었습니다.',
        bodyText: previewLink
      });
    },
    async preview() {
      const publishResult = makeHtml.makePageAll();
      const previewLink = await api.previewPageContents({
        pageId: this.currentPageId,
        htmls: publishResult
      });

      window.open(previewLink, '_blank');
    }
  },
  globalKeymap: {
    mac: {
      'META+Z': 'undo',
      'SHIFT+META+Z': 'redo'
    },
    win: {
      'CTRL+Z': 'undo',
      'CTRL+Y': 'redo'
    }
  }
};
</script>
