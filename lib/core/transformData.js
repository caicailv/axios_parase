'use strict';

var utils = require('./../utils');
var defaults = require('./../defaults');

/**
 * Transform the data for a request or a response
 * *为请求或响应转换数据

 * @param {Object|String} data The data to be transformed 要转换的数据
 * @param {Array} headers The headers for the request or response 请求或响应的headers
 * @param {Array|Function} fns A single function or Array of functions 单个函数或函数数组
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    console.log('data before',data);
    data = fn.call(context, data, headers);
    console.log('data after',data);
  });

  return data;
};
