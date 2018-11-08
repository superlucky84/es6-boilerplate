import Vue from 'vue';
import Panel from './Panel';

describe('Panel', () => {
  const Cmp = Vue.extend(Panel);

  let vm;

  beforeEach(() => {
    vm = new Cmp({
      propsData: {
        type: 'text',
        initPosition: {
          x: 300,
          y: 300,
        },
        zIndex: 3
      }
    });
  });

  describe('data', () => {
    it('position should equal initPosition prop', () => {
      expect(vm.position.x).toEqual(300);
      expect(vm.position.y).toEqual(300);
    });
  });

  describe('drag&drop', () => {
    it('dragStart should not do anything when isAllowDrag is false', () => {
      const mfn = jest.fn();
      vm.dragStart({preventDefault: mfn});
      expect(mfn).toHaveBeenCalled();
    });
  });

  describe('computed', () => {
    it('style should return top, left', () => {
      expect(vm.style.top).toEqual('300px');
      expect(vm.style.left).toEqual('300px');
    });
  });
});
