const removeConsolePlugin = ['@vue/babel-plugin-transform-vue-jsx']
// 生产环境移除console
if(process.env.NODE_ENV === 'production') {
  removeConsolePlugin.push('transform-remove-console')
}
module.exports = {
  plugins: removeConsolePlugin,
  presets: [
    '@vue/app'
  ]
}
