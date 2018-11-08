<script>
export default {
  name: 'BSns',
  functional: true,
  props: {
    attrs: {
      type: Object,
      required: true
    },
    imageList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  render(h, context) {
    const {
      props: {
        attrs: {dimension},
        imageList
      },
      listeners
    } = context;

    const style = {
      width: dimension.width + 'px',
      height: dimension.height + 'px',
      left: dimension.left + 'px',
      top: dimension.top + 'px'
    };

    return h(
      'div',
      {
        class: 'sns',
        style,
        on: {
          ...listeners,
          click(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if (listeners.click) {
              listeners.click(ev);
            }
          }
        }
      },
      imageList.map(image => {
        return h('img', {domProps: {src: image.url}});
      })
    );
  }
};
</script>
