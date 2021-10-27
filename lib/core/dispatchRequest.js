'use strict'

var utils = require('./../utils')
var transformData = require('./transformData')
var isCancel = require('../cancel/isCancel')
var defaults = require('../defaults')
var Cancel = require('../cancel/Cancel')

/**
 * Throws a `Cancel` if cancellation has been requested.
 * *如果已请求取消，则抛出“取消”。
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled')
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 **使用配置的适配器向服务器发送请求。

 * @param {object} config config用于请求的配置
 * @returns {Promise} 要实现的promise
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config)

  // Ensure headers exist   确保header存在
  config.headers = config.headers || {}

  // Transform request data 转换请求数据
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  )

  // Flatten headers 展开headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  )
  // 清理headers
  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method]
    }
  )
  var adapter = config.adapter || defaults.adapter
  // 适配器 指的是在不同的环境 用不同的底层方法去请求, node-> http模块, 网页 xhr模块
  return adapter(config).then(
    function onAdapterResolution(response) {
      // 因为此处每一步都可能收到取消请求的emit 所以异步操作前要先看请求是否取消了
      throwIfCancellationRequested(config)

      // Transform response data
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      )

      return response
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config)

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          )
        }
      }

      return Promise.reject(reason)
    }
  )
}
