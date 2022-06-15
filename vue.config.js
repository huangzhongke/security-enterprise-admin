/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
  },
  // 默认打开eslint效验，如果需要关闭，设置成false即可
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 8001,
    overlay: {
      errors: true,
      warnings: true
    }
  }
}
