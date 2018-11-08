<script>
import {mapActions, mapGetters} from 'vuex';
import _ from 'lodash';
import {updateAttr} from '@/store/types';
import types from '../store/types';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import PanelProductCategory from '@/components/PanelProductCategory';
import PanelProductSection from '@/components/PanelProductSection';
import PanelProductSectionSlide from '@/components/PanelProductSectionSlide';

export default {
  name: 'PanelProduct',
  components: {
    PanelProductCategory,
    PanelProductSection,
    PanelProductSectionSlide
  },
  props: {
    id: {
      type: String,
      required: true
    },
    attr: {
      type: Object,
      required: true
    },
    elementType: {
      type: String,
      required: true
    }
  },
  computed: {
    panelType(){
      let componentType = 'category';

      if (this.elementType === 'productSlide') {
        componentType = 'sectionSlide';
      } else if (this.attr.type === 'section') {
        componentType = 'section';
      }

      return componentType;
    }
  }
};
</script>
<template>
  <div>
    <panel-product-category v-if="panelType === 'category'" :id="id" :attr="attr" />
    <panel-product-section v-if="panelType === 'section'" :id="id" :attr="attr" />
    <panel-product-section-slide v-if="panelType === 'sectionSlide'" :id="id" :attr="attr" />
  </div>
</template>
