import Cookies from 'js-cookie'
const TokenKey = 'Auth-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, date) {
  return Cookies.set(TokenKey, token, { expires: date && new Date(date) })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 保存是否加密
export function setIsCryptData(data) {
  return Cookies.set('Is-CryptData', data)
}

export function getIsCryptData() {
  return Cookies.get('Is-CryptData')
}


//密码加密
export function pswdEncode(password) {
  const head = Math.random().toString(36).slice(2, 7);
  const floor = Math.random().toString(36).slice(2, 6);
  return window.btoa(`${window.btoa(head + password)}${floor}`);
}