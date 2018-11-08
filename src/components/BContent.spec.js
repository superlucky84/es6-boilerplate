import {shallowMount} from '@vue/test-utils';
import BContent from './BContent';

import {defaults} from '@/helpers/defaultStates';

describe('BContent', () => {
  it('should render element suitable for text', () => {
    const wrapper = shallowMount(BContent, {
      propsData: {
        child: {
          id: 'textElementId',
          ...defaults.createText()
        },
        parentId: 'parentid',
        selected: false
      }
    });

    expect(wrapper.find({name: 'BText'})).toBeTruthy();
  });

  it('should render element suitable for image', () => {
    const wrapper = shallowMount(BContent, {
      propsData: {
        child: {
          id: 'imgElementId',
          ...defaults.createImage()
        },
        parentId: 'parentid',
        selected: false
      }
    });

    expect(wrapper.find({name: 'BImage'})).toBeTruthy();
  });

  it('should render div-text if unknown type', () => {
    const wrapper = shallowMount(BContent, {
      propsData: {
        child: {
          id: 'unknown',
          type: '????',
          attrs: {}
        },
        parentId: 'parentid',
        selected: false
      }
    });

    expect(wrapper.find('div').text()).toBe('Unknown element ????');
  });
});
