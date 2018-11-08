<template>
  <div :class="{open: isOpenedDropdown}" class="setPanel_menu">
    <p ref="dropdownActivator" class="tool_menu">
      <a class="menuBtn">메뉴</a>
    </p>
    <div v-if="isOpenedDropdown" class="menuPath1">
      <ul class="path1_list ti-global-menu">
        <top-menu-global-menu-page />
        <top-menu-global-page />
        <top-menu-global-section />
        <top-menu-global-element />
        <top-menu-global-image-upload />
        <top-menu-global-settings />
      </ul>
    </div>
  </div>
</template>

<script>
import Dropdown from '@/mixins/dropdown';
import TopMenuGlobalElement from '@/components/TopMenuGlobalElement';
import TopMenuGlobalMenuPage from '@/components/TopMenuGlobalMenuPage';
import TopMenuGlobalSection from '@/components/TopMenuGlobalSection';
import TopMenuGlobalImageUpload from '@/components/TopMenuGlobalImageUpload';
import TopMenuGlobalPage from '@/components/TopMenuGlobalPage';
import TopMenuGlobalSettings from '@/components/TopMenuGlobalSettings';

export default {
  name: 'TopMenuGlobal',
  components: {
    TopMenuGlobalImageUpload,
    TopMenuGlobalMenuPage,
    TopMenuGlobalElement,
    TopMenuGlobalSection,
    TopMenuGlobalPage,
    TopMenuGlobalSettings
  },
  mixins: [Dropdown]
};
</script>
