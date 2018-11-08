<template>
  <div :class="{off: disabled}" class="line-wrap">
    <div class="typesetting">
      <ul>
        <li class="set_li">
          <strong class="setb">링크</strong>
          <div v-if="count > 0" class="check-text">
            <div class="checkbox middle">
              <input
                id="checkbox41"
                v-model="disabled"
                class="inpbr"
                name="checkbox11"
                type="checkbox"
              >
              <label class="box_img" for="checkbox41" />
            </div>
            <p class="label-wrap">
              <label class="txt_label" for="checkbox41">없음</label>
            </p>
          </div>
        </li>
        <li class="set_li">
          <div class="radio-text">
            <div class="radio middle">
              <input
                id="radio12"
                :disabled="disabled"
                v-model="type"
                value="page"
                class="inpbr"
                name="radio10"
                type="radio"
              >
              <label class="radio_img" for="radio12" />
            </div>
            <p class="label-wrap">
              <label class="txt_label" for="radio12">페이지</label>
            </p>
          </div>
          <span class="select">
              <select :disabled="pageLinkDisabled" v-model="pageId" class="select-normal">
                <option v-for="page in pages" :key="page.id" :value="page.id">{{page.title}}</option>
              </select>
            </span>
        </li>
        <li class="set_li">
          <div class="radio-text">
            <div class="radio middle">
              <input
                id="radio13"
                :disabled="disabled"
                v-model="type"
                value="url"
                class="inpbr"
                name="radio10"
                type="radio"
              >
              <label class="radio_img" for="radio13" />
            </div>
            <p class="label-wrap">
              <label class="txt_label" for="radio13">링크</label>
            </p>
          </div>
          <input
            :disabled="urlLinkDisabled"
            v-model="href"
            class="inpbr input-normal"
            type="text"
            placeholder="링크 주소(URL)를 입력해주세요."
          >
        </li>
        <li class="set_li">
          <div class="radio-text">
            <div class="radio middle">
              <input
                id="radio14"
                :disabled="disabled"
                v-model="target"
                class="inpbr"
                name="target"
                value="_blank"
                type="radio"
              >
              <label class="radio_img" for="radio14" />
            </div>
            <p class="label-wrap">
              <label class="txt_label" for="radio14">새 창에서 열기</label>
            </p>
          </div>
          <div class="radio-text">
            <div class="radio middle">
              <input
                id="radio15"
                :disabled="disabled"
                v-model="target"
                class="inpbr"
                name="target"
                value="_self"
                type="radio"
              >
              <label class="radio_img" for="radio15" />
            </div>
            <p class="label-wrap">
              <label class="txt_label" for="radio15">현재 창에서 열기</label>
            </p>
          </div>
        </li>
      </ul>
      <div v-if="isMultiple" class="page">
        <template v-if="count > 0">
          <button type="button" class="btn-page pre" @click="prev">previous</button>
          <p class="page_txt">슬라이드 {{curIndex + 1}}/{{count}} </p>
          <button type="button" class="btn-page next" @click="next">next</button>
        </template>
        <template v-else>
          <p class="page_txt">슬라이드 없음</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import {updateAttr} from '@/store/types';

export default {
  name: 'PanelLink',

  props: {
    id: {
      type: String,
      required: true
    },

    attr: {
      type: Array,
      required: true
    },

    count: {
      type: Number,
      default: 1
    },

    isMultiple: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      curIndex: 0
    };
  },

  computed: {
    ...mapState({
      pages: ({page}) => [
        {id: 'index', ...page.entities.index},
        ...page.linked.map(id => ({id, ...page.entities[id]})),
        ...page.unlinked.map(id => ({id, ...page.entities[id]}))
      ]
    }),

    disabled: {
      get() {
        return this.linkEntity.disabled;
      },
      set(disabled) {
        this.updateCurrentLink({disabled});
      }
    },

    type: {
      get() {
        return this.linkEntity.type;
      },
      set(type) {
        if (type === 'page') {
          this.updateCurrentLink({type, href: null});
        } else {
          this.updateCurrentLink({type, id: 'index'});
        }
      }
    },

    target: {
      get() {
        return this.linkEntity.target;
      },
      set(target) {
        this.updateCurrentLink({target});
      }
    },

    pageId: {
      get() {
        if (this.pageLinkDisabled) {
          return null;
        }

        return this.linkEntity.id;
      },
      set(id) {
        this.updateCurrentLink({id});
      }
    },

    href: {
      get() {
        if (this.urlLinkDisabled) {
          return null;
        }

        return this.linkEntity.href;
      },
      set(href) {
        this.updateCurrentLink({href});
      }
    },

    linkEntity() {
      const {count} = this;
      let {attr} = this;
      const diff = attr.length - count;

      if (diff) {
        if (diff < 0) {
          attr = [...attr, ...new Array(count - attr.length)];
        } else {
          attr = attr.slice(0, count);
        }

        this.updateAttr({
          id: this.id,
          type: 'link',
          newAttr: attr
        });
      }

      return attr[this.curIndex] || {disabled: true, type: 'page', id: 'index', target: '_blank'};
    },

    pageLinkDisabled() {
      return this.disabled || this.linkEntity.type !== 'page';
    },

    urlLinkDisabled() {
      return this.disabled || this.linkEntity.type !== 'url';
    }
  },

  methods: {
    ...mapActions('scene', {updateAttr: updateAttr}),

    updateCurrentLink(updating) {
      const newAttr = [...this.attr];
      newAttr.splice(this.curIndex, 1, {...this.linkEntity, ...updating});

      this.updateAttr({
        id: this.id,
        type: 'link',
        newAttr: newAttr
      });
    },

    next() {
      const {curIndex, count} = this;

      this.curIndex = Math.min(count - 1, curIndex + 1);
    },

    prev() {
      const {curIndex} = this;

      this.curIndex = Math.max(0, curIndex - 1);
    }
  }
};
</script>
