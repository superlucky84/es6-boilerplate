import _ from 'lodash';
const openDropdownComponents = {};
let dropDownComponentUid = 0;

const Dropdown = {
  data() {
    return {
      dropDownComponentUid: null,
      isOpenedDropdown: false
    };
  },

  watch: {
    isOpenedDropdown(next) {
      if (next) {
        window.addEventListener('click', this.handleGlobalClickDropdown);
        this._addOpenDropdownComponents();
      } else {
        window.removeEventListener('click', this.handleGlobalClickDropdown);
        this._removeOpenDropdownComponents();
      }
    }
  },

  created() {
    dropDownComponentUid = dropDownComponentUid + 1;
    this.dropDownComponentUid = dropDownComponentUid;
  },

  mounted() {
    this.$refs.dropdownActivator.addEventListener('click', this.handleActivatorClickDropdown);
  },

  beforeDestroy() {
    this.$refs.dropdownActivator.removeEventListener('click', this.handleActivatorClickDropdown);
    window.removeEventListener('click', this.handleGlobalClickDropdown);
    this._removeOpenDropdownComponents();
  },

  methods: {
    openDropdown() {
      this.isOpenedDropdown = true;
    },

    closeDropdown() {
      this.isOpenedDropdown = false;
    },

    closeAllDropdown() {
      _.forEach(openDropdownComponents, openComponent => {
        openComponent.closeDropdown();
      });
    },

    toggleDropdown() {
      this.isOpenedDropdown = !this.isOpenedDropdown;
    },

    handleGlobalClickDropdown(ev) {
      if (this.$el === ev.target || this.$el.contains(ev.target)) {
        return;
      }
      this.closeDropdown();
    },

    handleActivatorClickDropdown() {
      this.toggleDropdown();
    },

    _addOpenDropdownComponents() {
      openDropdownComponents[this.dropDownComponentUid] = this;
    },

    _removeOpenDropdownComponents() {
      if (openDropdownComponents[this.dropDownComponentUid]) {
        delete openDropdownComponents[this.dropDownComponentUid];
      }
    }
  }
};

export default Dropdown;
