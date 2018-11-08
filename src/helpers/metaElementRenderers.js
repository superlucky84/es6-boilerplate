import _ from 'lodash';
import {makeDimensionValue} from '@/helpers/util';

const DIMENSION_SCHEMA = {
  dimension: {
    width: 'String',
    height: 'String',
    top: 'String',
    left: 'String',
    zIndex: 'Number'
  }
};

const META_TAG_ELEMENTS_SCHEMA = {
  product: {
    ...DIMENSION_SCHEMA,
    product: {
      type: 'String',
      id: 'String',
      columnCount: 'Number',
      productCount: 'Number',
      sortBy: 'String'
    }
  },
  productSlide: {
    ...DIMENSION_SCHEMA,
    product: {
      type: 'String',
      id: 'String',
      columnCount: 'Number',
      productCount: 'Number',
      sortBy: 'String'
    }
  },
  footerShopinfo: {
    ...DIMENSION_SCHEMA,
    color: 'String'
  },
  footerPolicy: {
    ...DIMENSION_SCHEMA,
    color: 'String'
  },
  map: {
    ...DIMENSION_SCHEMA
  },
  board: {
    ...DIMENSION_SCHEMA,
    board: {
      boardId: 'String',
      count: 'Number'
    }
  },
  sns: {
    ...DIMENSION_SCHEMA
  }
};

const metatagHelper = {
  makeMetaTagHtml: function(element, columnDimension) {
    const {attrs: data, fullColumn} = element;
    const SCHEMA = META_TAG_ELEMENTS_SCHEMA[element.type];
    const metaTag = this.makeMetaTagFromSchema({
      elementType: element.type,
      schema: SCHEMA,
      data,
      fullColumn,
      columnDimension
    });

    return metaTag;
  },

  makeMetaTagFromSchema: function({elementType, schema, data, fullColumn, columnDimension}) {
    const metaTag = document.createElement('div');
    metaTag.setAttribute('data-type', elementType);

    this.explodeObject({
      keyPrefix: 'data',
      obj: schema,
      data,
      metaTag,
      fullColumn,
      columnDimension,
      elementType
    });

    return metaTag;
  },

  explodeObject: function({keyPrefix, obj, data, metaTag, fullColumn, columnDimension, elementType}) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];

      if (_.isObject(value)) {
        this.explodeObject({
          keyPrefix: `${keyPrefix}-${key}`,
          obj: value,
          data: data[key],
          metaTag,
          fullColumn,
          columnDimension,
          elementType
        });
      } else {
        let makeValue = data[key];

        if (keyPrefix === 'data-dimension' && key !== 'zIndex') {
          makeValue = makeDimensionValue({
            key,
            value: makeValue,
            fullColumn,
            columnDimension,
            percentForced: ['sns', 'map'].indexOf(elementType) >= 0
          });
        }

        metaTag.setAttribute(`${keyPrefix}-${key}`, makeValue);
      }
    });
  }
};

const exportMethods = ['map', 'sns', 'board', 'footerShopinfo', 'footerPolicy', 'product', 'productSlide'].reduce(
  (methodItem, methodName) => {
    methodItem[methodName] = function(element, columnDimension) {
      return metatagHelper.makeMetaTagHtml(element, columnDimension);
    };

    return methodItem;
  },
  {}
);

export default exportMethods;
