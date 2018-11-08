import shortid from 'shortid';

/**
 * get new id
 * @returns {string} id
 */
export function getId() {
  return shortid.generate();
}

const elmInitialDimension = {
  left: 0,
  top: 0,
  width: 200,
  height: 150,
  zIndex: 100
};

export const defaults = {
  createPage: ({title = '', url = ''}) => ({
    title,
    url,
    background: {
      type: 'color',
      value: '#fff'
    },
    sectionIds: [],
    elements: {}
  }),

  createSection: attrs => ({
    type: 'section',
    children: [],
    attrs: {
      dimension: {
        height: 170
      },
      column: 1,
      color: null,
      image: {
        id: null
      },
      ...attrs
    }
  }),

  createColumn: () => ({
    type: 'column',
    children: []
  }),

  createText: attrs => ({
    type: 'text',
    contents: '새 텍스트',
    attrs: {
      dimension: {...elmInitialDimension},
      text: {
        fontSize: '15',
        letterSpacing: '0',
        lineHeight: '1.0',
        textAlign: 'left',
        verticalAlign: 'top',
        color: '#000'
      },
      link: [],
      ...attrs
    }
  }),

  createBox: attrs => ({
    type: 'box',
    attrs: {
      dimension: {...elmInitialDimension},
      color: '#ddd',
      link: [],
      ...attrs
    }
  }),

  createImage: attrs => ({
    type: 'image',
    attrs: {
      dimension: {...elmInitialDimension},
      image: {
        id: null
      },
      link: [],
      ...attrs
    }
  }),

  createSlider: attrs => ({
    type: 'slider',
    attrs: {
      dimension: {...elmInitialDimension},
      image: {
        ids: []
      },
      // Link:
      // [
      //  {type: 'page', id: 'main', target: 'self', disabled: true},
      //  {type: 'url', href: 'http://nhnent.com', target:'_blank', disabled: true},
      //  ...
      // ]
      link: [],
      ...attrs
    }
  }),

  createButton: attrs => ({
    type: 'button',
    contents: '버튼',
    attrs: {
      dimension: {...elmInitialDimension, width: 125, height: 50},
      text: {
        fontSize: '15',
        letterSpacing: '0',
        lineHeight: '1.0',
        textAlign: 'center',
        verticalAlign: 'middle',
        color: '#000'
      },
      color: '#fff',
      // Link: ==> "Slider"가 아닌 경우는 Entity 1개
      // [{type: 'page', id: 'main', target: 'self', disabled: false}]
      // 또는
      // [{type: 'url', href: 'http://nhnent.com', target:'_blank', disabled: false}]
      link: [],
      ...attrs
    }
  }),

  createHeaderMenus: attrs => ({
    type: 'headerMenus',
    draggable: false,
    attrs: {
      dimension: {...elmInitialDimension, width: 0, height: 22},
      ...attrs
    }
  }),

  createHeaderIcons: attrs => ({
    type: 'headerIcons',
    draggable: false,
    attrs: {
      dimension: {...elmInitialDimension, width: 108, height: 22},
      ...attrs
    }
  }),

  createFooterShopinfo: attrs => ({
    type: 'footerShopinfo',
    draggable: false,
    attrs: {
      dimension: {...elmInitialDimension, width: 490, height: 88},
      color: '#000',

      ...attrs
    }
  }),

  createProductList: attrs => ({
    type: 'product',
    draggable: false,
    fullColumn: true,
    attrs: {
      dimension: {...elmInitialDimension, width: 200, height: 200, top: 0, left: 0},
      product: {
        ...attrs
      }
    }
  }),

  createMap: () => ({
    type: 'map',
    attrs: {
      dimension: {...elmInitialDimension, width: 200, height: 200}
    }
  }),
  createSns: attrs => ({
    type: 'sns',
    attrs: {
      dimension: {...elmInitialDimension, width: 200, height: 400},
      ...attrs
    }
  }),

  createVideo: attrs => ({
    type: 'video',
    attrs: {
      dimension: {...elmInitialDimension, width: 200, height: 200},
      video: {
        ...attrs
      }
    }
  }),

  createBoard: attrs => ({
    type: 'board',
    draggable: false,
    fullColumn: true,
    attrs: {
      dimension: {...elmInitialDimension, width: 200, height: 200, top: 0, left: 0},
      board: {
        ...attrs
      }
    }
  }),

  createProductSlide: attrs => ({
    type: 'productSlide',
    draggable: false,
    fullColumn: true,
    attrs: {
      dimension: {...elmInitialDimension, width: 200, height: 200, top: 0, left: 0},
      product: {
        ...attrs
      }
    }
  }),

  createFooterPolicy: attrs => ({
    type: 'footerPolicy',
    draggable: true,
    attrs: {
      dimension: {...elmInitialDimension, width: 191, height: 17},
      color: '#000',
      ...attrs
    }
  })
};
