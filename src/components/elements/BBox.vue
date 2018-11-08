<script>
export default {
  name: 'BBox',
  functional: true,
  props: {
    attrs: {
      type: Object,
      required: true
    },
    select: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  render(h, context) {
    const {
      props: {
        attrs: {color, dimension},
        select
      },
      listeners
    } = context;

    const style = {
      backgroundColor: color,
      width: dimension.width + 'px',
      height: dimension.height + 'px',
      left: dimension.left + 'px',
      top: dimension.top + 'px'
    };

    return h('div', {
      class: 'ti-box',
      style,
      on: {
        ...listeners,
        click(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          select(ev);
        }
      }
    });
  }
};
</script>
