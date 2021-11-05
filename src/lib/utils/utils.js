let Utils = {
  // 设置缓存
  storage: {
    set(key, value, expiration = 0) {
      let obj = {}
      obj.data = value
      obj.setTime = new Date().getTime()
      if (expiration) {
        obj.expiration = 60 * 60 * (24 * expiration)
      }
      localStorage.setItem(key, JSON.stringify(obj))
    },
    get(key) {
      let [
        item = JSON.parse(localStorage.getItem(key)),
        exp = null,
        nowTime = new Date().getTime()
      ] = []
      if (item) {
        if (item.data && item.data.expires_in) {
          exp = item.data.expires_in
        } else if (item.expiration) {
          exp = item.expiration
        }
        if (exp && nowTime - item.setTime > exp * 1000) {
          localStorage.removeItem(key)
          return false
        }
      }
      return item
    },
    remove(key) {
      localStorage.removeItem(key)
    }
  },
  // 去除字符串中所有空格
  removeAllSpace(str) {
    return str.replace(/\s+/g, '')
  },
  trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, '')
  },
  // 去除字符串换行
  removeLineFeed(str) {
    return str.replace(/[\n]/g, '')
  },
  // 限制 只输入数字 包括不能输入字符和小数点
  number(str, float = false) {
    // float = true 可以输入小数点
    if (float) {
      return str.replace(/[^\d.]/g, '').replace(/^0{1,}/g, '')
    } else {
      return str.replace(/[^\d]/g, '').replace(/^0{1,}/g, '')
    }
  },
  // 是否包含汉字
  checkIsChinese(val) {
    let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    if (reg.test(val)) {
      return true
    }
  },
  /*
   * 显示小数点后面几位
   * str 字符串
   * num 显示几个小数点
   */
  toFixed(str, num = 3) {
    if (isNaN(str)) {
      return 0
    }
    if (String(str).indexOf('.') > -1) {
      let zeo = ''
      for (
        let i = 0;
        i <
        num -
          String(str).substr(String(str).lastIndexOf('.') + 1, str.length)
            .length;
        i++
      ) {
        zeo += '0'
      }
      return String(str).substr(0, String(str).lastIndexOf('.') + num + 1) + zeo
    } else {
      let zeo = ''
      for (let i = 0; i < num; i++) {
        zeo += '0'
      }
      return String(str) + '.' + zeo
    }
  },
  // 将剩余秒数转换成倒计时
  formatSeconds(value) {
    let secondTime = parseInt(value)
    let minuteTime = 0
    let hourTime = 0
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60)
      secondTime = parseInt(secondTime % 60)
      if (minuteTime > 60) {
        hourTime = parseInt(minuteTime / 60)
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    if (secondTime < 10) {
      secondTime = '0' + parseInt(secondTime)
    }
    if (minuteTime < 10) {
      minuteTime = '0' + parseInt(minuteTime)
    }
    if (hourTime < 10) {
      hourTime = '0' + parseInt(hourTime)
    }
    return hourTime + ':' + minuteTime + ':' + secondTime
  },
  // obj 传入时间  返回 yyyy-mm-dd
  formatTime(obj, format = 'YYYY-MM-DD') {
    let date = new Date(obj)
    let date2 = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    if (date2[1] < 10) {
      date2[1] = '0' + date2[1]
    }
    if (date2[2] < 10) {
      date2[2] = '0' + date2[2]
    }
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    let dateDay = date2.join('-')
    if (format === 'YYYYMMDD') {
      return date2.join('')
    } else if (format === 'YYYY-MM-DD') {
      return dateDay
    } else if (format === 'HH:MM:SS') {
      return hours + ':' + minutes + ':' + seconds
    } else if (format === 'YYYY-MM-DD HH:MM:SS') {
      return dateDay + ' ' + hours + ':' + minutes + ':' + seconds
    } if (format === 'YYYY年MM月DD日 HH点') {
      return date.getFullYear()+'年' + date.getMonth()+1 +'月'+ date.getDate()+'日' +''+hours+'点'
    }
  },
  // 处理文本中img请求头
  setImg(str, url) {
    let imgReg = /<img.*?(?:>|\/>)/gi
    // eslint-disable-next-line no-useless-escape
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
    let arr = str.match(imgReg)
    let st = str
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        let src = arr[i].match(srcReg)
          st = st.replace(src[1], url + src[1])
      }
    }
    return st
  },
  // 计算农历
  newYear() {
    let CalendarData = new Array(100);
    let madd = new Array(12);
    let tgString = '甲乙丙丁戊己庚辛壬癸';
    let dzString = '子丑寅卯辰巳午未申酉戌亥';
    let numString = '一二三四五六七八九十';
    let monString = '正二三四五六七八九十冬腊';
    let weekString = '日一二三四五六';
    let sx= '鼠牛虎兔龙蛇马羊猴鸡狗猪';
    let cYear,cMonth,cDay,TheDate;
    CalendarData = [0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5,0xB54,0xB6A,0x612DA,0x95B,0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95];
    madd[0] = 0;
    madd[1] = 31;
    madd[2] = 59;
    madd[3] = 90;
    madd[4] = 120;
    madd[5] = 151;
    madd[6] = 181;
    madd[7] = 212;
    madd[8] = 243;
    madd[9] = 273;
    madd[10] = 304;
    madd[11] = 334;

    /**
     * @return {number}
     */
    function GetBit(m,n){
      return (m >> n) & 1;
    }
    function e2c() {
      TheDate = (arguments.length !== 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
      var total, m, n, k;
      let isEnd = false;
      let tmp = TheDate.getYear();
      if (tmp < 1900) {
        tmp += 1900;
      }
      total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

      if (TheDate.getYear() % 4 === 0 && TheDate.getMonth() > 1) {
        total++;
      }
      for (m = 0; ; m++) {
        k = (CalendarData[m] < 0xfff) ? 11 : 12;
        for (n = k; n >= 0; n--) {
          if (total <= 29 + GetBit(CalendarData[m], n)) {
            isEnd = true;
            break;
          }
          total = total - 29 - GetBit(CalendarData[m], n);
        }
        if (isEnd) break;
      }
      cYear = 1921 + m;
      cMonth = k - n + 1;
      cDay = total;
      if (k == 12) {
        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
          cMonth = 1 - cMonth;
        }
        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
          cMonth--;
        }
      }
    }

    function GetcDateString() {
      var tmp = "";
      tmp += tgString.charAt((cYear - 4) % 10);
      tmp += dzString.charAt((cYear - 4) % 12);
      tmp += "(";
      tmp += sx.charAt((cYear - 4) % 12);
      tmp += ")年 ";
      if (cMonth < 1) {
        tmp += "(闰)";
        tmp += monString.charAt(-cMonth - 1);
      } else {
        tmp += monString.charAt(cMonth - 1);
      }
      tmp += "月";
      tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
      if (cDay % 10 != 0 || cDay == 10) {
        tmp += numString.charAt((cDay - 1) % 10);
      }
      return tmp;
    }

    function GetLunarDay(solarYear,solarMonth,solarDay) {
//solarYear = solarYear<1900?(1900+solarYear):solarYear;
      if (solarYear < 1921 || solarYear > 2020) {
        return "";
      } else {
        solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
        e2c(solarYear, solarMonth, solarDay);
        return GetcDateString();
      }
    }

    var D = new Date();
    var yy = D.getFullYear();
    var mm = D.getMonth()+1;
    var dd = D.getDate();
    var ww = D.getDay();
    var ss = parseInt(D.getTime() / 1000);
    if (yy < 100) yy = '19' + yy;

   return GetLunarDay(yy,mm,dd);
  }
}
export default Utils
