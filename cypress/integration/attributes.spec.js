import {updateAttrIfNeed} from '../../src/store/types';
import {mutations} from '../../src/store/attributes';

describe('attributes', () => {
  describe('mutations', () => {
    it('upateAttrIfNeed should make new attribute of type', () => {
      const state = {
        elements: {
          testId: {
            attrs: {
              test: {}
            }
          }
        }
      };

      mutations[updateAttrIfNeed](state, {
        id: 'testId',
        type: 'test',
        newAttr: {
          value: 'new'
        }
      });

      expect(state.elements.testId.attrs.test.value).to.equal('new');
    });

    it('upateAttrIfNeed should update with new attribute', () => {
      const state = {
        elements: {
          testId: {
            attrs: {
              test: {
                value: 'old'
              }
            }
          }
        }
      };
      mutations[updateAttrIfNeed](state, {
        id: 'testId',
        type: 'test',
        newAttr: {
          value: 'new'
        }
      });

      expect(state.elements.testId.attrs.test.value).to.equal('new');
    });
    it('upateAttrIfNeed should update with primitive value', () => {
      const state = {
        elements: {
          testId: {
            attrs: {
              test: 'old'
            }
          }
        }
      };

      mutations[updateAttrIfNeed](state, {
        id: 'testId',
        type: 'test',
        newAttr: 'new'
      });

      expect(state.elements.testId.attrs.test).to.equal('new');
    });
  });
});
