import {
  addElement,
  updateElement,
  removeElement,
  changeParent,
  addNewText,
  modifyText,
  addNewImage,
  modifyImage
} from './types';
import elements from './scene.elements';

const {mutations, actions} = elements;

describe('scene.elements', () => {
  describe('mutations', () => {
    it('addElement', () => {
      const parentId = 'parentId';
      const state = {
        [parentId]: {
          children: []
        }
      };
      const element = {
        attrs: {
          dimension: {width: 0, height: 0, top: 0, left: 0, zIndex: 0}
        }
      };

      mutations[addElement](state, {
        parentId,
        element
      });

      expect(state).toEqual({
        [parentId]: {
          children: [element.id]
        },
        [element.id]: element
      });
    });

    it('updateElement (deep)', () => {
      const id = 'elementId';
      const state = {
        [id]: {foo: {bar: true}}
      };
      const updating = {foo: {baz: false}};

      mutations[updateElement](state, {
        id,
        updating
      });

      expect(state).toEqual({
        [id]: {
          foo: {
            bar: true,
            baz: false
          }
        }
      });
    });

    it('removeElement (element entity should be null)', () => {
      const id = 'elementId';
      const parentId = 'pId';
      const state = {
        [parentId]: {
          children: [id]
        },
        [id]: {foo: {bar: true}, parentId}
      };

      mutations[removeElement](state, {
        parentId,
        id
      });

      expect(state).toEqual({
        [parentId]: {
          children: []
        }
      });
    });

    it('changeParent', () => {
      const id = 'elementId';
      const originalParentId = 'originalPId';
      const newParentId = 'newPId';
      const state = {
        [originalParentId]: {
          children: [id]
        },
        [newParentId]: {
          children: []
        },
        [id]: {foo: {bar: true}, parentId: originalParentId}
      };

      mutations[changeParent](state, {
        originalParentId,
        newParentId,
        id
      });

      expect(state).toEqual({
        [originalParentId]: {
          children: []
        },
        [newParentId]: {
          children: [id]
        },
        [id]: {foo: {bar: true}, parentId: newParentId}
      });
    });
  });

  describe('actions', () => {
    it('addNewText', () => {
      const parentId = 'parentId';
      const commit = jest.fn();

      actions[addNewText](
        {commit},
        {
          parentId,
          text: 'hello world'
        }
      );

      expect(commit).toHaveBeenCalledWith(addElement, {
        parentId,
        element: expect.objectContaining({
          type: 'text',
          contents: '새 텍스트',
          attrs: expect.any(Object)
        })
      });
    });

    it('modifyText', () => {
      const id = 'elementId';
      const commit = jest.fn();

      actions[modifyText](
        {commit},
        {
          id,
          contents: 'hello world - (modify)'
        }
      );
      expect(commit).toHaveBeenCalledWith(updateElement, {
        id,
        updating: {contents: 'hello world - (modify)'}
      });
    });

    it('addNewImage', () => {
      const parentId = 'parentId';
      const commit = jest.fn();

      actions[addNewImage](
        {commit},
        {
          parentId,
          id: 'imageId'
        }
      );
      expect(commit).toHaveBeenCalledWith(addElement, {
        parentId,
        element: expect.objectContaining({
          type: 'image',
          attrs: expect.objectContaining({
            image: {
              id: 'imageId'
            }
          })
        })
      });
    });

    it('modifyImage', () => {
      const id = 'elementId';
      const commit = jest.fn();

      actions[modifyImage](
        {commit},
        {
          id,
          imageAttrs: {id: 'newImageId'}
        }
      );
      expect(commit).toHaveBeenCalledWith(updateElement, {
        id,
        updating: {attrs: {image: {id: 'newImageId'}}}
      });
    });
  });
});
