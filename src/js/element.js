import '../css/style.css'
import '../css/title.less'
import '../css/image.css'
import '../font/iconfont.css'

import img from '../img/test.png'
const divEl = document.createElement('div')
divEl.className = 'title'
divEl.innerHTML = '你好'
document.body.appendChild(divEl)

// background
const bgDivEl = document.createElement('div')
bgDivEl.className = 'image-bg'

document.body.appendChild(bgDivEl)

// src
const imageEl = document.createElement('img')
imageEl.src= img
document.body.appendChild(imageEl)

// i元素
const iEl = document.createElement('i')
iEl.className = 'iconfont icondaochu'
document.body.appendChild(iEl)

console.log(21)
