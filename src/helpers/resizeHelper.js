import _ from 'lodash';

export const RESIZE_TL = 'RESIZE_TL';
export const RESIZE_T = 'RESIZE_T';
export const RESIZE_TR = 'RESIZE_TR';
export const RESIZE_R = 'RESIZE_R';
export const RESIZE_BR = 'RESIZE_BR';
export const RESIZE_B = 'RESIZE_B';
export const RESIZE_BL = 'RESIZE_BL';
export const RESIZE_L = 'RESIZE_L';

export const resizeFn = {
  [RESIZE_TL]: resizeTL,
  [RESIZE_T]: resizeT,
  [RESIZE_TR]: resizeTR,
  [RESIZE_R]: resizeR,
  [RESIZE_BR]: resizeBR,
  [RESIZE_B]: resizeB,
  [RESIZE_BL]: resizeBL,
  [RESIZE_L]: resizeL
};

// fixedRatio = originalWidth / originalHeight;
export function adjustRatioSize({width, height, fixedRatio, scaleTo, maxWidth = Infinity, maxHeight = Infinity}) {
  if (scaleTo === 'width') {
    height = width / fixedRatio;
  } else {
    width = height * fixedRatio;
  }

  const maxScaleFactor = Math.min(maxWidth / width, maxHeight / height);
  if (maxScaleFactor <= 1) {
    [width, height] = [width, height].map(v => v * maxScaleFactor);
  }

  return {width, height};
}

export function resizeTL({left, top, width, height, fixedRatio}, {pageX, pageY}, limitRect) {
  const right = left + width;
  const bottom = top + height;
  const maxWidth = right - limitRect.left;
  const maxHeight = bottom - limitRect.top;

  width = _.clamp(right - pageX, 1, maxWidth);
  height = _.clamp(bottom - pageY, 1, maxHeight);

  if (fixedRatio) {
    const dx = left - pageX;
    const dy = top - pageY;
    const scaleTo = dx > dy ? 'width' : 'height';
    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo, maxWidth, maxHeight}));
  }

  left = right - width;
  top = bottom - height;

  return {left, top, width, height};
}

export function resizeT({left, top, width, height, fixedRatio}, {pageY}, limitRect) {
  const bottom = top + height;
  const maxWidth = limitRect.right - left;
  const maxHeight = bottom - limitRect.top;

  height = _.clamp(bottom - pageY, 1, maxHeight);

  if (fixedRatio) {
    ({width, height} = adjustRatioSize({width, height, fixedRatio, maxWidth, maxHeight, scaleTo: 'height'}));
  }

  top = bottom - height;

  return {left, top, height, width};
}

export function resizeTR({left, top, width, height, fixedRatio}, {pageX, pageY}, limitRect) {
  const right = left + width;
  const bottom = top + height;
  const maxWidth = limitRect.right - left;
  const maxHeight = bottom - limitRect.top;

  width = _.clamp(pageX - left, 1, maxWidth);
  height = _.clamp(bottom - pageY, 1, maxHeight);

  if (fixedRatio) {
    const dx = pageX - right;
    const dy = top - pageY;
    const scaleTo = dx > dy ? 'width' : 'height';
    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo, maxWidth, maxHeight}));
  }

  top = bottom - height;

  return {left, top, width, height};
}

export function resizeR({left, top, width, height, fixedRatio}, {pageX}, limitRect) {
  const maxWidth = limitRect.right - left;
  const maxHeight = limitRect.bottom - top;

  width = _.clamp(pageX - left, 1, maxWidth);

  if (fixedRatio) {
    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo: 'width', maxWidth, maxHeight}));
  }

  return {left, top, width, height};
}

export function resizeBR({left, top, width, height, fixedRatio}, {pageX, pageY}, limitRect) {
  const right = left + width;
  const bottom = top + height;
  const maxWidth = limitRect.right - left;
  const maxHeight = limitRect.bottom - top;

  width = _.clamp(pageX - left, 1, maxWidth);
  height = _.clamp(pageY - top, 1, maxHeight);

  if (fixedRatio) {
    const dx = pageX - right;
    const dy = pageY - bottom;
    const scaleTo = dx > dy ? 'width' : 'height';

    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo, maxWidth, maxHeight}));
  }

  return {left, top, width, height};
}

export function resizeB({left, top, width, height, fixedRatio}, {pageY}, limitRect) {
  const maxWidth = limitRect.right - left;
  const maxHeight = limitRect.bottom - top;

  height = _.clamp(pageY - top, 1, maxHeight);

  if (fixedRatio) {
    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo: 'height', maxWidth, maxHeight}));
  }

  return {left, top, width, height};
}

export function resizeBL({left, top, width, height, fixedRatio}, {pageX, pageY}, limitRect) {
  const right = width + left;
  const bottom = height + top;
  const maxWidth = right - limitRect.left;
  const maxHeight = limitRect.bottom - top;

  width = _.clamp(right - pageX, 1, maxWidth);
  height = _.clamp(pageY - top, 1, maxHeight);

  if (fixedRatio) {
    const dx = left - pageX;
    const dy = pageY - bottom;
    const scaleTo = dx > dy ? 'width' : 'height';

    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo, maxWidth, maxHeight}));
  }

  left = right - width;

  return {left, top, width, height};
}

export function resizeL({left, top, width, height, fixedRatio}, {pageX}, limitRect) {
  const right = left + width;
  const maxWidth = right - limitRect.left;
  const maxHeight = limitRect.bottom - top;

  width = _.clamp(right - pageX, 1, maxWidth);

  if (fixedRatio) {
    ({width, height} = adjustRatioSize({width, height, fixedRatio, scaleTo: 'width', maxWidth, maxHeight}));
  }

  left = right - width;

  return {left, top, width, height};
}
