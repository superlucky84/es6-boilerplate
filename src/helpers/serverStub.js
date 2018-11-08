/**
 * @see 현재 API들은 모두 Mocking code
 * 추후 서버 API 연동 완료 되면 아래 코드들 모두 서버쪽 API 호출 코드로 변경
 */

import mockImage1 from '../../assets/img/edit/dummy/img_pagebg_s1.jpg';
import mockImage2 from '../../assets/img/edit/dummy/img_pagebg_s2.jpg';
import mockImage3 from '../../assets/img/edit/dummy/img_pagebg_s3.jpg';
import mockImage4 from '../../assets/img/edit/dummy/img_pagebg_s4.jpg';
import mockImage5 from '../../assets/img/edit/dummy/img_pagebg_s5.jpg';
import mockImage7 from '../../assets/img/category/img_category_products_2.jpg';
import {getId} from '@/helpers/defaultStates';

const mockImages = [
  {
    id: mockImage1,
    width: 83,
    height: 54,
    thumbnail: null
  },
  {
    id: mockImage2,
    width: 83,
    height: 54,
    thumbnail: null
  },
  {
    id: mockImage3,
    width: 83,
    height: 54,
    thumbnail: null
  },
  {
    id: mockImage4,
    width: 83,
    height: 54,
    thumbnail: null
  },
  {
    id: mockImage5,
    width: 435,
    height: 597,
    thumbnail: null
  }
];

export function getImageUrl(id) {
  return id;
}

export function uploadImages(imgFiles, cb) {
  Promise.all(
    imgFiles.map(imgFile => {
      return new Promise(resolve => {
        const url = URL.createObjectURL(imgFile);
        const image = new Image();

        image.addEventListener('load', function onLoad() {
          mockImages.push({
            id: url,
            width: image.width,
            height: image.height,
            thumbnail: null
          });
          image.removeEventListener('load', onLoad);
          resolve({
            id: url,
            width: image.width,
            height: image.height,
            thumbnail: null
          });
        });
        image.src = url;
      });
    })
  ).then(cb);
}

export function fetchImageList(cb) {
  cb([...mockImages]);
}

export function deleteImage(id, cb) {
  const index = mockImages.findIndex(({id: _id}) => _id === id);
  mockImages.splice(index, 1);
  cb();
}

export function fetchProductList({type, id, count, sortBy}, cb) {
  const productList = [];
  for (let i = 0; i < count; i++) {
    productList.push({
      imageUrl: mockImage7,
      productName: 'Ready made A product',
      soonSoldOut: true,
      discount: true,
      originalPrice: 'W480,000',
      finalPrice: 'W380,000'
    });
  }

  cb(productList);
}

export function fetchPrimaryShopinfo(cb) {
  cb({
    businessName: 'VICTORY', // 상호명
    representative: '홍길동', // 대표
    infomationManager: '홍길동', // 개인정보처리담당자
    phone: '1588-1234', // 전화
    email: 'abcd@aaa.com', // 이메일
    address: '서울시 강남구 역삼동 111-11', // 주소
    registrationNumber: '123-12-12345', // 사업자번호
    mailOrderInfo: '제1234-서울강남-0000호', // 통신판매
    copyright: 'Copyright @ 2018 VICTORY All rights reserved.' // copyright
  });
}

export function fetchPolicyShopinfo(cb) {
  cb({
    terms: 'http://terms.com',
    personalInfo: 'http://personal-info.com'
  });
}

export function updatePageContents(params) {
  let pages = sparse(localStorage.getItem('pages'));

  pages[params.id].sectionIds = params.sectionIds;
  pages[params.id].elements = params.elements;
  pages[params.id].background = params.background;

  localStorage.setItem('pages', sify(pages));

  let pageHistory = sparse(localStorage.getItem(params.id)) || [];

  pageHistory.push({
    id: Date.now(), // 히스토리 아이디
    pageId: params.id,
    timestamp: Date.now(),
    contents: pages[params.id]
  });

  localStorage.setItem(params.id, sify(pageHistory));
}

export function initialize(cb) {
  let entities = JSON.parse(localStorage.getItem('pages'));

  if (!entities) {
    entities = {
      index: {
        title: '메인(필수)',
        url: '메인url',
        background: {
          type: 'color',
          value: '#fff'
        },
        sectionIds: [],
        elements: {}
      },
      header: {
        title: '헤더(필수)',
        url: '헤더url',
        background: {
          type: 'color',
          value: '#fff'
        },
        sectionIds: [],
        elements: {}
      },
      footer: {
        title: '푸터(필수)',
        url: '푸터url',
        background: {
          type: 'color',
          value: '#fff'
        },
        sectionIds: [],
        elements: {}
      }
    };

    localStorage.setItem('pages', JSON.stringify(entities));
  }

  let menus = JSON.parse(localStorage.getItem('menus'));
  if (!menus) {
    menus = {
      linked: [],
      unlinked: []
    };

    localStorage.setItem('menus', JSON.stringify(menus));
  }

  let fontFamily = localStorage.getItem('fontFamily');

  if (!fontFamily) {
    localStorage.setItem('fontFamily', '나눔고딕');
  }

  cb({
    page: {
      entities,
      linked: menus.linked,
      unlinked: menus.unlinked,
      fontFamily
    },
    links: {
      admin: 'http://admin.readyshop.co.kr'
    },
    sns: {
      settingUrl: '//whatsup.nhnent.com',
      enabled: false,
      imageList: [
        {
          url: mockImage1
        },
        {
          url: mockImage2
        },
        {
          url: mockImage3
        },
        {
          url: mockImage4
        },
        {
          url: mockImage5
        }
      ]
    },

    map: {
      settingUrl: '//whatsup.nhnent.com',
      enabled: true,
      mapInfo: {
        apiKey: '973d8fee024b11539f09a0cc46fa9669',
        LatLng: {
          latitude: 37.4009668,
          longitude: 127.10423209999999
        },
        level: 3
      }
    },

    board: {
      settingUrl: '//whatsup.nhnent.com',
      enabled: true,
      boardList: [
        {
          boardId: 'board1',
          boardName: '공지사항',
          boardConfig: {
            memberWrite: true,
            nonMemberWrite: true,
            secretWrite: true,
            reply: false
          }
        },
        {
          boardId: 'board2',
          boardName: 'faq',
          boardConfig: {
            memberWrite: false,
            nonMemberWrite: true,
            secretWrite: true,
            reply: false
          }
        },
        {
          boardId: 'board3',
          boardName: 'q&a',
          boardConfig: {
            memberWrite: true,
            nonMemberWrite: false,
            secretWrite: true,
            reply: false
          }
        }
      ]
    },

    productCategory: {
      settingUrl: '//whatsup.nhnent.com',
      enabled: true,
      categoryList: [
        {
          categoryId: 'category1',
          categoryName: '가방'
        },
        {
          categoryId: 'category2',
          categoryName: '신발'
        }
      ]
    },

    productSection: {
      settingUrl: '//whatsup.nhnent.com',
      enabled: true,
      sectionList: [
        {
          sectionId: 'section1',
          sectionName: '섹션상품1'
        },
        {
          sectionId: 'section2',
          sectionName: '섹션상품2'
        }
      ]
    }
  });
}

function sify(obj) {
  return JSON.stringify(obj);
}

function sparse(obj) {
  return JSON.parse(obj);
}

export function createPage(params, cb) {
  const pageId = getId();
  let pages = sparse(localStorage.getItem('pages')) || {};

  pages[pageId] = params;

  localStorage.setItem('pages', sify(pages));

  cb(pageId);
}

export function updatePage(params) {
  const {id, title, url} = params;
  let pages = sparse(localStorage.getItem('pages')) || {};

  pages[id].title = title;
  pages[id].url = url;

  localStorage.setItem('pages', sify(pages));
}

export function deletePage(id) {
  let pages = sparse(localStorage.getItem('pages')) || {};

  delete pages[id];

  localStorage.setItem('pages', sify(pages));
}

export function updateMenus(params) {
  localStorage.setItem('menus', sify(params));
}

export function fetchPageHistoryList(id, cb) {
  let pageHistory = sparse(localStorage.getItem(id)) || [];

  cb(
    pageHistory.map(item => ({
      id: item.id,
      timestamp: item.timestamp
    }))
  );
}

export function fetchPageHistoryContents(params, cb) {
  const pageHistory = sparse(localStorage.getItem(params.pageId));

  cb(pageHistory.filter(item => item.id === params.id)[0]);
}

export function publishPageContents(pageHtmls, cb) {
  console.log(pageHtmls);
  cb('http://alpha-admin.readyshop.co.kr/login');
}

export function previewPageContents(pageHtmls, cb) {
  cb('http://alpha-admin.readyshop.co.kr/login');
}

export function fetchFontList(cb) {
  cb([
    {
      title: 'Arial',
      fontFamily: 'Arial'
    },
    {
      title: 'Times',
      fontFamily: 'Times'
    },
    {
      title: 'Verdana',
      fontFamily: 'Verdana'
    },
    {
      title: 'Palatino',
      fontFamily: 'Palatino'
    },
    {
      title: '나눔고딕',
      fontFamily: '나눔고딕'
    }
  ]);
}

export function changeFontFamily(fontFamily) {
  localStorage.setItem('fontFamily', fontFamily);
}

export function logout(cb) {
  cb();
}
