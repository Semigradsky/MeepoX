'use strict';

module.exports = function(reject, successCallback, undefinedCallback) {
  return function(err, data) {
    if (err) {
      reject(err);
      return;
    }

    if (!data) {
      if (typeof undefinedCallback === 'function') {
        undefinedCallback();
      } else if (typeof undefinedCallback === 'string') {
        reject(new Error(undefinedCallback));
      }
      return;
    }

    successCallback(data);
  };
};
