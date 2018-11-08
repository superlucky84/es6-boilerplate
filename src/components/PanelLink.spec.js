import {shallowMount} from '@vue/test-utils';
import PanelLink from '@/components/PanelLink';

describe('PanelLink Component', () => {
  let link, wrapper;

  beforeEach(() => {
    link = [];
    wrapper = shallowMount(PanelLink, {
      propsData: {
        id: 'elementId',
        attr: link
      },
      mocks: {
        $store: {
          state: {
            page: {
              linked: ['foo'],
              fixedUnlinked: ['index', 'header', 'footer'],
              unlinked: ['bar'],
              entities: {
                index: {title: '메인(필수)'},
                header: {title: '해더(필수)'},
                footer: {title: '푸터(필수)'},
                foo: {title: 'Foo'},
                bar: {title: 'Bar'}
              }
            }
          }
        }
      },
      methods: {
        updateAttr: () => {}
      }
    });
  });

  describe('prop', () => {
    it('count = 0 :: disable/enable 할 수 있는 체크박스가 없다.', () => {
      expect(wrapper.find('div.check-text').exists()).toBe(true);

      wrapper.setProps({
        count: 0
      });

      expect(wrapper.find('div.check-text').exists()).toBe(false);
    });

    it('multiple = true, count > 1 :: 슬라이드 이동 버튼 (이전/다음)이 있다.', () => {
      wrapper.setProps({
        isMultiple: true,
        count: 3
      });

      expect(wrapper.find('button.btn-page.pre').exists()).toBe(true);
      expect(wrapper.find('button.btn-page.next').exists()).toBe(true);
    });

    it('multiple = true, count = 0 :: 슬라이드 이동 버튼 (이전/다음)이 없다.', () => {
      wrapper.setProps({
        isMultiple: true,
        count: 0
      });

      expect(wrapper.find('button.btn-page.pre').exists()).toBe(false);
      expect(wrapper.find('button.btn-page.next').exists()).toBe(false);
    });
  });

  describe('computed', () => {
    it('링크 데이터가 없는 경우, "linkEntity"의 default 값이 존재하여야 한다.', () => {
      expect(wrapper.vm.linkEntity).toEqual({disabled: true, id: 'index', target: '_blank', type: 'page'});
    });

    it('링크 데이터가 없는 경우, "disabled"의 기본값은 true ', () => {
      expect(wrapper.vm.disabled).toEqual(true);
    });

    it('"pages"는 index + linked + unlinked로 보여준다.', () => {
      expect(wrapper.vm.pages).toEqual([
        {id: 'index', title: '메인(필수)'},
        {id: 'foo', title: 'Foo'},
        {id: 'bar', title: 'Bar'}
      ]);
    });

    it('"type" 값을 `page`로 바꾸면 "href"는 null로 업데이트한다.', () => {
      const updateCurrentLink = jest.fn();
      wrapper.setMethods({updateCurrentLink});

      wrapper.vm.type = 'page';

      expect(updateCurrentLink).toHaveBeenCalledWith({
        type: 'page',
        href: null
      });
    });

    it('"type"을 `url`로 바꾸면 "id"는 index로 업데이트한다.', () => {
      const updateCurrentLink = jest.fn();
      wrapper.setMethods({updateCurrentLink});

      wrapper.vm.type = 'url';

      expect(updateCurrentLink).toHaveBeenCalledWith({
        type: 'url',
        id: 'index'
      });
    });

    it('attr이 빈 배열인데, count가 0보다 크면, attr을 count 만큼 길이를 늘린다.', () => {
      const updateAttr = jest.fn();
      wrapper.setMethods({updateAttr});
      wrapper.setProps({count: 3});

      expect(updateAttr).toHaveBeenCalledWith({
        id: 'elementId',
        type: 'link',
        newAttr: new Array(3)
      });
    });
  });
});
