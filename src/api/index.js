import request from '@/utils/request'
import { AES_encrypt, randomString } from '@/utils/encrypt'
import { getIsCryptData } from '@/utils/auth'

import Site from './site'
import User from './user'
import Lottery from './lottery'
import Player from './player'
import Agent from './agent'
import Pay from './pay'
import Game from './game'

//偏移量 由前端每次请求随机生成 16位
var IV = randomString(16)
//AES加密KEY 由前端自己每次请求随机生成
var KEY = randomString(16)
//公钥固定值
var pkcs8_public =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCt5ugWm2WdqkMI5iDgTmdavYPTp6hmqbopy7N9fNnsNiwEE+toi0XgQjQeuE0Yf7VOIiCI8eWzUaTWfCK3D/dmFTbsTK3Ugql6QuYKRhSn9QnxtEqzvkz5jv3dc3sSav8gK3Ox22DBWUX5LOwY52kBieawlRFckv8vtCOYVPrd+wIDAQAB-----END PUBLIC KEY-----'




export const API = {
  get(url, data) {
    return new Promise((resolve, reject) => {
      const isCryptData = getIsCryptData()
      let enstr = null
      
      data
        ? (enstr = AES_encrypt(JSON.stringify(data), KEY, IV, pkcs8_public))
        : (enstr = null)

      request
        .get(url, { 
          params: isCryptData == 'true' ? {data: enstr} : data
        })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  post(url, json) {
    return new Promise((resolve, reject) => {
      request
        .post(url, json)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**  ============================== 接口 =============================== **/
  ...Site,
  ...User,
  ...Lottery,
  ...Player,
  ...Agent,
  ...Pay,
  ...Game
}
