import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
import path from 'path'
import dotenv from 'dotenv'

// 加载环境变量
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: path.resolve(__dirname, '..', envFile) })

console.log('=== 加载环境配置 ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('环境文件:', envFile)
console.log('API_BASE_URL:', process.env.TARO_APP_API_BASE_URL)
console.log('===================')

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, { command, mode }) => {
  // 环境变量配置
  const isProduction = process.env.NODE_ENV === 'production'

  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'lx-mini',
    date: '2025-10-21',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.TARO_APP_API_BASE_URL': JSON.stringify(
        process.env.TARO_APP_API_BASE_URL || 'http://localhost:3000'  // 👈 修改这里的默认地址
      ),
      'process.env.TARO_APP_REQUEST_TIMEOUT': JSON.stringify(
        process.env.TARO_APP_REQUEST_TIMEOUT || '10000'
      ),
      'process.env.TARO_APP_USE_MOCK': JSON.stringify(
        process.env.TARO_APP_USE_MOCK || 'false'
      ),
      'process.env.TARO_APP_DEBUG': JSON.stringify(
        process.env.TARO_APP_DEBUG || (!isProduction).toString()
      ),
    },
    copy: {
      patterns: [
        {
          from: 'src/assets',
          to: 'dist/assets'
        }
      ],
      options: {
      }
    },
    framework: 'vue3',
    compiler: 'vite',
    alias: {
      '@': path.resolve(__dirname, '..', 'src')
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
