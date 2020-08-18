const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 环境
// const prod = process.env.NODE_ENV === 'production'
const prod = process.env.VUE_APP_CURRENTMODE === 'prod' || process.env.production
// 开发请求地址
// const BASE_CONFIG_URL = 'http://localhost:9292/'
// const BASE_CONFIG_URL = 'http://192.168.1.202:9292/'
const { BASE_CONFIG_URL } = require('./src/config/urlConfig.js')
module.exports = {
  // 项目部署基础
  // 默认情况下，我们假设你的应用将被部署在域的根目录下,
  // 例如：https://www.my-app.com/
  // 默认：'/'
  // 如果您的应用程序部署在子路径中，则需要在这指定子路径
  // 例如：https://www.foobar.com/my-app/
  // 需要将它改为'/my-app/'
  // 线上演示打包路径： https://file.iviewui.com/admin-dist/
  configureWebpack: (config)=>{
    if(prod){
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: prod ? '/' : '/',
  // 向 CSS 相关的 loader 传递选项
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: !prod,
  // key,value自行定义，比如.set('@@', resolve('src/components'))
  'chainWebpack': config => {
    config.resolve.alias.set('@', resolve('src')).set('_c', resolve('src/components'))
  },
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: prod ? false : true,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    compress: true, //是否压缩
    open: false,
    progress: true, //将运行进度输出到控制台。
    proxy: {
      // 当你请求是以/api开头的时候，则我帮你代理访问到http://localhost:3000
      // 例如：
      // /api/users  http://localhost:3000/api/users
      // 我们真实服务器接口是没有/api的
      '/v1': {
        target: BASE_CONFIG_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/v1': '/'
        }
      }
    }
  }
}
