import {setGlobalOptions} from '@/helpers/globalOptions';
import {util} from '@/helpers/contentElementRenderers';
import {MakePage} from './htmlExport';

util.pageInfo = {
  getPageUrl: function(id) {
    return 'http://readyshoppage.com?id=' + id;
  },
  linkedPages: [
    {
      title: 'title1',
      url: 'http://url1'
    },
    {
      title: 'title2',
      url: 'http://url2'
    }
  ]
};

setGlobalOptions({
  getImageUrl: function(id) {
    return 'http://readyshop.com?id=' + id;
  }
});

describe('htmlExport', () => {
  let makePage;

  describe('getPageType', () => {
    it('타겟 아이디가 index일때는 main을 리턴해야 한다.', () => {
      makePage = new MakePage();
      makePage.targetPageId = 'index';

      expect(makePage.getPageType()).toBe('main');
    });
    it('타겟 아이디가 footer일때는 footer을 리턴해야 한다.', () => {
      makePage = new MakePage();
      makePage.targetPageId = 'footer';

      expect(makePage.getPageType()).toBe('footer');
    });
    it('타겟 아이디가 header일때는 header을 리턴해야 한다.', () => {
      makePage = new MakePage();
      makePage.targetPageId = 'header';

      expect(makePage.getPageType()).toBe('header');
    });
  });

  describe('makePage', () => {
    it('type이 color일때 backgroundColor가 반영된 스타일을 가져야 한다.', () => {
      makePage = new MakePage();

      makePage.targetPageId = 'header';
      makePage.targetPage = {
        background: {
          type: 'color',
          value: '#777777'
        }
      };
      const htmlElement = makePage.makePage();

      expect(htmlElement.getAttribute('style')).toBe('background-color: rgb(119, 119, 119);');
    });
    it('type이 url일때 background url이 반영된 스타일을 가져야 한다.', () => {
      makePage = new MakePage();

      makePage.targetPageId = 'header';
      makePage.targetPage = {
        background: {
          type: 'url',
          value: '3'
        }
      };

      const htmlElement = makePage.makePage();

      expect(htmlElement.getAttribute('style')).toBe('background: url(http://readyshop.com?id=3) no-repeat;');
    });
  });

  describe('makeSections', () => {
    it('정의된 섹션의 개수만큼의 makeSection 이 호출되어야 한다.', () => {
      const mockFunction = jest.fn().mockReturnValue(document.createElement('div'));

      makePage = new MakePage();
      makePage.targetPageId = 'index';
      makePage.setTargetPageElement({
        sectionIds: ['section1', 'section2', 'section3', 'section4'],
        elements: {
          section1: {children: []},
          section2: {children: []},
          section3: {children: []},
          section4: {children: []}
        }
      });

      makePage.makeSection = mockFunction;

      makePage.makeSections();
      expect(mockFunction.mock.calls.length).toBe(4);
    });
  });

  describe('makeSection', () => {
    beforeEach(() => {
      makePage = new MakePage();
      makePage.targetPageId = 'index';
      makePage.setTargetPageElement({
        sectionIds: [],
        elements: {}
      });

      makePage.makeColumns = jest.fn().mockReturnValue(document.createElement('div'));
      makePage.hasFullColumnElement = jest.fn().mockReturnValue(false);
    });

    it('섹션의 백그라운드가 올바로 적용되어야 한다.', () => {
      makePage.hasFullColumnElement = jest.fn().mockReturnValue(true);

      const columnIds = ['column1', 'column2'];
      const sectionElement = makePage.makeSection({
        children: columnIds,
        attrs: {dimension: {height: 40}, image: {id: 3, isFxiedBackground: false}}
      });

      expect(sectionElement.querySelector('.wrap').style.background).toBe('url(http://readyshop.com?id=3)');
    });

    it('컬럼카운트를 표시한 클래스를 가진 섹션 엘리먼트가 생성되어야 한다.', () => {
      const columnIds = ['column1', 'column2'];
      const sectionElement = makePage.makeSection({
        children: columnIds,
        attrs: {dimension: {height: 40}, image: {id: 3, isFxiedBackground: false}}
      });
      const columnArea = sectionElement.querySelector('.columnArea');

      expect(sectionElement.getAttribute('class')).toBe('editorCanvas');
      expect(sectionElement.style.minHeight).toBe('40px');
      expect(columnArea.getAttribute('class')).toMatch(`column-${columnIds.length}`);
    });

    it('makeColumns가 호출되어야 한다.', () => {
      makePage.makeSection({
        children: [],
        attrs: {dimension: {height: 40}, image: {id: 3, isFxiedBackground: false}}
      });

      expect(makePage.makeColumns.mock.calls.length).toBe(1);
    });
  });

  describe('makeColumns', () => {
    it('makeColumn가 컬럼갯수만큼 호출되어야 한다.', () => {
      makePage = new MakePage();

      makePage.targetPageId = 'index';
      makePage.setTargetPageElement({
        sectionIds: [],
        elements: {}
      });

      const columnIds = ['column1', 'column2'];
      makePage.makeColumn = jest.fn().mockReturnValue(document.createElement('div'));
      makePage.makeColumns(columnIds);

      expect(makePage.makeColumn.mock.calls.length).toBe(2);
    });
  });

  describe('makeColumn', () => {
    it('makeColumn가 컬럼갯수만큼 호출되어야 한다.', () => {
      makePage = new MakePage();

      makePage.targetPageId = 'index';
      makePage.setTargetPageElement({
        elements: {
          column1: {
            children: ['endElement1', 'endElement2']
          }
        }
      });

      makePage.makeEndElements = jest.fn().mockReturnValue(document.createElement('div'));

      makePage.makeColumn('column1');

      expect(makePage.makeEndElements.mock.calls.length).toBe(1);
    });
    it('makeColumn가 은 column 클래스를 거진 엘리먼트를 리턴해야 한다.', () => {
      makePage = new MakePage();

      makePage.targetPageId = 'index';
      makePage.setTargetPageElement({
        elements: {
          column1: {
            children: ['endElement1', 'endElement2']
          }
        }
      });

      makePage.makeEndElements = jest.fn().mockReturnValue(document.createElement('div'));

      const columnElement = makePage.makeColumn('column1');
      expect(columnElement.className).toMatch('column');
    });
  });

  describe('makeEndElements', () => {
    it('makeElement는 엘리먼트 갯수만큼 호출되어야 한다.', () => {
      makePage = new MakePage();
      makePage.makeElement = jest.fn().mockReturnValue(document.createElement('div'));
      makePage.makeEndElements(['element1', 'element2', 'element3']);

      expect(makePage.makeElement.mock.calls.length).toBe(3);
    });
  });

  describe('makeElement', () => {
    it('슬라이더 타입은 슬라이더 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.pageInfo = {
        getPageUrl: function(id) {
          return 'http://readyshoppage.com?id=' + id;
        }
      };
      makePage.elements = {
        sliderElementId: {
          type: 'slider',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            image: {
              ids: ['img1', 'img2']
            },
            link: [
              {
                disabled: false,
                id: '3',
                target: 'self'
              },
              {
                disabled: true,
                id: '3',
                target: 'self'
              }
            ]
          }
        }
      };
      const sliderElement = makePage.makeElement('sliderElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(sliderElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 6%;height: 8%;top: 2%;left: 4%;"><div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide"><a href="http://readyshoppage.com?id=3" target="self"><img src="http://readyshop.com?id=img1"></a></div><div class="swiper-slide"><img src="http://readyshop.com?id=img2"></div></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="swiper-pagination"></div></div></div>`
      );
    });

    it('이미지 타입은 이미지 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        imageElementId: {
          type: 'image',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            image: {
              ids: ['img1', 'img2']
            }
          }
        }
      };

      const imageElement = makePage.makeElement('imageElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(imageElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 6%;height: 8%;top: 2%;left: 4%;"><div class="packBox"><img src="http://readyshop.com?id=undefined"></div></div>`
      );
    });

    it('링크를 가진 이미지 타입은 링크를 포함한 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        imageElementId: {
          type: 'image',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            image: {
              ids: ['img1', 'img2']
            },
            link: [
              {
                disabled: false,
                type: 'url',
                href: 'http://jj.com',
                target: 'self'
              }
            ]
          }
        }
      };

      const imageElement = makePage.makeElement('imageElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(imageElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 6%;height: 8%;top: 2%;left: 4%;"><div class="packBox"><a href="http://jj.com" target="self"><img src="http://readyshop.com?id=undefined"></a></div></div>`
      );
    });

    it('버튼 타입은 버튼 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        buttonElementId: {
          type: 'button',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            color: '#77777',
            text: {
              fontSize: 7,
              letterSpacing: 7,
              lineHeight: 7,
              textAlign: 'center',
              verticalAlign: 'middle',
              color: 'red'
            },
            link: [
              {
                disabled: false,
                type: 'url',
                href: 'http://jj.com',
                target: 'self'
              }
            ]
          }
        }
      };
      const buttonElement = makePage.makeElement('buttonElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(buttonElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><p class="btn"><a href="http://jj.com" class="btn white-1" style="background-color: #77777;" target="self"><span class="text itemCover" style="display: table-cell;wordBreak: break-all;white-space: normal;width: 30px;height: 40px;left: 20px;top: 10px;font-size: 7px;letter-spacing: 7em;line-height: 7;text-align: center;vertical-align: middle;color: red">undefined</span></a></p></div>`
      );
    });

    it('버튼 타입은 버튼 타입의 링크가 disabled이면 링크가 없어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        buttonElementId: {
          type: 'button',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            color: '#77777',
            text: {
              fontSize: 7,
              letterSpacing: 7,
              lineHeight: 7,
              textAlign: 'center',
              verticalAlign: 'middle',
              color: 'red'
            },
            link: [
              {
                disabled: true,
                type: 'url',
                href: 'http://jj.com',
                target: 'self'
              }
            ]
          }
        }
      };
      const buttonElement = makePage.makeElement('buttonElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(buttonElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><p class="btn"><a href="#" class="btn white-1" style="background-color: #77777;" target=""><span class="text itemCover" style="display: table-cell;wordBreak: break-all;white-space: normal;width: 30px;height: 40px;left: 20px;top: 10px;font-size: 7px;letter-spacing: 7em;line-height: 7;text-align: center;vertical-align: middle;color: red">undefined</span></a></p></div>`
      );
    });

    it('텍스트 타입은 텍스트 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        textElementId: {
          type: 'text',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            text: {
              fontSize: 7,
              letterSpacing: 7,
              lineHeight: 7,
              textAlign: 'center',
              verticalAlign: 'middle',
              color: 'red'
            }
          }
        }
      };
      const textElement = makePage.makeElement('textElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(textElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><p class="text itemCover" style="display: table-cell;wordBreak: break-all;white-space: normal;width: 30px;height: 40px;left: 20px;top: 10px;font-size: 7px;letter-spacing: 7em;line-height: 7;text-align: center;vertical-align: middle;color: red">undefined</p></div>`
      );
    });

    it('링크를 가진 텍스트 타입은 링크를 포함한 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        textElementId: {
          type: 'text',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            text: {
              fontSize: 7,
              letterSpacing: 7,
              lineHeight: 7,
              textAlign: 'center',
              verticalAlign: 'middle',
              color: 'red'
            },
            link: [
              {
                disabled: false,
                type: 'url',
                href: 'http://jj.com',
                target: '_self'
              }
            ]
          }
        }
      };
      const textElement = makePage.makeElement('textElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(textElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><p class="text itemCover" style="display: table-cell;wordBreak: break-all;white-space: normal;width: 30px;height: 40px;left: 20px;top: 10px;font-size: 7px;letter-spacing: 7em;line-height: 7;text-align: center;vertical-align: middle;color: red"><a href="http://jj.com" target="_self">undefined</a></p></div>`
      );
    });

    it('헤더아이콘 타입은 헤더아이콘 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        headerIconsElementId: {
          type: 'headerIcons',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20}
          }
        }
      };

      const hIconElement = makePage.makeElement('headerIconsElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(hIconElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><ul class="header_icons"><li class="header_icons_item search"><a href="#"></a></li><li class="header_icons_item mypage"><a href="#"></a><ul id="myicon" class="sub-menu"><li class="login sub-logout"><a href="#">로그아웃</a></li><li class="login sub-mypage"><a href="#">My Page</a></li><li class="logout sub-login"><a href="#">로그인</a></li><li class="logout sub-guest"><a href="#">비회원주문조회</a></li></ul></li><li class="header_icons_item cart"><a href="#"></a></li></ul></div>`
      );
    });

    it('헤더메뉴 타입은 헤더메뉴 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        hmeneuElementId: {
          type: 'headerMenus',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20}
          }
        }
      };

      const hMenuElement = makePage.makeElement('hmeneuElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(hMenuElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><ul class="header_menus"><li class="header_menus_item"><a href="http://url1">title1</a></li><li class="header_menus_item"><a href="http://url2">title2</a></li></ul></div>`
      );
    });

    it('박스 타입은 버튼 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        boxElementId: {
          type: 'box',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20},
            color: '#77777',
            link: [
              {
                type: 'url',
                href: 'http://jj.com',
                target: 'self'
              },
              {
                type: 'page',
                id: '7',
                target: '_blank'
              }
            ]
          }
        }
      };
      const boxElement = makePage.makeElement('boxElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(boxElement.outerHTML).toBe(
        `<div class="__element_wrapper" style="width: 30px;height: 40px;top: 2%;left: 4%;"><div style="background-color: #77777;width: 30px;height: 40px;top: 2%;left: 4%;"><a href="http://jj.com" style="display: block;width: 30px;height: 40px;top: 2%;left: 4%;"></a></div></div>`
      );
    });

    it('메타테그 타입은 메타테그 타입 html을 만들어야 한다.', () => {
      makePage = new MakePage();
      makePage.elements = {
        targetElementId: {
          type: 'productSlide',
          attrs: {
            dimension: {width: 30, height: 40, top: 10, left: 20, zIndex: 7},
            product: {
              type: 'section',
              id: 'sectionid',
              columnCount: 3,
              productCount: 7,
              sortBy: 'new'
            }
          }
        }
      };

      const targetElement = makePage.makeElement('targetElementId', {width: 500, height: 500});

      // eslint-disable-next-line
      expect(targetElement.outerHTML).toBe(
        `<div data-type="productSlide" data-dimension-width="30px" data-dimension-height="40px" data-dimension-top="2%" data-dimension-left="4%" data-dimension-zindex="7" data-product-type="section" data-product-id="sectionid" data-product-columncount="3" data-product-productcount="7" data-product-sortby="new"></div>`
      );
    });
  });
});
