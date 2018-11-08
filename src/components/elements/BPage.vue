<script>
import {getGlobalOptions} from '@/helpers/globalOptions';

export default {
  name: 'BPage',
  functional: true,
  props: {
    background: {
      type: Object,
      required: true
    },
    fontFamilyStyle: {
      type: String,
      required: true
    }
  },
  render(h, context) {
    const {
      props: {background, fontFamilyStyle},
      children
    } = context;

    let style = {};

    if (background.type === 'color') {
      style.backgroundColor = background.value;
    } else {
      let {getImageUrl} = getGlobalOptions('getImageUrl');
      style.background = `no-repeat url("${getImageUrl(background.value)}")`;
    }

    if (fontFamilyStyle) {
      style.fontFamily = fontFamilyStyle;
    }

    return h(
      'div',
      {
        class: 'page',
        style
      },
      children
    );
  }
};
</script>
<style>
.page {
  min-height: 100px;
}
</style>
