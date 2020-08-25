
// 配置相关
/**
 *  网站根目录地址 （生产环境，测试环境, 开发环境）
 */
// const proURL = ''; // 正式环境
const devURL = 'http://127.0.0.1:8082/'; // 开发环境ip
const testURL = 'http://121.89.172.245:8082/'; // 测试环境域名
const proURL = 'http://39.101.216.84:8082/'; // 正式环境域名

const env = process.env.NODE_ENV;
// const BASE_CONFIG_URL =  env === 'production' ? proURL : env === 'test' ? testURL : devURL;
let BASE_CONFIG_URL;
if (env == 'development') {
  BASE_CONFIG_URL = devURL;
} else if (process.env.VUE_APP_CURRENTMODE === 'dev' ) {
  BASE_CONFIG_URL = devURL;
} else if (process.env.VUE_APP_CURRENTMODE === 'test' || env === 'test') {
  BASE_CONFIG_URL = testURL;
} else if (process.env.VUE_APP_CURRENTMODE === 'prod' ) {
  BASE_CONFIG_URL = proURL;
} else if (process.env.VUE_APP_CURRENTMODE === 'production') {
  BASE_CONFIG_URL = proURL;
} else if (env === 'production') {
  BASE_CONFIG_URL = proURL;
}
module.exports = { BASE_CONFIG_URL };

// 打包开发环境  npm run build-dev
// 打包测试环境  npm run build-test
// 打包正式环境  npm run build  ||  npm run build-prod
