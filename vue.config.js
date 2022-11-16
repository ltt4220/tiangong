const version = new Date().getTime();
const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { chunk } = require('lodash');
const { serveConfig } = require('./src/utils/config.serve.js');
const isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  /**
   * outputDir      当运行 vue - cli - service build 时生成的生产环境构建文件的目录。
   *                注意目标目录在构建之前会被清除(构建时传入--no - clean 可关闭该行为)。
   * assetsDir      放置生成的静态资源(js、 css、 img、 fonts) 的(相对于 outputDir 的) 目录。
   * productionSourceMap  生产环境下关闭sourcemap，
   *                      注意——— 当系统设置了环境变量时，
   *                      需结合NODE_ENV、production模式配置文件，才生效
   * css:
   *    extract     Default: 生产环境下是 true，开发环境下是 false
   *                是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
   *                提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容。
   *                这里设置为false，节省网络请求
   */
  publicPath:'/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  runtimeCompiler: true,
  css: {
    extract: isProduction ? { ignoreOrder: true } : false,
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: [resolve('src/assets/icons')],
          options: {
            symbolId: 'icon-[name]'
          }
        }
      ]
    },
    plugins: [
      new CompressionPlugin({
        test: /\.(js|css|html|json)?$/,
        filename: "[path].gz[query]",
        threshold: 10240,
        algorithm: "gzip"
        // deleteOriginalAssets: false
      }),
      new webpack.DefinePlugin({
        'process.env': {
          BASE_API: '"/api"',
          NODE_ENV: 'production'
        }
      })
    ]
  },
  // 对js文件进行 hash 以便更好的控制缓存
  chainWebpack(config) {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end();
    config.output.filename('[contenthash:6].js').end();//webpack版本 5.73适用

    config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin());
    if (process.env.use_analyzer) { // 添加分析工具
      config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    if (isProduction) {
      config.optimization.splitChunks({
        chunks: "all",
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 5,
        cacheGroups: {
          vue: {
            test: /[\\/]node_modules[\\/](vue)[\\/]/,
            name: "vue",
            priority: 2
          },
          router: {
            test: /[\\/]node_modules[\\/](vue-router)[\\/]/,
            name: "vue-router",
            priority: 2
          },
          aliOss: {
            name: 'chunk-ali-oss',
            test: /[\\/]node_modules[\\/](ali-oss)[\\/]/,
            priority: 2,
          },
          three: {
            name: 'chunk-three',
            test: /[\\/]node_modules[\\/](three)[\\/]/,
            priority: 2,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: 'async',
            // reuseExistingChunk: true
          }
        }
      })
    }
  },
  lintOnSave: false,
  devServer: {
    /**
     * hot          Enable webpack's Hot Module Replacement feature
     *              如果开启， 则不需要在webpackConfig中添加 HotModuleReplacementPlugin
     * open         是否自动启动浏览器，默认false
     * compress     Enable gzip compression for everything served
     * proxy        Proxying some URLs can be useful
     *              when you have a separate API backend development server
     *              and you want to send API requests on the same domain
     * quiet        necessary for FriendlyErrorsPlugin
     */
    hot: true,
    open: false,
    compress: true,
    proxy: {
      '/api/proxy': {
        target: serveConfig.apiUrl,
        bypass: function (req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return 'index.html';
          }
        },
        changOrigin:true,
        pathRewrite: {
          '^/api/proxy': ''
        }
      },
      '/api/gateway': {
        target: serveConfig.gateway,
        bypass: function (req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return 'index.html';
          }
        },
        changOrigin:true,
        pathRewrite: {
          '^/api/gateway': ''
        }
      },
      '/api/getCaptchaUrl': {
        target:  serveConfig.getCaptchaUrl,
        bypass: function (req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return 'index.html';
          }
        },
        changOrigin:true,
        pathRewrite: {
          '^/api/getCaptchaUrl': ''
        }
      },
      '/api/getstore': {
        target: serveConfig.mdUrl,
        bypass: function (req) {
          if (req.headers.accept.indexOf('html') !== -1) {
            return 'index.html';
          }
        },
        changeOrigin: true,
        pathRewrite: {
          '^/api/getstore': ''
        }
      },
    }
  },
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  }
}
