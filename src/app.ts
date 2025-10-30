import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './app.scss'
// 导入自定义的 taro-ui 样式文件（按需导入，避免路径问题）
import './styles/taro-ui.scss'

const App = createApp({
  onShow(options) {
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

export default App
