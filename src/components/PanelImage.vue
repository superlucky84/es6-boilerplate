<template>
  <div class="line-wrap">
    <div class="image">
      <template v-if="isSlider">
        <div class="bg_image img-list">
          <!-- 이미지 선택 최대 6개 -->
          <image-list :checked-ids.sync="sliderImageIds" :checkable="sliderImageIds.length < 7" />
        </div>
        <div class="bg_image slide-list">
          <slide-image-list :image-ids.sync="sliderImageIds" />
        </div>
      </template>
      <template v-else>
        <div class="bg_image img-list img-list-only">
          <image-list :selected-id.sync="selectedId" selectable />
        </div>
      </template>
    </div>

    <div class="check-text">
      <div class="checkbox middle">
        <input
          id="checkbox3"
          :disabled="!(enableFixedRatioOption)"
          v-model="isFixedRatio"
          class="inpbr"
          name="checkbox"
          type="checkbox"
        >
        <label class="box_img" for="checkbox3" />
      </div>
      <p class="label-wrap">
        <label class="txt_label" for="checkbox3">가로 세로 비율 고정</label>
      </p>
    </div>
    <div v-if="!isSlider" class="check-text">
      <div class="checkbox middle">
        <input
          id="checkbox4"
          :disabled="!(enableFixedBackgroundOption)"
          v-model="isFixedBackground"
          class="inpbr"
          name="checkbox"
          type="checkbox"
        >
        <label class="box_img" for="checkbox4" />
      </div>
      <p class="label-wrap">
        <label class="txt_label ti-fixed-background" for="checkbox4">배경 스크롤 고정</label>
      </p>
    </div>
  </div>
</template>
<script>
import {mapActions, mapState} from 'vuex';
import {updateAttr} from '@/store/types';
import ImageList from '@/components/ImageList';
import elementDnDChannel from '@/helpers/elementDnDChannel';
import SlideImageList from '@/components/SlideImageList';

export default {
  name: 'PanelImage',

  components: {SlideImageList, ImageList},

  props: {
    id: {
      type: String,
      required: true
    },

    enableFixedRatioOption: {
      type: Boolean,
      default: false
    },

    enableFixedBackgroundOption: {
      type: Boolean,
      default: false
    },

    attr: {
      type: Object,
      required: true
    },

    isSlider: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      originalImageInfo(state) {
        const imageId = this.isSlider ? this.sliderImageIds[0] : this.selectedId;

        return state.imageList.entities[imageId];
      }
    }),

    isFixedRatio: {
      get() {
        return this.attr.isFixedRatio;
      },
      set(isFixedRatio) {
        this.updateAttr({
          id: this.id,
          type: 'image',
          newAttr: {isFixedRatio}
        });
        this.adjustFixedRatioIfNeeded();
      }
    },

    isFixedBackground: {
      get() {
        return this.attr.isFixedBackground;
      },
      set(isFixedBackground) {
        this.updateAttr({
          id: this.id,
          type: 'image',
          newAttr: {isFixedBackground}
        });
      }
    },

    selectedId: {
      get() {
        return this.attr.id;
      },
      set(selectedId) {
        this.updateAttr({
          id: this.id,
          type: 'image',
          newAttr: {id: selectedId}
        });
        this.adjustFixedRatioIfNeeded();
      }
    },

    sliderImageIds: {
      get() {
        return this.attr.ids;
      },
      set(imgIds) {
        this.updateAttr({
          id: this.id,
          type: 'image',
          newAttr: {ids: imgIds}
        });
        this.adjustFixedRatioIfNeeded();
      }
    }
  },

  methods: {
    ...mapActions('scene', [updateAttr]),

    adjustFixedRatioIfNeeded() {
      if (this.isFixedRatio) {
        if (this.originalImageInfo) {
          elementDnDChannel.fixRatio(this.originalImageInfo);
        } else {
          // 선택 이미지가 없는 경우 현재 사이즈를 기준으로 비율 고정
          const size = {width: elementDnDChannel.width, height: elementDnDChannel.height};
          elementDnDChannel.fixRatio(size);
        }
        elementDnDChannel.release();
      } else {
        elementDnDChannel.unfixRatio();
      }
    }
  }
};
</script>
