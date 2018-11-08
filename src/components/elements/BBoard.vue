<script>
export default {
  functional: true,
  props: {
    boardName: {
      type: String,
      required: true
    }
  },

  render(h, context) {
    const {boardName} = context.props;
    const listeners = context.listeners;

    return h(
      'div',
      {
        class: ['noticeBoard'],
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
      [
        h(
          'div',
          {
            class: ['txt-align', 'vtl_m']
          },
          [
            h('p', {}, [
              h('span', {
                class: ['item-cover', 'ti-boarname'],
                domProps: {
                  innerText: boardName
                }
              })
            ])
          ]
        )
      ]
    );
  }
};
</script>
