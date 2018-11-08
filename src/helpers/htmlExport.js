import Vue from 'vue';
import {mapState} from 'vuex';
import store from '@/store';
import {mapGlobalOptionFunctions} from '@/helpers/globalOptions';
import contentElementRenderers from '@/helpers/contentElementRenderers';
import metaElementRenderers from '@/helpers/metaElementRenderers';

const {getImageUrl} = mapGlobalOptionFunctions(['getImageUrl']);

export class MakePage {
  constructor() {
    this.pageInfo = new Vue({
      store,
      computed: {
        ...mapState({
          entities: ({page}) => page.entities,
          getPage: ({page}) => pageId => page.entities[pageId],
          allPageIds: ({page}) => Object.keys(page.entities),
          currentPageId: ({scene}) => scene.pageId
        })
      }
    });
  }

  getPageType() {
    return ['header', 'footer'].indexOf(this.targetPageId) >= 0 ? this.targetPageId : 'main';
  }

  makePage() {
    const pageType = this.getPageType();
    const page = document.createElement(pageType);
    const background = this.targetPage.background;

    if (background.type === 'color') {
      page.style.backgroundColor = background.value;
    } else {
      page.style.background = `no-repeat url('${getImageUrl(background.value)}')`;
    }

    page.id = pageType;

    return page;
  }

  makeSections() {
    const sectionIds = this.targetPage.sectionIds;
    const sectionPages = document.createDocumentFragment();

    sectionIds.forEach(sectionId => {
      const sectionElement = this.elements[sectionId];
      sectionPages.appendChild(this.makeSection(sectionElement));
    });

    return sectionPages;
  }

  makeSection(sectionElement) {
    const columnIds = sectionElement.children;
    const columnCount = columnIds.length;
    const section = document.createElement('div');
    const wrap = document.createElement('div');
    const columnArea = document.createElement('div');
    const wrapStyle = wrap.style;
    const sectionStyle = section.style;
    const {
      dimension: {height},
      image: {id, isFixedBackground},
      color,
      fullWidth
    } = sectionElement.attrs;

    section.className = 'editorCanvas';
    section.style.minHeight = `${height}px`;

    wrap.className = 'wrap';
    if (fullWidth) {
      this.makeSectionStyle(sectionStyle, {id, color, isFixedBackground});
    } else {
      this.makeSectionStyle(wrapStyle, {id, color, isFixedBackground});
      wrapStyle.height = '100%';
    }
    columnArea.className = `columnArea column-${columnCount}`;

    wrap.append(columnArea);
    section.appendChild(wrap);

    const columnPages = this.makeColumns(columnIds, columnCount, height);
    columnArea.appendChild(columnPages);

    return section;
  }

  makeSectionStyle(targetStyleObject, {id, color, isFixedBackground}) {
    targetStyleObject.backgroundImage = id ? `url('${getImageUrl(id)}')` : '';
    targetStyleObject.backgroundSize = '100% 100%';
    targetStyleObject.backgroundColor = color;
    targetStyleObject.backgroundAttachment = isFixedBackground ? 'fixed' : '';
  }

  hasFullColumnElement(columnIds) {
    return columnIds.some(columnId =>
      this.elements[columnId].children.some(elementId => !!this.elements[elementId].fullColumn)
    );
  }

  makeColumns(columnIds, columnCount, height) {
    const columnPages = document.createDocumentFragment();
    columnIds.forEach(columnId => {
      columnPages.appendChild(this.makeColumn(columnId, columnCount, height));
    });

    return columnPages;
  }

  makeColumn(columnId, columnCount, height) {
    const columnElement = this.elements[columnId];
    const column = document.createElement('div');
    const elementPages = this.makeEndElements(columnElement.children, {
      height,
      width: 1170 / columnCount
    });

    column.className = 'column';
    column.style.minHeight = `${height}px`;
    column.appendChild(elementPages);

    return column;
  }

  makeEndElements(elementIds, columnDimension) {
    const elementPages = document.createDocumentFragment();
    elementIds.forEach(elementId => {
      elementPages.appendChild(this.makeElement(elementId, columnDimension));
    });

    return elementPages;
  }

  makeElement(elementId, columnDimension) {
    const element = this.elements[elementId];
    const renderers = {
      ...contentElementRenderers,
      ...metaElementRenderers
    };
    let renderer = renderers[element.type].bind(renderers);
    if (!renderer) {
      renderer = function() {
        const errorElement = document.createElement('div');
        errorElement.innerHTML = 'not defined real element';
        console.error('not defined real element');

        return errorElement;
      };
    }

    return renderer(element, columnDimension);
  }

  setTargetPageElement(targetPage) {
    this.targetPage = targetPage;
    this.elements = this.targetPage.elements;
  }

  run(targetPageId) {
    if (targetPageId) {
      this.targetPageId = targetPageId;
      this.targetPage = this.pageInfo.getPage(targetPageId);
      this.elements = this.targetPage.elements;
    }

    const resultPage = this.makePage();
    const sectionPages = this.makeSections(this.targetPage);
    resultPage.appendChild(sectionPages);

    return resultPage;
  }
}

export default {
  makePage: () => {
    const makePage = new MakePage();
    const currentPageId = makePage.pageInfo.currentPageId;

    return {
      [currentPageId]: makePage.run(currentPageId).outerHTML
    };
  },
  makePageAll: () => {
    const makePage = new MakePage();
    const allPages = makePage.pageInfo.allPageIds;

    const result = allPages.reduce((resultItem, pageId) => {
      resultItem[pageId] = makePage.run(pageId).outerHTML;

      return resultItem;
    }, {});

    return result;
  }
};
