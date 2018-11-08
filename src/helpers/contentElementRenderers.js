import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
const {getImageUrl} = mapGlobalOptionFunctions(['getImageUrl']);
import Vue from 'vue';
import {mapState} from 'vuex';
import store from '@/store';
import youtube from '@/helpers/youtubeHelper';
import {makeDimensionStyle} from '@/helpers/util';

function oneLineTrim(...args) {
  const normalTag = (template, ...expressions) =>
    template.reduce((accumulator, part, i) => accumulator + expressions[i - 1] + part);

  return normalTag(...args).replace(/\n\s*/g, '');
}

export const util = {
  pageInfo: new Vue({
    store,
    computed: {
      ...mapState({
        getPageUrl: ({page}) => pageId => {
          return pageId ? page.entities[pageId].url : '#';
        },
        getPage: ({page}) => pageId => page.entities[pageId],
        linkedPages() {
          return this.$store.state.page.linked.map(pageId => this.getPage(pageId));
        }
      })
    }
  }),

  makeElementWrapper: function(dimension, fullColumn, columnDimension) {
    const wrapper = document.createElement('div');
    const dimensionStyle = makeDimensionStyle({dimension, fullColumn, columnDimension});

    wrapper.className = '__element_wrapper';
    wrapper.setAttribute('style', dimensionStyle);

    return wrapper;
  },

  makeTextStyle: function(dimension, text) {
    return [
      `display: table-cell`,
      `wordBreak: break-all`,
      `white-space: normal`,
      `width: ${dimension.width}px`,
      `height: ${dimension.height}px`,
      `left: ${dimension.left}px`,
      `top: ${dimension.top}px`,
      `font-size: ${text.fontSize}px`,
      `letter-spacing: ${text.letterSpacing}em`,
      `line-height: ${text.lineHeight}`,
      `text-align: ${text.textAlign}`,
      `vertical-align: ${text.verticalAlign}`,
      `color: ${text.color}`
    ].join(';');
  },

  makeLinkTag: function(linkInfo) {
    const href = linkInfo.type === 'url' ? linkInfo.href : util.pageInfo.getPageUrl(linkInfo.id);
    const target = linkInfo.target;
    const atag = document.createElement('a');
    atag.setAttribute('href', href);
    atag.setAttribute('target', target);

    return atag;
  }
};

export default {
  headerIcons: function(element, columnDimension) {
    const {
      attrs: {dimension},
      fullColumn
    } = element;
    const elementWrapper = util.makeElementWrapper(dimension, fullColumn, columnDimension);

    const menuicon = menuiconItem => oneLineTrim`
      <ul class="header_icons">
        ${menuiconItem}
      </ul>
    `;
    const menuiconItem = (iconType, subMenu) => oneLineTrim`
      <li class="header_icons_item ${iconType}">
        <a href="#"></a>
        ${subMenu}
      </li>
    `;
    const subMenu = oneLineTrim`
      <ul id="myicon" class="sub-menu">
        <li class="login sub-logout"><a href="#">로그아웃</a></li>
        <li class="login sub-mypage"><a href="#">My Page</a></li>
        <li class="logout sub-login"><a href="#" >로그인</a></li>
        <li class="logout sub-guest"><a href="#">비회원주문조회</a></li>
      </ul>
    `;
    const menuiconItemHTML = ['search', 'mypage', 'cart']
      .map(iconType => {
        return menuiconItem(iconType, iconType === 'mypage' ? subMenu : '');
      })
      .join('\n');
    const menuiconHTML = menuicon(menuiconItemHTML);

    elementWrapper.innerHTML = menuiconHTML;

    return elementWrapper;
  },

  headerMenus: function(element, columnDimension) {
    const {
      attrs: {dimension},
      fullColumn
    } = element;
    const elementWrapper = util.makeElementWrapper(dimension, fullColumn, columnDimension);
    const menulist = menulistItem => oneLineTrim`
      <ul class="header_menus">
        ${menulistItem}
      </ul>
    `;
    const menulistItem = (url, title) => oneLineTrim`
      <li class="header_menus_item">
        <a href="${url}" >${title}</a>
      </li>
    `;
    const menulistItemHTML = util.pageInfo.linkedPages
      .map(info => {
        return menulistItem(info.url, info.title);
      })
      .join('\n');

    const menulistHTML = menulist(menulistItemHTML);

    elementWrapper.innerHTML = menulistHTML;

    return elementWrapper;
  },

  text: function(element, columnDimension) {
    const {
      attrs: {dimension, text, link},
      fullColumn
    } = element;

    const linkInfo = link ? link[0] : null;
    const isExistLink = linkInfo && !linkInfo.disabled;
    const contents = element.contents;
    const elementWrapper = util.makeElementWrapper(dimension, fullColumn, columnDimension);
    const textElement = document.createElement('p');

    textElement.className = 'text itemCover';
    textElement.setAttribute('style', util.makeTextStyle(dimension, text));

    if (isExistLink) {
      const atag = util.makeLinkTag(linkInfo);
      atag.innerHTML = contents;

      textElement.appendChild(atag);
    } else {
      textElement.innerHTML = contents;
    }

    elementWrapper.appendChild(textElement);

    return elementWrapper;
  },

  button: function(element, columnDimension) {
    const {
      attrs: {dimension, color, link, text},
      fullColumn
    } = element;
    const contents = element.contents;
    const elementWrapper = util.makeElementWrapper(dimension, fullColumn, columnDimension);
    const linkInfo = link[0];
    const style = util.makeTextStyle(dimension, text);

    let href = '#';
    let target = '';
    if (linkInfo && !linkInfo.disabled) {
      href = linkInfo.type === 'url' ? linkInfo.href : util.pageInfo.getPageUrl(linkInfo.id);
      target = linkInfo.target;
    }
    const button = oneLineTrim`
      <p class="btn">
        <a href="${href}" class="btn white-1" style="background-color: ${color};" target="${target}">
          <span class="text itemCover" style="${style}">${contents}</span>
        </a>
      </p>
    `;
    elementWrapper.innerHTML = button;

    return elementWrapper;
  },

  image: function(element, columnDimension) {
    const {
      attrs: {
        dimension,
        image: {id: imageId},
        link
      },
      fullColumn
    } = element;

    const linkInfo = link ? link[0] : null;
    const isExistLink = linkInfo && !linkInfo.disabled;
    const percentForcedDimension = Object.assign({}, dimension, {percentForced: true});
    const elementWrapper = util.makeElementWrapper(percentForcedDimension, fullColumn, columnDimension);
    const imageWrap = document.createElement('div');
    const img = document.createElement('img');
    img.src = getImageUrl(imageId);
    imageWrap.className = 'packBox';

    if (isExistLink) {
      const atag = util.makeLinkTag(linkInfo);

      atag.appendChild(img);
      imageWrap.appendChild(atag);
    } else {
      imageWrap.appendChild(img);
    }

    elementWrapper.appendChild(imageWrap);

    return elementWrapper;
  },

  slider: function(element, columnDimension) {
    const {
      attrs: {
        dimension,
        image: {ids},
        link
      },
      fullColumn
    } = element;
    const percentForcedDimension = Object.assign({}, dimension, {percentForced: true});
    const elementWrapper = util.makeElementWrapper(percentForcedDimension, fullColumn, columnDimension);
    const sliderItem = function(img) {
      return oneLineTrim`
        <div class="swiper-slide">
          ${img}
        </div>
      `;
    };
    const sliderHtml = function(itemsHTML) {
      return oneLineTrim`
        <div class="swiper-container">
          <div class="swiper-wrapper">
            ${itemsHTML}
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
      `;
    };
    const itemsHTML = ids
      .map((imgId, itemIndex) => {
        let img = '';
        if (!link[itemIndex] || link[itemIndex].disabled) {
          img = `<img src="${getImageUrl(imgId)}">`;
        } else {
          const linkInfo = link[itemIndex];
          let href = '#';
          let target = '';
          if (linkInfo && !linkInfo.disabled) {
            href = linkInfo.type === 'url' ? linkInfo.href : util.pageInfo.getPageUrl(linkInfo.id);
            target = linkInfo.target;
          }

          img = oneLineTrim`
            <a href="${href}" target="${target}">
              <img src="${getImageUrl(imgId)}">
            </a>
          `;
        }

        return sliderItem(img);
      })
      .join('\n');

    elementWrapper.innerHTML = sliderHtml(itemsHTML);

    return elementWrapper;
  },

  video: function(element, columnDimension) {
    const {
      attrs: {
        dimension,
        video: {autoplay, loop, url}
      },
      fullColumn
    } = element;

    const percentForcedDimension = Object.assign({}, dimension, {percentForced: true});
    const elementWrapper = util.makeElementWrapper(percentForcedDimension, fullColumn, columnDimension);
    const youtubeId = youtube.getYoutubeId(url);
    const uid = youtube.makeVideoUid();
    const videoWrapper = document.createElement('div');
    const video = document.createElement('div');

    videoWrapper.className = 'video';
    videoWrapper.appendChild(video);
    elementWrapper.appendChild(videoWrapper);

    youtube.addPlayer({
      key: uid,
      id: youtubeId,
      element: video,
      autoplay,
      loop
    });

    return elementWrapper;
  },

  box: function(element, columnDimension) {
    const {
      attrs: {dimension, color, link},
      fullColumn
    } = element;
    const elementWrapper = util.makeElementWrapper(dimension, fullColumn, columnDimension);
    const box = document.createElement('div');
    const linkInfo = link[0];
    const dimensionStyle = makeDimensionStyle({dimension, columnDimension});

    if (linkInfo) {
      const href = linkInfo.type === 'url' ? linkInfo.href : util.pageInfo.getPageUrl(linkInfo.id);
      const atag = document.createElement('a');
      atag.setAttribute('href', href);
      atag.setAttribute('style', `display: block;${dimensionStyle}`);
      box.appendChild(atag);
    }
    box.setAttribute('style', `background-color: ${color};${dimensionStyle}`);

    elementWrapper.appendChild(box);

    return elementWrapper;
  }
};
