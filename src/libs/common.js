import router from '@/router.js'
import crypto from 'crypto-js'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import request from './request'
import APIs from './api.js'
import apiData from './apidata.js'
import { removeCookies } from '@/libs/util.js'


export const isFunction = obj => {
  return typeof (obj) === typeof (() => {})
}

// 编码一次原始密码
export const encodePassword = (origPswd) => {
  return crypto.MD5(origPswd).toString()
}

const apiRequestInternal = (url, method, param, cb, useAPIData) => {  
  // 不是生产环境直接成功，返回测试数据
  // eslint-disable-next-line eqeqeq
  if (process.env.NODE_ENV != 'production' && useAPIData) {
    if (cb) {
      setTimeout(() => {
        if (param && param.response) {
          // eslint-disable-next-line eqeqeq
          cb(param.response.code == 0, param.response.desc, param.response.options)
        } else {
          const data = apiData[url + '_' + method]
          if (isFunction(data)) {
            cb(true, 'ok', data())
          } else {
            cb(true, 'ok', data)
          }
        }
      }, 200)
    }
    return
  }
  if (method === 'GET' && param) { // GET 情况拼接将参数拼接进 url
    url += (url.indexOf('?') === -1) ? '?' : '&' // 已经有 ? 则加 &
    url += 'data='
    url += encodeURIComponent(JSON.stringify(param))
  }
  request({
    url: `${url}`,
    method: method,
    data: param,
  }).then(response => {
    if (response.status !== 200) {
      if (cb) {
        cb(false, response.statusText, undefined)
      }
    } else if (cb) {
      const data = response.data
      if (data.code == 2) {
        removeCookies('token')
        router.push({ path: '/login' })
        cb(false, data.desc, undefined)
      } else {
        cb(data.code === 0 ? true : false, data.desc, data.options)
      }
    }
  }).catch(err => {
    if (cb) {
      cb(false, '请求失败', err)
    }
  })
}

export const standardAPIRequest = (api, param, cb) => {
  apiRequestInternal(api.url, api.method, param, cb, false)
  // apiRequestInternal(api.url, api.method, param, cb, true)
}

export const isEmpty = obj => {
  if (obj === undefined || obj == null) {
    return true
  }

  if (obj === '') {
    return true
  }
  if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
    return true
  }
  if (typeof (obj) === typeof ({})) {
    for (const i in obj) {
      return false
    }
    return true
  }
  return false
}

export const i18n = function(t) {
  // if (isEmpty(vueComponent) || isEmpty(vueComponent.$i18n)) {
  //   return ''
  // }
  let ret = ''
  const length = arguments.length
  for (let i = 1; i < length; i++) {
    ret += t(arguments[i])
  }
  return ret
}

export const checkToken = (cb) => {
  standardAPIRequest(APIs.whoami, null, (ok, _, options) => {
    cb(ok, options)
  })
}

export const showSuccess = (msg) => {
  ElMessage({
    message: msg,
    type: 'success'
  })
}

export const showError = (msg) => {
  ElMessage({
    message: msg,
    type: 'error'
  })
}

export const showInformation = (msg) => {
  ElMessage({
    message: msg
  })
}

export const showConfirm = (tip, title) => {
  return ElMessageBox.confirm(tip, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
}

// 深COPY一个 array 或 object
export const clone = obj => {
  return JSON.parse(JSON.stringify(obj))
}

// 列表上获取唯一的选中项，没有选中或多于一项则提示
export const getSingleSelection = (t, sels, notAlert) => {
  if (sels.length == 0) {
    if (!notAlert) {
      showInformation(i18n(t, 'plzSelOneItem'))
    }
  } else if (sels.length != 1) {
    if (!notAlert) {
      showInformation(i18n(t, 'canSelOneOnly'))
    }
  } else {
    return sels[0]
  }
}

// 列表上获取多个选择项，不选会提示，选的有则返回所有选的结果
export const getSelection = (t, sels, notAlert) => {
  if (sels.length == 0) {
    if (!notAlert) {
      showInformation(i18n(t, 'plzSelOneItemAtLeast'))
    }
    return
  }
  return sels
}

// 根据时间生成订单号
export const generateOrderNumber = () => {
  let orderNumber = ''
  const _date = new Date()
  const _year = _date.getFullYear()
  let _month = _date.getMonth() + 1
  if (_month < 10) _month = '0' + _month
  let _day = _date.getDate()
  if (_day < 10) _dat = '0' + _day
  let _hour = _date.getHours()
  if (_hour < 10) _hour = '0' + _hour
  let _minutes = _date.getMinutes()
  if (_minutes < 10) _minutes = '0' + _minutes
  let _seconds = _date.getSeconds()
  if (_seconds < 10) _seconds = '=' + _seconds
  orderNumber = `${_year}${_month}${_date}${_hour}${_minutes}${_seconds}`
  return orderNumber
}

// 库存数量 显示为 件 => 箱 + 件
export const smallUnitToBigUnit = (count, unit) => {
  const boxCount = Math.floor(count / unit)
  const otherCount = count % unit
  return { boxCount, otherCount }
}
// 入库数量  箱(num1) + 件(num2) => 件(unit)
export const bigUnitToSmallUnit = (num1, num2, unit) => {
  num1 = num1 < 0 ? num1 = 0 : num1
  return num1 * unit + num2
}
// 判断是否是大于0的数字
export const isGreaterZeroNumber = (num) => {
  if (isEmpty(num)) return false
  if (isNumber(_num) && _num > -1) {
    return true
  }
  return false
}
// 判断是否为数字
export const isNumber = (num) => {
  if (isEmpty(num)) return false
  let _num = parseInt(num)
  if (typeof _num === 'number' && !isNaN(_num)) {
    return true
  }
  return false
}
