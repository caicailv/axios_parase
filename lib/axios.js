'use strict'

var utils = require('./utils')
var bind = require('./helpers/bind')
var Axios = require('./core/Axios')
var mergeConfig = require('./core/mergeConfig')
var defaults = require('./defaults')
/**
 * Create an instance of Axios 创建axios实例
 *
 * @param {Object} defaultConfig The default config for the instance 实例的默认配置
 * @return {Axios} A new instance of Axios Axios的一个新实例
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig) // 使用默认值创建axios
  var instance = bind(Axios.prototype.request, context)

  // Copy axios.prototype to instance 将axios.prototype复制到实例
  utils.extend(instance, Axios.prototype, context)

  // Copy context to instance
  utils.extend(instance, context)

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig))
  }

  return instance
}

// Create the default instance to be exported
var axios = createInstance(defaults)

// Expose Axios class to allow class inheritance
axios.Axios = Axios

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel')
axios.CancelToken = require('./cancel/CancelToken')
axios.isCancel = require('./cancel/isCancel')
axios.VERSION = require('./env/data').version

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = require('./helpers/spread')

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError')

module.exports = axios

// Allow use of default import syntax in TypeScript
//允许在TypeScript中使用默认导入语法
module.exports.default = axios
