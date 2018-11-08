import _ from 'lodash';

let _gOptions = {};

export function setGlobalOptions(gOptions) {
  _gOptions = gOptions;
}

export function getGlobalOptions(paths) {
  return _.pick(_gOptions, paths);
}

export function mapGlobalOptionFunctions(paths) {
  return arrToMapObject(paths, (map, key) => {
    map[key] = function() {
      return _gOptions[key].apply(this, arguments);
    };
  });
}

export function mapGlobalOptionData(paths) {
  return arrToMapObject(paths, (map, key) => {
    map[key] = () => _gOptions[key];
  });
}

function arrToMapObject(arr, interatee) {
  const map = {};

  arr = [].concat(arr);

  arr.forEach(interatee.bind(null, map));

  return map;
}
