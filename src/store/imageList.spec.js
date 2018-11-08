import * as uiAlertModule from '@/helpers/uiAlert';
import imageList from './imageList';
import {setGlobalOptions} from '@/helpers/globalOptions';
import {deleteImage, fetchImageList, uploadImages} from '@/store/types';
import * as api from '@/helpers/api';

describe('store - images', () => {
  let commit, dispatch;

  beforeAll(() => {
    setGlobalOptions({
      uploadImages: (_, cb) => cb(_),
      deleteImage: (_, cb) => cb(_)
    });
  });

  beforeEach(() => {
    commit = jest.fn();
    dispatch = jest.fn();
    uiAlertModule.uiAlert = jest.fn();
    uiAlertModule.uiConfirm = jest.fn();
  });

  describe('Mutation', () => {
    let state;

    beforeEach(() => {
      state = {
        entities: {
          a: {id: 'a'}
        },
        ids: ['a']
      };
    });

    it('setList: 전체 entities와 ids를 변경한다.', () => {
      const list = [{id: 'b'}, {id: 'c'}];
      imageList.mutations.setList(state, list);

      expect(state).toEqual({
        entities: {
          b: {id: 'b'},
          c: {id: 'c'}
        },
        ids: ['b', 'c']
      });
    });

    it('addList: entities와 ids를 추가한다.', () => {
      const list = [{id: 'b'}, {id: 'c'}];
      imageList.mutations.addList(state, list);

      expect(state).toEqual({
        entities: {
          a: {id: 'a'},
          b: {id: 'b'},
          c: {id: 'c'}
        },
        ids: ['a', 'b', 'c']
      });
    });
  });

  describe(`Action: ${uploadImages}: commit`, () => {
    it('5MB 이하 파일들은 업로드 완료 후 이미지 리스트에 모두 추가', async () => {
      const mockFiles = [{size: 3 * 1024 * 1024}, {size: 3 * 1024 * 1024}];

      await imageList.actions[uploadImages]({commit}, mockFiles);

      expect(commit).toHaveBeenCalledWith('addList', [{size: 3 * 1024 * 1024}, {size: 3 * 1024 * 1024}]);
    });

    it('5MB가 넘는 파일만 있으면 업로드 없음, 이미지 리스트 추가 없음', async () => {
      const mockFiles = [{size: 6 * 1024 * 1024}, {size: 6 * 1024 * 1024}];

      await imageList.actions[uploadImages]({commit}, mockFiles);

      expect(commit).not.toHaveBeenCalled();
    });

    it('5MB가 넘는 파일과 아닌 파일이 같이 있는 경우, 5MB 이하 파일들만 업로드 후 이미지 리스트 추가', async () => {
      const mockFiles = [{size: 3 * 1024 * 1024}, {size: 6 * 1024 * 1024}];

      await imageList.actions[uploadImages]({commit}, mockFiles);

      expect(commit).toHaveBeenCalledWith('addList', [{size: 3 * 1024 * 1024}]);
    });
  });

  describe(`Action: ${uploadImages}: Alert 메시지`, () => {
    it('5MB 이하 파일들의 업로드 완료 메시지', async () => {
      const mockFiles = [{size: 3 * 1024 * 1024}, {size: 3 * 1024 * 1024}];

      await imageList.actions[uploadImages]({commit}, mockFiles);

      // @Todo 메시지 관련 locale 처리
      expect(uiAlertModule.uiAlert).toHaveBeenCalledWith({
        headerText: '업로드 성공',
        bodyText: '이미지 업로드가 완료되었습니다.'
      });
    });

    it('5MB가 넘는 파일만 있으면 에러 발생', async () => {
      const mockFiles = [{size: 6 * 1024 * 1024}, {size: 6 * 1024 * 1024}];

      await imageList.actions[uploadImages]({commit}, mockFiles);

      // @Todo 메시지 관련 locale 처리
      expect(uiAlertModule.uiAlert).toHaveBeenCalledWith({
        headerText: '업로드 실패',
        bodyText: '5MB를 초과하는 이미지는 업로드할 수 없습니다.'
      });
    });

    it('5MB가 넘는 파일과 아닌 파일이 같이 있는 경우 업로드 완료 메시지', async () => {
      const mockFiles = [{size: 3 * 1024 * 1024}, {size: 6 * 1024 * 1024}];

      await imageList.actions[uploadImages]({commit}, mockFiles);

      // @Todo 메시지 관련 locale 처리
      expect(uiAlertModule.uiAlert).toHaveBeenCalledWith({
        headerText: '업로드 성공',
        bodyText: '5MB를 초과하는 이미지를 제외하고 업로드에 성공했습니다.'
      });
    });
  });

  describe(`Action: ${deleteImage}`, () => {
    let rootState;

    beforeEach(() => {
      uiAlertModule.uiConfirm.mockImplementation(() => Promise.resolve({confirmed: true}));
      api.deleteImage = jest.fn();

      rootState = {
        scene: {
          elements: {}
        },
        page: {
          entities: {
            header: {
              elements: {}
            },
            index: {
              elements: {}
            }
          }
        }
      };
    });

    describe('dispatch', () => {
      it('삭제하려는 이미지가 사용 중인 경우 다른 작업을 하지 않는다.', async () => {
        const imageId = 'id';

        rootState.scene.elements.elementId = {
          attrs: {
            image: {
              id: imageId
            }
          }
        };
        await imageList.actions[deleteImage](
          {
            rootState,
            dispatch
          },
          imageId
        );

        expect(dispatch).not.toHaveBeenCalled();
        expect(api.deleteImage).not.toHaveBeenCalled();
      });

      it('삭제하려는 이미지가 사용 중이지 않으면 삭제한다.', async () => {
        const imageId = 'id';
        await imageList.actions[deleteImage](
          {
            rootState,
            dispatch
          },
          imageId
        );

        expect(dispatch).toHaveBeenCalledWith(fetchImageList);
        expect(api.deleteImage).toHaveBeenCalledWith(imageId);
      });

      it('삭제시 Confirm 취소의 경우 삭제 작업을 진행하지 않는다.', async () => {
        const imageId = 'id';

        uiAlertModule.uiConfirm.mockImplementation(() => Promise.resolve({confirmed: false})); // eslint-disable-line max-nested-callbacks
        await imageList.actions[deleteImage](
          {
            rootState,
            dispatch
          },
          imageId
        );

        expect(dispatch).not.toHaveBeenCalled();
        expect(api.deleteImage).not.toHaveBeenCalled();
      });
    });

    describe('uiAlert & uiConfirm message', () => {
      it('삭제하려는 이미지가 사용 중인 경우 Alert 메시지', async () => {
        const imageId = 'id';

        rootState.scene.elements.elementId = {
          attrs: {
            image: {
              id: imageId
            }
          }
        };
        await imageList.actions[deleteImage](
          {
            rootState,
            dispatch
          },
          imageId
        );

        expect(uiAlertModule.uiAlert).toHaveBeenCalledWith({
          headerText: '삭제 실패',
          bodyText: '선택한 이미지가 에디터에서 사용 중입니다. 에디터에서 제거 후 삭제해주세요.'
        });
      });

      it('삭제하려는 이미지가 사용 중이지 않은 경우 Confirm 메시지', async () => {
        const imageId = 'id';
        await imageList.actions[deleteImage](
          {
            rootState,
            dispatch
          },
          imageId
        );

        expect(uiAlertModule.uiConfirm).toHaveBeenCalledWith({
          headerText: '삭제 확인',
          bodyText: '선택한 이미지를 정말 삭제하시겠습니까?'
        });
      });
    });
  });
});
