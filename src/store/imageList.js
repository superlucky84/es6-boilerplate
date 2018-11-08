import * as api from '@/helpers/api';
import {fetchImageList, uploadImages, deleteImage} from './types';
import {uiAlert, uiConfirm} from '@/helpers/uiAlert';
import _ from 'lodash';

function convertToState(list) {
  return {
    entities: _.keyBy(list, 'id'),
    ids: list.map(image => image.id)
  };
}

export default {
  state: {
    entities: {},
    ids: []
  },

  mutations: {
    setList(state, list) {
      const {entities, ids} = convertToState(list);
      state.entities = entities;
      state.ids = ids;
    },

    addList(state, list) {
      const {entities, ids} = convertToState(list);

      state.entities = {
        ...state.entities,
        ...entities
      };
      state.ids.push(...ids);
    }
  },

  // @Todo 메시지 관련 locale 처리
  actions: {
    async [fetchImageList]({commit}) {
      const list = await api.fetchImageList();

      commit('setList', list);
    },

    async [uploadImages]({commit}, images) {
      try {
        const uploadedList = await api.uploadImages(...images);

        if (uploadedList.length === images.length) {
          uiAlert({
            headerText: '업로드 성공',
            bodyText: '이미지 업로드가 완료되었습니다.'
          });
        } else {
          uiAlert({
            headerText: '업로드 성공',
            bodyText: '5MB를 초과하는 이미지를 제외하고 업로드에 성공했습니다.'
          });
        }
        commit('addList', uploadedList);
      } catch (err) {
        uiAlert({
          headerText: '업로드 실패',
          bodyText: err.message
        });
      }
    },

    async [deleteImage]({rootState, dispatch}, id) {
      /** 이미지 reference 찾기
       *
       * - 섹션
       * - 이미지엘리먼트
       * - 슬라이드 엘리먼트 (@todo)
       * - 페이지 배경 (@todo)
       */

      const isEqual = element => _.get(element, 'attrs.image.id') === id;

      /* prettier-ignore */
      let isInUse = (
        _.some(rootState.scene.elements, isEqual) || // 1. 현재 Scene 에서 찾기
        _.some( // 2. 전체 페이지 찾기
          rootState.page.entities,
          pageEntity => _.some(pageEntity.elements, isEqual)
        )
      );

      if (isInUse) {
        uiAlert({
          headerText: '삭제 실패',
          bodyText: '선택한 이미지가 에디터에서 사용 중입니다. 에디터에서 제거 후 삭제해주세요.'
        });
      } else {
        const {confirmed} = await uiConfirm({
          headerText: '삭제 확인',
          bodyText: '선택한 이미지를 정말 삭제하시겠습니까?'
        });

        if (confirmed) {
          await api.deleteImage(id);

          // @see
          //  - 성능상 문제가 있다면 fetchAction을 dispatch하지 않고, deleteMutation을 만들어 직접 처리.
          //  - 성능상 문제가 없다면 그냥 바로 fetch를 하는게 편함.
          dispatch(fetchImageList);
        }
      }
    }
  }
};
