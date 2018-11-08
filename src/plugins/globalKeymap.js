import _ from 'lodash';

import keyMapper from './globalKeymap.keyMapper';

const fMap = {};
const fMapStack = [];

const isMac = /Mac/.test(navigator.platform);
const shortcutType = isMac ? 'mac' : 'win';

export default {
  install(_vue) {
    _vue.mixin({
      created() {
        if (this.$options.globalKeymap) {
          fMap[this._uid] = this.$options.globalKeymap;
          addKeyMaps(this._uid, this, this.$options.globalKeymap);
        }
      },
      beforeDestroy() {
        if (fMap[this._uid]) {
          deleteKeyMaps(this._uid);
        }
      }
    });
  }
};

window.addEventListener('keydown', event => {
  const shortcut = keyMapper.convert(event);

  _.forEachRight(fMap, ({vm, keyMaps}) => {
    const func = keyMaps[shortcut];

    return !func || invoke(func, vm, event) || false;
  });
});

function addKeyMaps(id, vm, shortcuts) {
  fMap[id] = {
    id,
    vm,
    keyMaps: _.chain(shortcuts)
      .pickBy((v, key) => {
        return key !== 'mac' && key !== 'win';
      })
      .merge(shortcuts[shortcutType])
      .value()
  };

  fMapStack.push(fMap[id]);
}

function deleteKeyMaps(id) {
  delete fMap[id];

  _.remove(fMapStack, map => map.id === id);
}

function invoke(func, ctx, event) {
  return typeof func === 'string' ? ctx[func](event) : func.call(ctx, event);
}
