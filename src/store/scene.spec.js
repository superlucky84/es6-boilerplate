import {setSectionIds, updatePageBackground, moveSectionToUp, moveSectionToDown} from './types';
import scene from './scene';

const {mutations, actions} = scene;

describe('scene', () => {
  describe('mutations', () => {
    it('setSectionIds', () => {
      const state = {sectionIds: []};
      mutations[setSectionIds](state, [1, 2, 3]);

      expect(state.sectionIds).toEqual([1, 2, 3]);
    });
    it('updatePageBackground', () => {
      const state = {
        background: {
          type: 'color',
          value: '#fff'
        }
      };
      mutations[updatePageBackground](state, {type: 'image', value: 'some-image-id'});

      expect(state.background.type).toEqual('image');
      expect(state.background.value).toEqual('some-image-id');
    });
  });

  describe('actions', () => {
    it('setSectionIds', () => {
      const commit = jest.fn();

      actions[setSectionIds]({commit}, [1, 2, 3]);

      expect(commit).toHaveBeenCalledWith(setSectionIds, [1, 2, 3]);
    });

    it('moveSectionToUp', () => {
      const commit = jest.fn();
      const state = {sectionIds: ['a', 'b', 'c']};

      actions[moveSectionToUp](
        {
          commit,
          state
        },
        'b'
      );

      expect(commit).toHaveBeenCalledWith(setSectionIds, ['b', 'a', 'c']);
    });

    it('moveSectionToDown', () => {
      const commit = jest.fn();
      const state = {sectionIds: ['a', 'b', 'c']};

      actions[moveSectionToDown](
        {
          commit,
          state
        },
        'b'
      );

      expect(commit).toHaveBeenCalledWith(setSectionIds, ['a', 'c', 'b']);
    });
  });
});
