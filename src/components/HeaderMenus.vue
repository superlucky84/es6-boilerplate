<template>
  <b-header-menus :select="select" :update-demension="updateDimension" />
</template>

<script>
import {mapMutations, mapGetters} from 'vuex';
import {updateElement, isSceneElement, updateHeaderElement} from '@/store/types';
import elementDnDChannel from '@/helpers/elementDnDChannel';
import BHeaderMenus from '@/components/elements/BHeaderMenus';

export default {
  name: 'HeaderMenus',

  components: {
    BHeaderMenus
  },

  props: {
    id: {
      type: String,
      required: true
    },

    attrs: {
      type: Object,
      required: false,
      default: () => {}
    },

    selected: {
      type: Boolean,
      default: false
    },

    select: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters('scene', [isSceneElement])
  },
  mounted: function() {
    // Todo - 마운트시에는 폰트가 적용이 안된 크기로 계산되어 timeout으로 임시해결함.
    this.$nextTick(() => {
      setTimeout(() => {
        this.updateDimension();
      }, 30);
    });
  },

  methods: {
    ...mapMutations('scene', {updateElement}),
    ...mapMutations({updateHeaderElement}),
    calculateWidth() {
      let width = 0;
      this.$el.querySelectorAll('li').forEach(li => {
        width += li.getBoundingClientRect().width;
      });

      return Math.ceil(width);
    },

    updateDimension() {
      if (this.selected) {
        elementDnDChannel.setDimension({width: this.calculateWidth()});
        elementDnDChannel.updateToStore();
      } else {
        const updater = this.isSceneElement(this.id) ? 'updateElement' : 'updateHeaderElement';
        const {height, top, left} = this.attrs.dimension;
        this[updater]({
          id: this.id,
          updating: {
            attrs: {
              dimension: {
                width: this.calculateWidth(),
                height,
                top,
                left
              }
            }
          }
        });
      }
    }
  }
};
</script>
