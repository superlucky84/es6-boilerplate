<template>
  <li class="menupage_li" @dblclick="setEditing">
    <template v-if="isEditing && !fixed">
      <div class="editArea">
        <input
          v-focus
          ref="editingInput"
          v-model.trim="newTitle"
          class="inpbr input-normal"
          type="text"
          @blur="setEditing(false)"
          @keyup.enter="saveTitle"
        >
        <!-- Click은 input-blur에 의해 발생하지 않아서 mousedown 사용 -->
        <b-blue-button class="editBtn" @mousedown="saveTitle">적용</b-blue-button>
      </div>
    </template>
    <template v-else>
      <span v-if="!fixed" class="ico-dot">dot</span>
      <p class="list_name">{{entity.title}}</p>
      <div v-if="!fixed" class="setArea">
        <button type="button" class="btn btn-setup" @click="openPopupPageSetting">setting</button>
        <template v-if="isLinkedPage(pageId)">
          <button type="button" class="btn btn-file" @click="switchLinked(pageId)">Move to bottom</button>
        </template>
        <template v-else>
          <button type="button" class="btn btn-menu" @click="switchLinked(pageId)">Move to bottom</button>
        </template>
        <button type="button" class="btn btn-close-5" @click="deletePage(pageId)">delete</button>
      </div>
    </template>
  </li>
</template>

<script>
import {mapState, mapActions, mapGetters} from 'vuex';
import {Wormhole} from 'portal-vue';
import {deletePage, switchLinked, isLinkedPage, modifyPage} from '@/store/types';
import BBlueButton from './BBlueButton';
import PopupPageSetting from './PopupPageSetting';

export default {
  name: 'MenuPageTreeNode',

  components: {
    BBlueButton
  },

  props: {
    pageId: {
      type: String,
      required: true
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isEditing: false,
      newTitle: ''
    };
  },

  computed: {
    ...mapState({
      entity(state) {
        return state.page.entities[this.pageId];
      }
    }),
    ...mapGetters([isLinkedPage])
  },

  watch: {
    isEditing(cur) {
      if (cur) {
        this.newTitle = this.entity.title;
      }
    }
  },

  methods: {
    setEditing(next = true) {
      this.isEditing = next;
      this.$emit('onEditing', next);
    },

    saveTitle() {
      if (this.newTitle) {
        this.modifyPage({
          id: this.pageId,
          title: this.newTitle
        });
      }
      this.setEditing(false);
    },

    openPopupPageSetting() {
      const popupVNode = this.$createElement(PopupPageSetting, {
        props: {
          idToModify: this.pageId,
          close: this.closePopupPageSetting
        }
      });

      Wormhole.open({
        to: 'layer',
        from: 'globalMenuPageTree',
        passengers: [popupVNode]
      });
    },

    closePopupPageSetting() {
      Wormhole.close({
        to: 'layer',
        from: 'globalMenuPageTree'
      });
    },

    ...mapActions([modifyPage, deletePage, switchLinked])
  }
};
</script>
