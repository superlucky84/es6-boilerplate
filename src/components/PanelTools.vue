<template>
  <div class="line-wrap">
    <panel-tools-element />
    <panel-tools-edit />
    <ul class="ico-list cf">
      <li class="ico_li">
        <button class="btn-tool ico-first ti-element-to-front" title="맨 앞으로 가져오기" @click="toFront">맨 앞으로 가져오기</button>
      </li>
      <li class="ico_li">
        <button class="btn-tool ico-last ti-element-to-back" title="맨 뒤로 보내기" @click="toBack">맨 뒤로 보내기</button>
      </li>
      <li class="ico_li">
        <button class="btn-tool ico-front ti-element-to-forward" title="앞으로 가져오기" @click="toForward">앞으로 가져오기</button>
      </li>
      <li class="ico_li">
        <button class="btn-tool ico-after ti-element-to-backward" title="뒤로 보내기" @click="toBackward">뒤로 보내기</button>
      </li>
    </ul>
    <div class="size">
      <p class="ttl">크기</p>
      <ul class="date">
        <li class="date_li">
          <em class="whxy">W</em>
          <span class="dateinp">
            <input
              v-model.number="width"
              :disabled="disabledW"
              type="number"
              min="1"
              class="inpbr inptxt ti-panel-width-input"
              @focus="handleInputFocus"
              @blur="handleInputBlur">
          </span>
        </li>
        <li class="date_li">
          <em class="whxy">H</em>
          <span class="dateinp">
            <input
              v-model.number="height"
              :disabled="disabledH"
              type="number"
              min="1"
              class="inpbr inptxt ti-panel-height-input"
              @focus="handleInputFocus"
              @blur="handleInputBlur">
          </span>
        </li>
      </ul>
      <p class="ttl">위치</p>
      <ul class="date">
        <li class="date_li">
          <em class="whxy">X</em>
          <span class="dateinp">
            <input
              v-model.number="left"
              :disabled="disabledXy"
              type="number"
              class="inpbr inptxt ti-panel-x-input"
              @focus="handleInputFocus"
              @blur="handleInputBlur">
          </span>
        </li>
        <li class="date_li">
          <em class="whxy">Y</em>
          <span class="dateinp">
            <input
              v-model.number="top"
              :disabled="disabledXy"
              type="number"
              class="inpbr inptxt ti-panel-y-input"
              @focus="handleInputFocus"
              @blur="handleInputBlur">
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters, mapActions} from 'vuex';

import {elementToFront, elementToBack, elementToForward, elementToBackward, selectedElements} from '@/store/types';

import PanelToolsElement from './PanelToolsElement';
import PanelToolsEdit from './PanelToolsEdit';
import elementDnDChannel from '../helpers/elementDnDChannel';

export default {
  components: {
    PanelToolsElement,
    PanelToolsEdit
  },

  computed: {
    ...mapState('scene', ['elements']),
    ...mapGetters('scene', [selectedElements]),
    selectedElId() {
      return this.selectedElements[0].id;
    },
    siblingsOfSelectedElement() {
      return this.elements[this.selectedElements[0].parentId].children;
    },
    isSelectedElmentFront() {
      return this.siblingsOfSelectedElement.indexOf(this.selectedElId) + 1 === this.siblingsOfSelectedElement.length;
    },
    isSelectedElmentBack() {
      return this.siblingsOfSelectedElement.indexOf(this.selectedElId) === 0;
    },
    left: {
      get: () => Math.ceil(elementDnDChannel.left),
      set: left => elementDnDChannel.setDimension({left: Math.ceil(left)})
    },

    top: {
      get: () => Math.ceil(elementDnDChannel.top),
      set: top => elementDnDChannel.setDimension({top: Math.ceil(top)})
    },

    width: {
      get: () => Math.floor(elementDnDChannel.width),
      set: width => elementDnDChannel.setDimension({width: Math.floor(width)})
    },

    height: {
      get: () => Math.floor(elementDnDChannel.height),
      set: height =>
        elementDnDChannel.setDimension({height: Math.floor(height)}, {shouldAdjust: !elementDnDChannel.isSection})
    },

    disabledW() {
      return !elementDnDChannel.elementId || !elementDnDChannel.draggable || elementDnDChannel.isSection;
    },

    disabledH() {
      return !elementDnDChannel.elementId || !elementDnDChannel.draggable;
    },

    disabledXy() {
      return !elementDnDChannel.elementId || elementDnDChannel.isSection;
    }
  },

  methods: {
    ...mapActions('scene', [elementToForward, elementToBackward, elementToFront, elementToBack]),
    handleInputFocus() {
      elementDnDChannel.setFocusedInput(true);
    },
    handleInputBlur() {
      elementDnDChannel.setFocusedInput(false);
      elementDnDChannel.release();
    },
    toBack() {
      if (this.isSelectedElmentBack) {
        return;
      }
      this.elementToBack();
    },
    toFront() {
      if (this.isSelectedElmentFront) {
        return;
      }
      this.elementToFront();
    },
    toForward() {
      if (this.isSelectedElmentFront) {
        return;
      }
      this.elementToForward();
    },
    toBackward() {
      if (this.isSelectedElmentBack) {
        return;
      }
      this.elementToBackward();
    }
  }
};
</script>
