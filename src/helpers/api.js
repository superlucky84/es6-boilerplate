/**
 * @see 서버 CB 스타일 API들을 모두 Promise처리로 Wrapping
 */

import {getGlobalOptions} from './globalOptions';

const MAXIMUM_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

export function uploadImages(...imgFiles) {
  const filtered = imgFiles.filter(({size}) => size <= MAXIMUM_IMAGE_FILE_SIZE);

  if (!filtered.length) {
    // @Todo 메시지 관련 locale 처리
    throw new Error('5MB를 초과하는 이미지는 업로드할 수 없습니다.');
  }

  return new Promise(resolve => {
    const {uploadImages: _uploadImages} = getGlobalOptions('uploadImages');

    _uploadImages(filtered, res => {
      resolve(res);
    });
  });
}

export function fetchImageList() {
  return new Promise(resolve => {
    const {fetchImageList: _fetchImageList} = getGlobalOptions('fetchImageList');

    _fetchImageList(resolve);
  });
}

export function deleteImage(id) {
  return new Promise(resolve => {
    const {deleteImage: _deleteImage} = getGlobalOptions('deleteImage');

    _deleteImage(id, resolve);
  });
}

export function createPage(params) {
  return new Promise(resolve => {
    const {createPage: _createPage} = getGlobalOptions('createPage');

    _createPage(params, resolve);
  });
}

export function updatePage(params) {
  const {updatePage: _updatePage} = getGlobalOptions('updatePage');

  _updatePage(params);
}

export function deletePage(id) {
  const {deletePage: _deletePage} = getGlobalOptions('deletePage');

  _deletePage(id);
}

export function updateMenus(params) {
  const {updateMenus: _updateMenus} = getGlobalOptions('updateMenus');

  _updateMenus(params);
}

export function fetchPageHistoryList(id) {
  const {fetchPageHistoryList: _fetchPageHistoryList} = getGlobalOptions('fetchPageHistoryList');

  return new Promise(resolve => {
    _fetchPageHistoryList(id, resolve);
  });
}

export function fetchPageHistoryContents(params) {
  const {fetchPageHistoryContents: __fetchPageHistoryContents} = getGlobalOptions('fetchPageHistoryContents');

  return new Promise(resolve => {
    __fetchPageHistoryContents(params, resolve);
  });
}

export function publishPageContents(params) {
  return new Promise(resolve => {
    const {publishPageContents: _publishPageContents} = getGlobalOptions('publishPageContents');

    _publishPageContents(params, resolve);
  });
}

export function previewPageContents(params) {
  return new Promise(resolve => {
    const {previewPageContents: _previewPageContents} = getGlobalOptions('previewPageContents');

    _previewPageContents(params, resolve);
  });
}

export function fetchFontList() {
  const {fetchFontList: __fetchFontList} = getGlobalOptions('fetchFontList');

  return new Promise(resolve => {
    __fetchFontList(resolve);
  });
}

export function fetchBoardList() {
  return new Promise(resolve => {
    const {fetchBoardList: _fetchBoardList} = getGlobalOptions('fetchBoardList');

    _fetchBoardList(resolve);
  });
}
