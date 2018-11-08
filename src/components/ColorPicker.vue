<template>
<div ref="color-picker-container" @click.stop=""/>
</template>

<script>
import colorPicker from 'tui-color-picker';

export default {
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      default: '#000'
    }
  },
  watch: {
    value(color) {
      if (this.colorPicker.getColor() !== color) {
        this.colorPicker.setColor(color || '#000');
      }
    }
  },
  mounted() {
    this.colorPicker = colorPicker.create({
      container: this.$refs['color-picker-container'],
      color: this.value,
      preset: [
        '#000000',
        '#2a2a2a',
        '#545454',
        '#7e7e7e',
        '#a8a8a8',
        '#d2d2d2',
        '#ffffff',
        '',
        '#ff4040',
        '#ff6518',
        '#ffbb3b',
        '#03bd9e',
        '#00a9ff',
        '#515ce6',
        '#9e5fff',
        '#ff5583'
      ]
    });

    this.colorPicker.on('selectColor', ({color}) => this.$emit('input', color));
  },
  destroyed() {
    this.colorPicker.destroy();
  }
};
</script>
