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
    color: '#86909c',
    selectedColor: '#165DFF',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/quiz/index',
        text: '测评任务'
      },
      {
        pagePath: 'pages/results/index',
        text: '测评报告'
      }
    ]
  }
}
