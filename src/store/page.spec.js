import _ from 'lodash';

import {updateAllPageBackground} from './types';

import page from './page';

/* eslint-disable max-nested-callbacks */
describe('store/page', () => {
  const {mutations, getters} = page;

  describe('mutations', () => {
    describe('addPage', () => {
      const state = _.cloneDeep(page.state);
      it('"isLinked=false" should add unlinked page', () => {
        const id = 'id-to-add-page';

        mutations.addPage(state, {
          id,
          title: '페이지제목',
          url: 'asdf'
        });

        expect(state.unlinked.includes(id)).toBe(true);

        expect(state.entities[id].title).toEqual('페이지제목');
        expect(state.entities[id].url).toEqual('asdf');
        expect(state.entities[id].sectionIds).toEqual([]);
        expect(state.entities[id].elements).toEqual({});
      });

      it('"isLinked=true" should add linked page', () => {
        const id = 'id-to-add-page2';

        mutations.addPage(state, {
          id,
          title: '페이지제목 - 2',
          url: 'asdf - 2',
          isLinked: true
        });

        expect(state.linked.includes(id)).toBe(true);
        expect(state.entities[id].title).toEqual('페이지제목 - 2');
        expect(state.entities[id].url).toEqual('asdf - 2');
      });
    });

    describe('modifyPage', () => {
      const state = _.cloneDeep(page.state);
      const id = 'test-id-to-modify';

      beforeAll(() => {
        mutations.addPage(state, {
          id,
          title: 'title',
          url: 'url'
        });
      });

      it('should set title/link', () => {
        mutations.modifyPage(state, {
          id,
          title: 'newTitle',
          url: 'newUrl'
        });

        expect(state.entities[id].title).toEqual('newTitle');
        expect(state.entities[id].url).toEqual('newUrl');
      });

      it('should change unlinked <-> linked', () => {
        mutations.modifyPage(state, {
          id,
          isLinked: true
        });

        expect(state.linked.includes(id)).toBe(true);
        expect(state.unlinked.includes(id)).toBe(false);

        mutations.modifyPage(state, {
          id,
          isLinked: false
        });

        expect(state.linked.includes(id)).toBe(false);
        expect(state.unlinked.includes(id)).toBe(true);
      });
    });

    describe('deletePage', () => {
      const state = _.cloneDeep(page.state);
      it('should delete page by id', () => {
        const id = 'id-to-delete-page';
        mutations.addPage(state, {
          id,
          title: 'title',
          url: 'url'
        });
        expect(state.unlinked.includes(id)).toBe(true); // 삭제 전 페이지 존재 확인

        mutations.deletePage(state, id);

        expect(state.unlinked.includes(id)).toBe(false);
        expect(state.entities[id]).toBeNull();
      });
    });

    describe('switchLinked', () => {
      const state = _.cloneDeep(page.state);
      it('should switch unlinked -> linked by id', () => {
        const id = 'id-to-switch-linked';
        mutations.addPage(state, {
          id,
          title: 'title',
          url: 'url'
        });

        mutations.switchLinked(state, id);

        expect(state.linked.includes(id)).toBe(true);
        expect(state.unlinked.includes(id)).toBe(false);
      });

      it('should switch linked -> unlinked by id', () => {
        const id = 'id-to-switch-linked2';
        mutations.addPage(state, {
          id,
          title: 'title',
          url: 'url',
          isLinked: true
        });

        mutations.switchLinked(state, id);

        expect(state.linked.includes(id)).toBe(false);
        expect(state.unlinked.includes(id)).toBe(true);
      });
    });

    describe('updateAllPageBackground', () => {
      it('should update all pages background', () => {
        const state = _.cloneDeep(page.state);
        const expected = {type: 'image', value: 'some-image-id'};
        mutations[updateAllPageBackground](state, {type: 'image', value: 'some-image-id'});

        expect(state.entities.index.background).toEqual(expected);
        expect(state.entities.header.background).toEqual(expected);
        expect(state.entities.footer.background).toEqual(expected);
      });
    });
  });

  describe('updatePageContents', () => {
    const state = _.cloneDeep(page.state);
    it('should update page contents', () => {
      const id = 'id-to-update-page-1';

      mutations.addPage(state, {
        id,
        title: 'test'
      });

      mutations.updatePageContents(state, {
        id,
        sectionIds: ['e1', 'e2'],
        elements: {
          e1: {},
          e2: {}
        }
      });

      expect(state.entities[id].sectionIds).toEqual(['e1', 'e2']);
      expect(state.entities[id].elements).toEqual({
        e1: {},
        e2: {}
      });
    });
  });

  describe('getters', () => {
    describe('isLinkedPage', () => {
      const state = _.cloneDeep(page.state);
      it('should return true if linked', () => {
        const id = 'id-to-linked-page';
        mutations.addPage(state, {
          id,
          title: '페이지제목',
          url: 'asdf',
          isLinked: true
        });

        expect(getters.isLinkedPage(state)(id)).toBe(true);
      });

      it('should return false if unlinked', () => {
        const id = 'id-to-unlinked-page';
        mutations.addPage(state, {
          id,
          title: '페이지제목',
          url: 'asdf'
        });

        expect(getters.isLinkedPage(state)(id)).toBe(false);
      });
    });
  });
});
