<script>
export default {
  functional: true,
  props: {
    attrs: {
      type: Object,
      required: true
    },
    contents: {
      type: String,
      required: false,
      default: ''
    }
  },
  render(h, context) {
    const {props, listeners} = context;

    const {
      attrs: {dimension, text}
    } = props;

    return h('p', {
      class: ['text', 'itemCover'],
      style: {
        display: 'table-cell',
        wordBreak: 'break-all',
        whiteSpace: 'normal',
        width: dimension.width + 'px',
        height: dimension.height + 'px',
        left: dimension.left + 'px',
        top: dimension.top + 'px',
        fontSize: text.fontSize + 'px',
        letterSpacing: text.letterSpacing + 'em',
        lineHeight: text.lineHeight,
        textAlign: text.textAlign,
        verticalAlign: text.verticalAlign,
        color: text.color
      },
      on: {
        ...listeners,
        click(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if (listeners.click) {
            listeners.click(ev);
          }
        }
      },
      domProps: {
        innerText: props.contents
      }
    });
  }
};
</script>
