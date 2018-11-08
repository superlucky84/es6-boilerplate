import {shallowMount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';
import TopMenuGlobalElementBasic from './TopMenuGlobalElementBasic';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TopMenuGlobalElementBasic', () => {
  let wrapper;

  describe('엘리먼트 focus', () => {
    beforeEach(() => {
      wrapper = shallowMount(TopMenuGlobalElementBasic, {
        computed: {
          isHeaderMenuAvailable: () => false,
          isHeaderIconsAvailable: () => false,
          isShopInfoAvailable: () => false,
          isPolicyAvailable: () => false,
          isPossibleAddElement: () => true,
          hasSection: () => true
        }
      });
    });

    it('엘리먼트를 클릭하면 해당 엘리먼트를 선택(focus) 한다.', () => {
      const liWrapper = wrapper.find('li');

      expect(liWrapper.is('.basic_li.basic_click')).toBe(false);

      liWrapper.trigger('click');
      expect(liWrapper.is('.basic_li.basic_click')).toBe(true);
    });

    it('처음 선택된(focus) 엘리먼트는 0개, 클릭 이후는 항상 1개다.', () => {
      const liWrappers = wrapper.findAll('li');
      expect(wrapper.findAll('li.basic_click').length).toBe(0);

      liWrappers.at(0).trigger('click');
      expect(wrapper.findAll('li.basic_click').length).toBe(1);

      liWrappers.at(1).trigger('click');
      expect(wrapper.findAll('li.basic_click').length).toBe(1);
    });
  });

  it('"요소 추가" 버튼을 클릭하면 addElement를 수행한다.', () => {
    wrapper = shallowMount(TopMenuGlobalElementBasic, {
      computed: {
        isHeaderMenuAvailable: () => false,
        isHeaderIconsAvailable: () => false,
        isShopInfoAvailable: () => false,
        isPolicyAvailable: () => false,
        isPossibleAddElement: () => true,
        hasSection: () => true
      }
    });

    const mockFn = jest.fn();
    wrapper.setMethods({addElement: mockFn});
    wrapper.setData({focusedType: 'text'});
    wrapper.find({name: 'BBlueButton'}).vm.$emit('click');

    expect(mockFn).toHaveBeenCalled();
  });

  it('"addElement"는 focusedType에 맞는 action을 dispatch 한다.', () => {
    const dispatch = jest.fn();

    wrapper = shallowMount(TopMenuGlobalElementBasic, {
      mocks: {$store: {dispatch}},
      data: () => ({focusedType: 'text'}),
      computed: {
        currentAddingTargetId: () => 'columnId',
        isHeaderMenuAvailable: () => false,
        isHeaderIconsAvailable: () => false,
        isShopInfoAvailable: () => false,
        isPolicyAvailable: () => false,
        isPossibleAddElement: () => true,
        hasSection: () => true
      }
    });
    wrapper.vm.addElement();
    expect(dispatch.mock.calls[0]).toEqual(['scene/addNewText', {parentId: 'columnId'}]);

    wrapper.setData({focusedType: 'image'});
    wrapper.vm.addElement();
    expect(dispatch.mock.calls[1]).toEqual(['scene/addNewImage', {parentId: 'columnId'}]);
  });

  it('scene pageId가 헤더일때 헤더 관련 요소가 보인다.', () => {

    wrapper = shallowMount(TopMenuGlobalElementBasic, {
      store: {
        state: {scene: {pageId: 'header'}, page: {linked: ['page1', 'page2']}}
      },
      localVue
    });

    expect(wrapper.findAll('div.basic_list_con.basic_shopmenu').length).toBe(1);
    expect(wrapper.findAll('div.basic_list_con.basic_menulist').length).toBe(1);
  });

  it('scene pageId가 헤더가 아니면 헤더 관련 요소가 보이지 않는다.', () => {

    wrapper = shallowMount(TopMenuGlobalElementBasic, {
      store: {
        state: {scene: {pageId: 'footer'}, page: {linked: ['page1', 'page2']}}
      },
      localVue
    });

    expect(wrapper.findAll('div.basic_list_con.basic_shopmenu').length).toBe(0);
    expect(wrapper.findAll('div.basic_list_con.basic_menulist').length).toBe(0);
  });

  it('scene pageId가 푸터일때 푸터 관련 요소가 보인다.', () => {

    wrapper = shallowMount(TopMenuGlobalElementBasic, {
      store: {
        state: {scene: {pageId: 'footer'}, page: {linked: ['page1', 'page2']}}
      },
      localVue
    });

    expect(wrapper.findAll('div.basic_list_con.basic_shopinfo').length).toBe(1);
    expect(wrapper.findAll('div.basic_list_con.basic_policy').length).toBe(1);
  });

  it('scene pageId가 푸터가 아니면 푸터 관련 요소가 보이지 않는다.', () => {

    wrapper = shallowMount(TopMenuGlobalElementBasic, {
      store: {
        state: {scene: {pageId: 'header'}, page: {linked: ['page1', 'page2']}}
      },
      localVue
    });

    expect(wrapper.findAll('div.basic_list_con.basic_shopinfo').length).toBe(0);
    expect(wrapper.findAll('div.basic_list_con.basic_policy').length).toBe(0);
  });

});
