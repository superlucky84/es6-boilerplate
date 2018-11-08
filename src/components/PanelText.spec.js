import {updateAttr} from '@/store/types';
import {shallowMount} from '@vue/test-utils';

import PanelText from './PanelText';
import {defaults} from '@/helpers/defaultStates';

describe('PanelText', () => {
  let w, updateAttrFn;

  beforeEach(() => {
    const {
      attrs: {text}
    } = defaults.createText();

    updateAttrFn = jest.fn();

    w = shallowMount(PanelText, {
      propsData: {
        id: 'textid',
        attr: text
      },
      methods: {
        [updateAttr]: updateAttrFn
      }
    });
  });

  it('can change font-size', () => {
    w.findAll('#text-panel-font-size-selector option')
      .at(1)
      .setSelected();

    expect(updateAttrFn.mock.calls[0][0].newAttr.fontSize).toBe(10);
  });

  it('can change letter-spacing', () => {
    w.findAll('#text-panel-letter-spacing-selector option')
      .at(0)
      .setSelected();

    expect(updateAttrFn.mock.calls[0][0].newAttr.letterSpacing).toBe(-0.1);
  });

  it('can change color', () => {
    w.vm.color = '#fff';

    expect(updateAttrFn.mock.calls[0][0].newAttr.color).toBe('#fff');
  });

  it('can change line-height', () => {
    w.findAll('#text-panel-line-height-selector option')
      .at(3)
      .setSelected();

    expect(updateAttrFn.mock.calls[0][0].newAttr.lineHeight).toBe('2.5');
  });

  it('can change text-align', () => {
    w.findAll('#text-panel-text-align input')
      .at(2)
      .setChecked();

    expect(updateAttrFn.mock.calls[0][0].newAttr.textAlign).toBe('right');
  });

  it('can change vertical-align', () => {
    w.findAll('#text-panel-vertical-align input')
      .at(2)
      .setChecked();

    expect(updateAttrFn.mock.calls[0][0].newAttr.verticalAlign).toBe('bottom');
  });
});
