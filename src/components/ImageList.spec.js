import {shallowMount} from '@vue/test-utils';
import ImageList from '@/components/ImageList';

describe('ImageList', () => {
  let wrapper, imageIds;

  beforeEach(() => {
    imageIds = ['a', 'b', 'c', 'd'];
    wrapper = shallowMount(ImageList, {
      methods: {
        fetchImageList: () => {},
        deleteImage: () => {},
        getImageUrl: id => id
      },
      computed: {
        imageIds: () => imageIds
      }
    });
  });

  it('should render first input to upload image', () => {
    expect(wrapper.find('li.add').contains('input')).toBe(true);
  });

  it('should render list items - images + upload input ', () => {
    expect(wrapper.findAll('li').length).toBe(imageIds.length + 1);
  });

  it('(selectable: true) - should select image on click', () => {
    let spy = jest.fn();
    wrapper.vm.$on('update:selectedId', spy);
    wrapper.setProps({selectable: true});
    wrapper
      .findAll('li:not(.add) img')
      .at(0)
      .trigger('click');

    expect(spy).toHaveBeenCalledWith(imageIds[0]);
  });

  it('(checkable: true) - should check image on click', () => {
    const spy = jest.fn();

    wrapper.setProps({checkable: true});
    wrapper.vm.$on('update:checkedIds', spy);
    wrapper
      .findAll('.img_label')
      .at(3)
      .trigger('click');

    expect(spy).toHaveBeenCalledWith([imageIds[3]]);
  });

  it('(checkable: true) - should check multiple images on click', () => {
    let spy = jest.fn();
    wrapper.vm.$on('update:checkedIds', checkedIds => wrapper.setProps({checkedIds}));
    wrapper.vm.$on('update:checkedIds', spy);

    wrapper.setProps({checkable: true});
    wrapper
      .findAll('.img_label')
      .at(3)
      .trigger('click');
    wrapper
      .findAll('.img_label')
      .at(2)
      .trigger('click');

    expect(spy).toHaveBeenCalledWith([imageIds[3], imageIds[2]]);
  });

  it('(delete: true) - should delete image on click delete-btn', () => {
    const spyDeleteImage = jest.fn();

    wrapper.setProps({deletable: true});
    wrapper.setMethods({
      deleteImage: spyDeleteImage
    });
    wrapper
      .findAll('a.delete')
      .at(0)
      .trigger('click');

    expect(spyDeleteImage).toHaveBeenCalledWith(imageIds[0]);
  });
});
