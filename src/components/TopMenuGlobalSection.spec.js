import {shallowMount} from '@vue/test-utils';
import TopMenuGlobalSection from './TopMenuGlobalSection';

describe('TopMenuGlobalSection', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TopMenuGlobalSection, {
      data: () => ({
        isOpenedDropdown: true
      })
    });
  });

  it('setColumnCount', () => {
    wrapper.find('.stage_li.stage1').trigger('click');
    expect(wrapper.vm.columnCount).toBe(1);

    wrapper.find('.stage_li.stage2').trigger('click');
    expect(wrapper.vm.columnCount).toBe(2);

    wrapper.find('.stage_li.stage3').trigger('click');
    expect(wrapper.vm.columnCount).toBe(3);
  });

  it('setBackgroundImage', () => {
    wrapper.find({name: 'ImageList'}).vm.$emit('update:selectedId', 'image Id');

    expect(wrapper.vm.backgroundImageId).toBe('image Id');
  });

  it('addNewSection button', () => {
    const addNewSection = jest.fn();

    wrapper.setMethods({addNewSection});
    wrapper.find('.foot_btn.btn-blue').trigger('click');

    expect(addNewSection).toHaveBeenCalled();
  });

  it('Dispatch addNewSection with payload', () => {
    const dispatchActionMock = jest.fn();

    wrapper.setMethods({_addNewSection: dispatchActionMock});
    wrapper.setData({
      activeTab: 'image',
      columnCount: 2,
      backgroundImageId: 'image Id',
      backgroundColor: '#color'
    });
    wrapper.find('.foot_btn.btn-blue').trigger('click');

    expect(dispatchActionMock).toHaveBeenCalledWith({
      columnCount: 2,
      backgroundImageId: 'image Id',
      fullWidth: false
    });

    dispatchActionMock.mockReset();

    wrapper.setData({activeTab: 'color'});
    wrapper.find('.foot_btn.btn-blue').trigger('click');

    expect(dispatchActionMock).toHaveBeenCalledWith({
      columnCount: 2,
      backgroundColor: '#color',
      fullWidth: false
    });
  });
});
