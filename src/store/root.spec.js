import {getters, actions} from './root';
import {setGlobalOptions} from '@/helpers/globalOptions';

setGlobalOptions({
  updatePageContents: () => {}
});

describe('Store: root', () => {
  describe('actions', () => {
    it('loadPageToScene', () => {
      const pageEntityById = jest.fn();

      pageEntityById.mockReturnValueOnce({
        elements: {},
        sectionIds: []
      });

      const commit = jest.fn();
      const dispatch = jest.fn();

      actions.loadPageToScene(
        {
          getters: {
            pageEntityById
          },
          commit,
          dispatch
        },
        {
          id: 'TESTID'
        }
      );

      expect(commit.mock.calls[0][0]).toEqual('scene/resetScene');
      expect(commit.mock.calls[0][1]).toEqual({
        elements: {},
        pageId: 'TESTID',
        sectionIds: []
      });
    });
    it('savePageFromScene', () => {
      const commit = jest.fn();
      const dispatch = jest.fn();

      actions.savePageFromScene({
        state: {
          scene: {
            pageId: 'TESTID',
            sectionIds: [],
            elements: {}
          }
        },
        commit,
        dispatch
      });

      expect(commit.mock.calls[0][0]).toEqual('updatePageContents');
      expect(commit.mock.calls[0][1]).toEqual({
        elements: {},
        id: 'TESTID',
        sectionIds: []
      });
    });
  });
});
