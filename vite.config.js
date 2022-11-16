import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import commojs from 'vite-plugin-commonjs'
import { cjs2esmVitePlugin } from 'cjs2esmodule'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import { createHtmlPlugin } from 'vite-plugin-html'
const { serveConfig } = require('./src/utils/config.serve');
function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir)
}
function replacement(variable, idx, path) {
  const condition = {
    '@/': pathResolve('src') + '/',
    '~@': pathResolve('src'),
    '@dbms': pathResolve('src/modules/dbms'),
    '@report': pathResolve('src/modules/report'),
    '@vrreport': pathResolve('src/modules/vrreport'),
    '@casetf': pathResolve('src/modules/casetf'),
    '~': pathResolve('node_modules') + '/'
  }
  return condition[variable]
}
export default defineConfig({
  publicDir: pathResolve('public'),
  define: {
    'process.env': {
      VUE_APP_MODE: false,
      BASE_URL: '/'
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // additionalData: `@import "./src/assets/style/variables.less";`//重写UI样式
      }
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.vue', '.jsx'],
    alias: [
      {
        find: /(^@\/|^~@|^~)/,
        replacement
      }
    ]
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api/proxy': {
        target: serveConfig.apiUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/proxy', '')
      },
      '/api/gateway': {
        target: serveConfig.gateway,
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/gateway', '')
      },
      '/api/getCaptchaUrl': {
        target: serveConfig.getCaptchaUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/getCaptchaUrl', '')
      },
      '/api/getstore': {
        target: serveConfig.mdUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/getstore', '')
      },
    }
  },
  plugins: [
    createVuePlugin({ jsx: true }),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.js',
      template: 'public/index.html'
    }),
    styleImport({
      resolves: [VantResolve()],
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: name => `./vant/es/${name}/style/index`
        }
      ]
    }),
    commojs(),
    cjs2esmVitePlugin()
  ]
})
