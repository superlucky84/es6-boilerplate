<script>
import {mapActions} from 'vuex';
import _ from 'lodash';

import {updateAttr} from '@/store/types';
import ColorPicker from './ColorPicker';

export default {
  name: 'PanelText',
  components: {
    ColorPicker
  },
  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fontSizeCandidate: _.range(5, 121, 5),
      letterSpacingCandidate: [
        {
          name: '매우 좁게',
          value: -0.1
        },
        {
          name: '좁게',
          value: -0.05
        },
        {
          name: '표준으로',
          value: 0
        },
        {
          name: '넓게',
          value: 0.1
        },
        {
          name: '매우 넓게',
          value: 0.3
        }
      ],
      lineHeightCandidate: ['1.0', '1.5', '2.0', '2.5', '3.0']
    };
  },
  computed: {
    fontSize: {
      get() {
        return this.attr.fontSize;
      },
      set(value) {
        this.update({fontSize: value});
      }
    },
    letterSpacing: {
      get() {
        return this.attr.letterSpacing;
      },
      set(value) {
        this.update({letterSpacing: value});
      }
    },
    lineHeight: {
      get() {
        return this.attr.lineHeight;
      },
      set(value) {
        this.update({lineHeight: value});
      }
    },
    textAlign: {
      get() {
        return this.attr.textAlign;
      },
      set(value) {
        this.update({textAlign: value});
      }
    },
    verticalAlign: {
      get() {
        return this.attr.verticalAlign;
      },
      set(value) {
        this.update({verticalAlign: value});
      }
    },
    color: {
      get() {
        return this.attr.color;
      },
      set(value) {
        this.update({color: value});
      }
    }
  },
  methods: {
    ...mapActions('scene', [updateAttr]),
    update(newAttr) {
      this.updateAttr({
        id: this.id,
        type: 'text',
        newAttr
      });
    }
  }
};
</script>
<template>
<div class="textPanel">
  <div class="typesetting">
    <ul>
      <li class="set_li">
        <em class="set_em">크기</em>
        <span class="select">
          <select
            id="text-panel-font-size-selector"
            v-model="fontSize"
            class="select-normal"
            @change="update">
            <option
              v-for="value in fontSizeCandidate"
              :key="value"
              :value="value">{{value}}</option>
          </select>
        </span>
      </li>
      <li class="set_li">
        <em class="set_em">자간</em>
        <span class="select">
          <select
            id="text-panel-letter-spacing-selector"
            v-model="letterSpacing"
            class="select-normal"
            @change="update">
            <option
              v-for="item in letterSpacingCandidate"
              :key="item.value"
              :value="item.value">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li class="set_li">
        <em class="set_em">색상</em>
        <p class="colorResult">
          <color-picker ref="colorPicker" v-model="color" />
        </p>
      </li>
      <li class="set_li">
        <em class="set_em">줄간격</em>
        <span class="select">
          <select
            id="text-panel-line-height-selector"
            v-model="lineHeight"
            class="select-normal"
            @change="update">
            <option
              v-for="value in lineHeightCandidate"
              :key="value"
              :value="value"
              >{{value}}</option>
          </select>
        </span>
      </li>
      <li class="set_li">
        <em class="set_em">정렬</em>
        <p id="text-panel-text-align" class="textType transverse image-radio-section">
          <input
            id="transLeft"
            v-model="textAlign"
            type="radio"
            value="left"
            @change="update"
          >
          <label for="transLeft" class="text_btn radio-label transLeft" />
          <input
            id="transCenter"
            v-model="textAlign"
            type="radio"
            value="center"
            @change="update"
          >
          <label for="transCenter" class="text_btn radio-label transCenter" />
          <input
            id="transRight"
            v-model="textAlign"
            type="radio"
            value="right"
            @change="update"
          >
          <label for="transRight" class="text_btn radio-label transRight" />
          <input
            id="transAlignment"
            v-model="textAlign"
            type="radio"
            value="justify"
            @change="update"
          >
          <label for="transAlignment" class="text_btn radio-label transAlignment" />
        </p>
      </li>
      <li class="set_li">
        <em class="set_em">맞춤</em>
        <p id="text-panel-vertical-align" class="textType vertical image-radio-section">
          <input
            id="verTop"
            v-model="verticalAlign"
            type="radio"
            value="top"
            @change="update"
          >
          <label for="verTop" class="text_btn radio-label verTop" />
          <input
            id="verCenter"
            v-model="verticalAlign"
            type="radio"
            value="middle"
            @change="update"
          >
          <label for="verCenter" class="text_btn radio-label verCenter" />
          <input
            id="verBottom"
            v-model="verticalAlign"
            type="radio"
            value="bottom"
            @change="update"
          >
          <label for="verBottom" class="text_btn radio-label verBottom" />
        </p>
      </li>
    </ul>
  </div>
</div>
</template>
