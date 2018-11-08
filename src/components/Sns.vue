<template>
  <b-sns
    ref="bsns"
    :attrs="editingAttrs"
    :image-list="imageList"
    @click="select"
  />
</template>
<script>
import _ from 'lodash';

import {mapState} from 'vuex';
import BSns from './elements/BSns';
import elementDnDChannel from '@/helpers/elementDnDChannel';

export default {
  components: {
    BSns
  },

  props: {
    id: {
      type: String,
      required: true
    },

    attrs: {
      type: Object,
      required: true
    },

    select: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      // 현재 엘리먼트의 사이즈를 수정 중일 때, 실시간으로 업데이트하여 정렬을 유지시키기 위함.
      editingAttrs: {
        ...this.attrs,
        dimension: {
          ...this.attrs.dimension
        }
      }
    };
  },
  computed: {
    ...mapState(['sns']),
    imageList() {
      return this.sns.imageList;
    }
  },
  mounted() {
    elementDnDChannel.$on('grab', this.handleElementDnDGrab);
  },

  beforeDestroy() {
    elementDnDChannel.$off('grab', this.handleElementDnDGrab);
  },
  methods: {
    handleElementDnDGrab() {
      if (elementDnDChannel.elementId === this.id) {
        elementDnDChannel.$on('update', this.handleElementDnDUpdate);
      } else {
        elementDnDChannel.$off('update', this.handleElementDnDUpdate);
      }
    },

    handleElementDnDUpdate() {
      this.editingAttrs.dimension.width = elementDnDChannel.width;
      this.editingAttrs.dimension.height = elementDnDChannel.height;
    }
  }
};
</script>
