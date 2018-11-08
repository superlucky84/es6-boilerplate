export function createDeferred() {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}

export function preventUserSelect() {
  document.body.style.userSelect = 'none';
}

export function restoreUserSelect() {
  document.body.style.userSelect = '';
}

export function getBoundingRect(el) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + window.scrollY,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y
  };
}

export function makeDimensionValue({key, value, fullColumn, columnDimension, percentForced}) {
  const isFullColumnDimension = ['width', 'height'].indexOf(key) >= 0 && fullColumn;
  const isNeedUnitChange =
    (['width', 'height'].indexOf(key) >= 0 && percentForced) || ['left', 'top'].indexOf(key) >= 0;

  if (isFullColumnDimension) {
    value = '100%';
  } else if (isNeedUnitChange) {
    const standardSize = ['width', 'left'].indexOf(key) >= 0 ? columnDimension.width : columnDimension.height;
    const dimensionValue = Math.floor((value * 100) / standardSize);

    value = `${dimensionValue}%`;
  } else {
    value += 'px';
  }

  return value;
}

export function makeDimensionStyle({dimension, fullColumn, columnDimension = {}}) {
  return Object.keys(dimension).reduce((style, key) => {
    let makeValue = '';
    if (key === 'zIndex') {
      makeValue = dimension[key];
      key = 'z-index';
    } else {
      makeValue = makeDimensionValue({
        key,
        value: dimension[key],
        fullColumn,
        columnDimension,
        percentForced: dimension.percentForced
      });
    }

    if (key !== 'percentForced') {
      style += `${key}: ${makeValue};`;
    }

    return style;
  }, '');
}
