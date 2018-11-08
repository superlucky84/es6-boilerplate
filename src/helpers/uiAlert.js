import {createDeferred} from '@/helpers/util';
import _ from 'lodash';
import Vue from 'vue';
import PopupAlert from '@/components/PopupAlert';
import {Wormhole} from 'portal-vue';

function _closeUiAlert(deferred, id, confirmedResult) {
  Wormhole.close({
    to: 'layer',
    from: id
  });

  deferred.resolve(confirmedResult);
}

// @todo Portal vNode 이슈 - new Vue(PopupAlert) 안됨. => `vm.$createElement(PopupAlert)`을 사용해야 하는데 이유는?

/**
 * Alert 커스텀 UI
 * @param {string} headerText - Alert header text
 * @param {string }bodyText - Alert body text
 * @returns {Promise}
 */
export function uiAlert({headerText, bodyText}) {
  const deferred = createDeferred();
  const id = _.uniqueId('ui-alert-');
  const vNode = new Vue().$createElement(PopupAlert, {
    props: {
      headerText,
      bodyText,
      close: () => _closeUiAlert(deferred, id, {confirmed: true})
    }
  });

  Wormhole.open({
    to: 'layer',
    from: id,
    passengers: [vNode]
  });

  return deferred.promise;
}

/**
 * Confirm 커스텀 UI
 * @param {string} headerText - Alert header text
 * @param {string }bodyText - Alert body text
 * @returns {Promise}
 */
export function uiConfirm({headerText, bodyText}) {
  const deferred = createDeferred();
  const id = _.uniqueId('ui-alert-');

  /* @todo new Vue(PopupAlert) 안됨. => `vm.$createElement(PopupAlert)`을 사용해야 하는데 이유는? */
  const vNode = new Vue().$createElement(PopupAlert, {
    props: {
      isConfirm: true,
      headerText,
      bodyText,
      close: confirmedResult => _closeUiAlert(deferred, id, confirmedResult)
    }
  });

  Wormhole.open({
    to: 'layer',
    from: id,
    passengers: [vNode]
  });

  return deferred.promise;
}
