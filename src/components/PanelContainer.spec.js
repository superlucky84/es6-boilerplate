import {shallowMount} from '@vue/test-utils';

import PanelContainer, {makeInitialPanelPosition} from './PanelContainer';

describe('PanelContainer', () => {
  it('should open tools panel', () => {
    const vw = shallowMount(PanelContainer, {
      computed: {
        openedPanels: () => ['tools'],
        selectedElements: () => []
      }
    });

    expect(vw.vm.$el.querySelectorAll('.commonMovePanel').length).toEqual(1);
  });

  it('should open more panel', () => {
    const vw = shallowMount(PanelContainer, {
      computed: {
        openedPanels: () => ['tools', 'color'],
        selectedElements: () => [
          {
            id: 'myId',
            attrs: {
              color: '#000'
            }
          }
        ]
      }
    });

    expect(vw.vm.$el.querySelectorAll('.commonMovePanel').length).toEqual(2);
  });

  describe('makeInitialPanelPosition', () => {
    it("should return tools panel's proper position", () => {
      expect(makeInitialPanelPosition('tools', {})).toEqual({
        x: 824,
        y: 100,
        zIndex: 1003
      });
    });
    it("should return other panel's proper position", () => {
      expect(
        makeInitialPanelPosition('text', {
          tools: {
            x: 500,
            y: 500
          }
        })
      ).toEqual({
        x: 330,
        y: 900,
        zIndex: 1004
      });
    });
  });
});
