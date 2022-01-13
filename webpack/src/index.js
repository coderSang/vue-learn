import { sum } from './js/math'
const { priceFormat } = require('./js/format')
import { createApp } from 'vue'
import axios from 'axios'

import App from './vue/app.vue'
import '@/js/element.js'

if (module.hot) {
  module.hot.accept("./js/element.js", () => {
    console.log("element热更新")
  })
}

console.log(sum(20,30))
console.log(priceFormat())
const app = createApp(App)
app.mount('#app')
axios.get('/api/abc').then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})

