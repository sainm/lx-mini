export default {
  pages: [
    'pages/login/index',
    'pages/register/index',
    'pages/quiz/index',
    'pages/results/index',
    'pages/task-detail/index',
    'pages/task-result/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165DFF',
    navigationBarTitleText: '心理测评',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#165DFF',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/quiz/index',
        text: '任务'
      },
      {
        pagePath: 'pages/results/index',
        text: '结果'
      }
    ]
  }
}
