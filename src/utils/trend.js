import { isRepeat } from './index'
// 是否是对子
export function isPair(data) {
  return isRepeat(data.split(''))
}