import {shallowMount} from '@vue/test-utils';

import ColorPicker from './ColorPicker';
import tuiColorPicker from 'tui-color-picker';

describe('ColorPicker', () => {
  let wp;

  it('should have colorpicker instance', () => {
    wp = shallowMount(ColorPicker);
    expect(wp.vm.colorPicker instanceof tuiColorPicker.create).toBe(true);
  });

  it('should have init color by prop', () => {
    wp = shallowMount(ColorPicker);

    wp.setProps({
      value: '#f00'
    });

    expect(wp.vm.colorPicker.getColor()).toBe('#f00');
  });

  it('should change color by react prop', () => {
    wp = shallowMount(ColorPicker);

    wp.setProps({
      value: '#f00'
    });

    wp.setProps({
      value: '#fff'
    });
    expect(wp.vm.colorPicker.getColor()).toBe('#fff');
  });
});
