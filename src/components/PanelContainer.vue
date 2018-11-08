<script>
import Vue from 'vue';
import {mapState, mapGetters} from 'vuex';

import {selectedElements} from '@/store/types';
import Panel from '@/components/Panel';
import PanelColor from '@/components/PanelColor';
import PanelTools from '@/components/PanelTools';
import PanelImage from '@/components/PanelImage';
import PanelText from '@/components/PanelText';
import PanelLink from '@/components/PanelLink';
import PanelProduct from '@/components/PanelProduct';
import PanelVideo from '@/components/PanelVideo';
import PanelColumn from '@/components/PanelColumn';
import PanelBoard from '@/components/PanelBoard';

const PANEL_Z_INDEX_START_VALUE = 1000;
let frontPanelZIndex = PANEL_Z_INDEX_START_VALUE;

export default {
  components: {
    Panel,
    PanelTools,
    PanelColor,
    PanelImage,
    PanelText,
    PanelLink,
    PanelProduct,
    PanelVideo,
    PanelColumn,
    PanelBoard
  },

  data() {
    return {
      positions: {}
    };
  },

  computed: {
    ...mapState('tools', ['openedPanels']),
    ...mapGetters('scene', [selectedElements]),
    lastSelectedElement() {
      return this.selectedElements[this.selectedElements.length - 1];
    }
  },

  methods: {
    isOpened(type) {
      return this.openedPanels.includes(type);
    }
  },

  render(h) {
    if (this.openedPanels.length === 1) {
      resetFrontZIndex();
    }

    return h(
      'div',
      this.openedPanels
        .filter(type => {
          return type === 'tools' || (this.lastSelectedElement && this.lastSelectedElement.attrs.hasOwnProperty(type));
        })
        .map(type => {
          if (!this.positions[type]) {
            Vue.set(this.positions, type, makeInitialPanelPosition(type, this.positions));
          }

          return h(Panel, makePanelNodeData(type, this.positions), [
            h(getPanelNameOfType(type), {
              props: makePanelContentsProp(type, this.lastSelectedElement)
            })
          ]);
        })
    );
  }
};

function getPanelNameOfType(type) {
  return `Panel${type[0].toLocaleUpperCase()}${type.slice(1)}`;
}

function makePanelNodeData(type, positions) {
  return {
    key: type,
    class: {
      imagePanel: type === 'image',
      connectPanel: type === 'link'
    },
    props: {
      type,
      initPosition: positions[type],
      zIndex: positions[type].zIndex
    },
    on: {
      positionChange: position => {
        positions[type].x = position.x;
        positions[type].y = position.y;
      },
      panelControl: () => {
        positions[type].zIndex = getFrontZIndex();
      }
    }
  };
}

function makePanelContentsProp(type, el) {
  if (type === 'tools') {
    return {};
  }

  const props = {
    id: el.id,
    attr: el.attrs[type],
    elementType: el.type
  };

  switch (type.toLowerCase()) {
    case 'image':
      props.enableFixedRatioOption = el.type === 'image' || el.type === 'slider';
      props.enableFixedBackgroundOption = el.type === 'section';
      props.isSlider = el.type === 'slider';
      break;
    case 'link':
      if (el.type === 'slider') {
        props.count = el.attrs.image.ids.length;
        props.isMultiple = true;
      }
      break;
    default:
      break;
  }

  return props;
}

export function makeInitialPanelPosition(type, positions) {
  let position;

  if (type === 'tools') {
    position = {
      x: window.innerWidth - 200,
      y: 100
    };
  } else {
    position = {
      x: positions.tools.x - 170,
      y: positions.tools.y + 400
    };
  }

  position.zIndex = getFrontZIndex();

  return position;
}

function getFrontZIndex() {
  frontPanelZIndex += 1;

  return frontPanelZIndex;
}

function resetFrontZIndex() {
  frontPanelZIndex = PANEL_Z_INDEX_START_VALUE;
}
</script>
