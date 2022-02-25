export const clearLocalStorage = () => {
  localStorage.clear()
}

export const localSet = (key, value) => {
  if (typeof (value) === 'string') {
    localStorage.setItem(key, value)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const localGet = (key) => {
  const val = localStorage.getItem(key)
  if (val) {
    try {
      return JSON.parse(val)
    // eslint-disable-next-line no-empty
    } catch (err) { }
    return val
  }
  return undefined
}

export const localRemove = (key) => {
  localStorage.removeItem(key)
}

export const setCookies = (obj, limitTime=1) => {
  let data = new Date( new Date().getTime() + limitTime*24*60*60*1000 ).toUTCString()
  for(let i in obj) {
    document.cookie = i + '=' + obj[i] + ';expires=' + data
  }
}

export const getCookies = (cookieName) => {
  let re = new RegExp("\s?" + cookieName + "=([^;]+)(;|$)")
  let _cookie = document.cookie.match(re)
  if (_cookie) {
    return _cookie[1]
  } else {
    return ''
  }
}

export const removeCookies = (cookieList) => {
  let data = new Date(new Date().getTime() - 24*60*60*1000).toUTCString()
  for(let i in cookieList) {
    document.cookie = cookieList[i] + '= ;' + 'expires=' + data
  }
}
/**
 * @description 本地存储和获取标签导航列表
 */

export const setTagNavListInLocalstorage = list => {
  localSet('navigatorTags', list || [])
}

export const getTagNavListFromLocalstorage = () => {
  const tags = localGet('navigatorTags')
  return tags || []
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  const newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta, title: meta.title })
  return newList
}
