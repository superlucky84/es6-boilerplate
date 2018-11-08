<template>
  <li :class="{open: isOpenedDropdown}" class="path1_list_li">
    <a ref="dropdownActivator" class="linkon ti-settings-button">설정</a>
    <div v-if="isOpenedDropdown" class="path2_content">
      <div class="path2_head">
        <h2 class="path2_head_ttl">설정</h2>
        <b-menu-back-button @click="closeDropdown" />
      </div>
      <div class="path2_body">
        <h3 class="path_ttl">글꼴</h3>
        <select v-model="fontFamily" class="select-normal ti-font-select">
          <option v-for="font in fontList" :key="font.fontFamily" :value="font.fontFamily">{{font.title}}</option>
        </select>
      </div>
    </div>
  </li>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import Dropdown from '@/mixins/dropdown';
import BMenuBackButton from '@/components/BMenuBackButton';

import {fetchFontList} from '@/helpers/api';
import {changeFontFamily} from '@/store/types';

export default {
  name: 'TopMenuGlobalSettings',

  components: {BMenuBackButton},

  mixins: [Dropdown],

  data() {
    return {
      fontList: []
    };
  },

  computed: {
    ...mapState({
      fontFamilyOfState: state => state.page.fontFamily
    }),
    fontFamily: {
      get() {
        return this.fontFamilyOfState;
      },
      set(newFontFamily) {
        this.changeFontFamily({
          fontFamily: newFontFamily
        });
      }
    }
  },

  async mounted() {
    this.fontList = await fetchFontList();
  },
  methods: {
    ...mapActions([changeFontFamily])
  }
};
</script>
