/**
 * 获取页面元素绝对定位坐标
 * @param target //目标元素
 * @returns {object}
 *
 */
export function offset(target) {
  let top = 0
  let left = 0

  while (target.offsetParent) {
    top += target.offsetTop
    left += target.offsetLeft
    target = target.offsetParent
  }

  return {
    top: top,
    left: left
  }
}

//计算圆心半径坐标
export function mathNum(x1, y1, x2, y2, r) {
  var a = x1 - x2,
    b = y1 - y2,
    c = Math.round(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))),
    _a = Math.round((a * r) / c),
    _b = Math.round((b * r) / c)

  return [x2 + _a, y2 + _b, x1 - _a, y1 - _b]
}

//判断数组中是否有重复值
export function isRepeat(arr) {
  var obj = {}

  for (var i in arr) {
    //存在重复值
    if (obj[arr[i]]) return true

    obj[arr[i]] = true
  }
  //不重复
  return false
}

export function randomRange(t, i) {
  return Math.random() * (i - t) + t
}

//判断字符串中是否有重复值数量
export function isRepeatNum(arr) {
  var obj = {}
  var num = 1
  for (var i in arr) {
    //存在重复值
    if (obj[arr[i]]) num++

    obj[arr[i]] = true
  }
  return num
}

// 数字前面空位补0
export function pad(num, n) {
  var len = num.toString().length

  while (len < n) {
    num = '0' + num

    len++
  }

  return num
}

//随机数的方法              2 3
export function randomNum(startNum,endNum){
  return parseInt(Math.random() * ((endNum+1) - startNum)+startNum);
}