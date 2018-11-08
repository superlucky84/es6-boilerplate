<script>
import _ from 'lodash';
import HeaderMenus from '@/components/HeaderMenus';
import EditingText from '@/components/EditingText';
import ProductList from '@/components/ProductList';
import ProductSlide from '@/components/ProductSlide';
import BHeaderIcons from '@/components/elements/BHeaderIcons';
import BFooterShopinfo from '@/components/elements/BFooterShopinfo';
import BFooterPolicy from '@/components/elements/BFooterPolicy';
import BImage from '@/components/elements/BImage';
import BText from '@/components/elements/BText';
import BBox from '@/components/elements/BBox';
import BSlider from '@/components/elements/BSlider';
import BButton from '@/components/elements/BButton';
import BMap from '@/components/elements/BMap';
import Sns from '@/components/Sns';
import BVideo from '@/components/elements/BVideo';
import Board from '@/components/Board';

function getElementComponent(type, isEmbed) {
  switch (type) {
    case 'board':
      return Board;
    case 'map':
      return BMap;
    case 'video':
      return BVideo;
    case 'product':
      return ProductList;
    case 'productSlide':
      return ProductSlide;
    case 'headerIcons':
      return BHeaderIcons;
    case 'headerMenus':
      return HeaderMenus;
    case 'footerShopinfo':
      return BFooterShopinfo;
    case 'footerPolicy':
      return BFooterPolicy;
    case 'text':
      return isEmbed ? BText : EditingText;
    case 'image':
      return BImage;
    case 'box':
      return BBox;
    case 'slider':
      return BSlider;
    case 'button':
      return BButton;
    case 'sns':
      return Sns;
    default:
      return null;
  }
}

function wrap(h, {dimension, selected, listeners, fullColumn}, children) {
  const {width, height, left, top, zIndex} = dimension;

  return h(
    'div',
    {
      staticClass: '__element_wrapper',
      class: {
        ['__zIndex_top']: selected
      },
      // prettier-ignore
      style: selected ? {
        width: `${width}px`,
        height: `${height}px`
      } : {
        width: fullColumn ? `100%` : `${width}px`,
        height: fullColumn ? `100%` : `${height}px`,
        left: fullColumn ? `0px` : `${left}px`,
        top: fullColumn ? `0px` : `${top}px`,
        zIndex
      },
      on: listeners
    },
    children
  );
}

export default {
  props: {
    child: {
      type: Object,
      required: true
    },

    selected: {
      type: Boolean,
      default: false
    },

    parentId: {
      type: String,
      default: null
    },

    select: {
      type: Function,
      default: _.noop
    }
  },

  render(h) {
    const {
      child: {
        type,
        attrs: {dimension},
        draggable,
        fullColumn
      },
      select,
      selected,
      parentId,
      $listeners: listeners
    } = this;

    const childComponent = getElementComponent(type, select === _.noop && !selected);

    if (childComponent) {
      return wrap(h, {dimension, selected, listeners, fullColumn}, [
        h(childComponent, {
          props: {
            ...this.child,
            select,
            selected
          },
          parentId,
          draggable,
          // @see v-dom 업데이트에서 인스턴스 재사용에 문제가 발생 => key 속성 사용하여 항상 새로 렌더링 하도록 처리
          key: this.child.id
        }),
        this.$slots['default']
      ]);
    }

    return h('div', `Unknown element ${type}`);
  }
};
</script>
