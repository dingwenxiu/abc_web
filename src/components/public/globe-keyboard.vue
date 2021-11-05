<template>
  <div id="globe-keyboard">

  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss">
/*软键盘*/
#globe-keyboard {
  margin: 0;
  padding: 0;
  list-style: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  padding-top: 2px;
  padding-left: 3px;
  width: 379px;
  height: 146px;
  background: #e5e6ed;
  position: absolute;
  border-radius: 5px 5px;
  box-shadow: #747578 3px 3px 10px;
  z-index: 300;
}

#globe-keyboard li {
  float: left;
  margin: 0 2px 2px 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  background: #fff;
  border: 1px solid #f9f9f9;
  border-radius: 5px;
}

.row-2,
.row-3,
.row-4 {
  clear: left;
}

#globe-keyboard .delete {
  width: 35px;
}

#globe-keyboard .capslock {
  width: 55px;
}

#globe-keyboard .right-shift {
  width: 45px;
}

#globe-keyboard .cancel {
  width: 45px;
}

#globe-keyboard .submit {
  width: 45px;
}

.lastitem {
  margin-right: 0;
}

.uppercase {
  text-transform: uppercase;
}

#globe-keyboard .caps-active {
  background-color: #ccc;
}

#globe-keyboard .shift-active {
  background-color: #ccc;
}

#globe-keyboard .space {
  clear: left;
  width: 276px;
}

.on {
  display: none;
}

#globe-keyboard li:hover {
  position: relative;
  top: 1px;
  left: 1px;
  border-color: #e5e5e5;
  cursor: pointer;
  background-color: #d9ffed;
}

.key-logo {
  display: inline-block;
  width: 24px;
  height: 16px;
  background: url("keyboard-off.png") no-repeat;
  position: relative;
  top: 4px;
  left: 2px;
  cursor: pointer;
}

.key-active {
  background: url("keyboard-on.png") no-repeat;
}
</style>