/* eslint-disable */
let animation = {
    // 中奖排行榜ranking('meque', 'meque_text', -1)
    ranking (meques, text, speed) {
        let [
            mequeText = document.getElementById(text),
            meque = document.getElementById(meques),
            timer = null
        ] = []
        if (parseInt(this.getStyle(mequeText, 'height')) < parseInt(this.getStyle(meque, 'height'))) {
            return false
        }
        mequeText.innerHTML = mequeText.innerHTML + mequeText.innerHTML
        clearInterval(timer)
        timer = setInterval(notice, 40)
        notice()
        function notice () {
            if (mequeText.offsetTop < -mequeText.offsetHeight / 2) {
                mequeText.style.top = 0
            }
            mequeText.style.top = mequeText.offsetTop + speed +'px'
        }
        mequeText.onmouseover = function () {
            clearInterval(timer)
        }
        mequeText.onmouseout = function () {
            timer = setInterval(notice, 40)
        }
        mequeText.onmousedown = function (ev) {
            var ev = ev || window.event
            var disY = ev.clientY - this.offsetTop
            mequeText.onmousemove = function (ev) {
                var ev = ev || window.event
                mequeText.style.top = ev.clientY - disY + 'px'
            }
            document.onmouseup = function () {
                mequeText.onmousemove = null
            }
        }
    },
    // 滚动公告  notice('meque', 'meque_text', -1)
    // #head-meque {
    //   position: relative;
    //   left: 6px;
    //   height: 34px;
    //   overflow: hidden;
    // }
    // #head-meque_text {
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   white-space: nowrap;
    //   cursor: pointer;
    //   line-height: 35px;
    // }
    // .meque_text_content{
    //     float:left;
    //     min-width:60px;
    //     padding-right:25px;
    //   }

    notice (meques, text, speed) {
        let [
            mequeText = document.getElementById(text),
            meque = document.getElementById(meques),
            timer = null
        ] = []
        if (mequeText.children && mequeText.children.length > 0) {
            let children = mequeText.children
            let width = 0;
            for (let i = 0; i < children.length; i++) {
                width += parseInt(this.getStyle(children[i], 'width'))
            }
            if (parseInt(this.getStyle(children[0], 'paddingRight')) > 0) {

                mequeText.style.width = (parseInt(this.getStyle(children[0], 'paddingRight')) * children.length) + width + 'px'
            } else if (parseInt(this.getStyle(children[0], 'marginRight')) > 0) {

                mequeText.style.width = (parseInt(this.getStyle(children[0], 'marginRight')) * children.length) + width + 'px'
            }
        }
        if (parseInt(this.getStyle(mequeText, 'width')) < parseInt(this.getStyle(meque, 'width'))) {
            return false
        }
        mequeText.style.left = meque.offsetWidth + 'px'
        clearInterval(timer)
        timer = setInterval(notice, 20)
        notice()
        function notice () {
            if (mequeText.offsetLeft < -mequeText.offsetWidth) {
                mequeText.style.left = meque.offsetWidth + 'px'
            }
            mequeText.style.left = mequeText.offsetLeft + speed +'px'
        }
        mequeText.onmouseover = function () {
            clearInterval(timer)
        }
        mequeText.onmouseout = function () {
            timer = setInterval(notice, 20)
        }
        mequeText.onmousedown = function (ev) {
            var ev = ev || window.event
            var disX = ev.clientX - this.offsetLeft
            mequeText.onmousemove = function (ev) {
                var ev = ev || window.event
                mequeText.style.left = ev.clientX - disX + 'px'
            }
            document.onmouseup = function () {
                mequeText.onmousemove = null
            }
        }
    },
    // 移动动画
    move (obj, json, speed, fn) {
        clearInterval(obj.timer)
        obj.timer = setInterval(() => {
            let mStop = true /*当所有的值都到达*/
            for (let attr in json) {/*取当前值*/
                let com = 0
                if (attr === 'opacity') {
                    com = parseInt(parseFloat(this.getStyle(obj, attr)) * 100)
                } else {
                    com = parseInt(this.getStyle(obj, attr))
                }/*计算速度*/
                let iSpeed = (json[attr] - com) / speed
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed)/*检测*/
                if (com !== json[attr]) {
                    mStop = false
                }
                if (attr === 'opacity') {
                    obj.style.filter = 'alpha(opacity:' + (com + iSpeed) + ')'
                    obj.style.opacity = (com + iSpeed) / 100
                } else {
                    obj.style[attr] = com + iSpeed + 'px'
                }
            }
            if (mStop) {
                clearInterval(obj.timer)
                if (fn) {
                    fn()
                }
            }
        }, 10)
    },
    /*
    * 获取属性兼容ie，current
    */
    getStyle (obj,attr) {
        if (obj) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr]
            } else {
                return getComputedStyle(obj, false)[attr]
            }
        }
        
    },
    // 全屏幕宽
    screenWidth (obj) {
        obj.style.width =  document.body.clientWidth + 'px'
        obj.style.left = '-' + obj.getBoundingClientRect().left + 'px'
    }
}

export default animation
