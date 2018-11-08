import {createLocalVue, shallowMount} from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

import TopMenuCurrentPage from './TopMenuCurrentPage';

describe('TopMenuCurrentPage', () => {
  beforeEach(() => {});

  describe('computed.pageList', () => {
    it('pageList should map page.entities for menu', () => {
      const vw = shallowMount(TopMenuCurrentPage, {
        store: {
          state: {
            page: {
              entities: {
                test1: {
                  title: 'TEST1'
                },
                test2: {
                  title: 'TEST2'
                }
              }
            },
            scene: {}
          }
        },
        localVue
      });

      expect(vw.vm.pageList).toEqual([
        {
          id: 'test1',
          title: 'TEST1'
        },
        {
          id: 'test2',
          title: 'TEST2'
        }
      ]);
    });
  });
  describe('computed.currentPageTitle', () => {
    it('should have title string of current editing page', () => {
      const vw = shallowMount(TopMenuCurrentPage, {
        store: {
          state: {
            page: {
              entities: {
                test1: {
                  title: 'TEST1'
                }
              }
            },
            scene: {
              pageId: 'test1'
            }
          }
        },
        localVue
      });

      expect(vw.vm.currentPageTitle).toEqual('TEST1');
    });
  });
});
