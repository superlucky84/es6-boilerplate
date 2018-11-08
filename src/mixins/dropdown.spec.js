import dropdown from './dropdown';
import {shallowMount} from '@vue/test-utils';

const stubComponent = {
  mixins: [dropdown],
  created() {
    this.$refs.dropdownActivator = document.createElement('div');
  },
  render() {}
};

describe('Dropdown', () => {
  it('믹스인이 포함된 컴포넌트가 생성될때 UID도 함께 증가되어야 한다.', () => {
    shallowMount(stubComponent);
    shallowMount(stubComponent);
    const wrapper = shallowMount(stubComponent);

    expect(wrapper.vm.dropDownComponentUid).toBe(3);
  });

  it('드롭다운 메뉴가 오픈되면 _addOpenDropdownComponents 가 실행되어야 한다.', () => {
    const mockFn = jest.fn();
    const wrapper = shallowMount(stubComponent, {
      methods: {
        _addOpenDropdownComponents: mockFn
      }
    });

    wrapper.vm.openDropdown();
    expect(mockFn.mock.calls.length).toBe(1);
  });

  it('드롭다운 메뉴가 닫히게 되면 _removeOpenDropdownComponents 가 실행되어야 한다.', () => {
    const mockFn = jest.fn();
    const wrapper = shallowMount(stubComponent, {
      methods: {
        _removeOpenDropdownComponents: mockFn
      }
    });
    wrapper.setData({isOpenedDropdown: true});

    wrapper.vm.closeDropdown();
    expect(mockFn.mock.calls.length).toBe(1);
  });

  it('closeAllDropdown가 실행되면 모든 열려있는 컴포넌트의 isOpenedDropdown 상태가 false가 되어야 한다.', () => {
    const wrapper1 = shallowMount(stubComponent);
    const wrapper2 = shallowMount(stubComponent);
    const wrapper3 = shallowMount(stubComponent);
    const wrapper4 = shallowMount(stubComponent);
    wrapper1.setData({isOpenedDropdown: true});
    wrapper2.setData({isOpenedDropdown: true});
    wrapper3.setData({isOpenedDropdown: true});
    wrapper4.setData({isOpenedDropdown: true});

    wrapper1.vm.closeAllDropdown();

    expect(wrapper1.vm.isOpenedDropdown).toBe(false);
    expect(wrapper2.vm.isOpenedDropdown).toBe(false);
    expect(wrapper3.vm.isOpenedDropdown).toBe(false);
  });
});
