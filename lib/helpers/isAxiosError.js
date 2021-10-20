'use strict';
/**
*确定有效负载是否为Axios引发的错误
*
*@param{*}加载要测试的值
*@如果有效负载是Axios抛出的错误，则返回{boolean}True，否则返回false
*/
/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};
