#!/usr/bin/env node

/**
 * 环境配置脚本
 * 快速创建环境变量文件
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const envFiles = {
  development: '.env.development',
  production: '.env.production',
  test: '.env.test'
}

const templates = {
  development: `# 开发环境配置
NODE_ENV=development

# API 基础地址
TARO_APP_API_BASE_URL=http://localhost:3000

# API 超时时间（毫秒）
TARO_APP_REQUEST_TIMEOUT=10000

# 是否开启 Mock 数据
TARO_APP_USE_MOCK=true

# 是否开启调试模式
TARO_APP_DEBUG=true
`,
  production: `# 生产环境配置
NODE_ENV=production

# API 基础地址（请修改为实际的生产环境地址）
TARO_APP_API_BASE_URL=https://api.your-domain.com

# API 超时时间（毫秒）
TARO_APP_REQUEST_TIMEOUT=15000

# 是否开启 Mock 数据
TARO_APP_USE_MOCK=false

# 是否开启调试模式
TARO_APP_DEBUG=false
`,
  test: `# 测试环境配置
NODE_ENV=test

# API 基础地址（测试服务器地址）
TARO_APP_API_BASE_URL=https://test-api.your-domain.com

# API 超时时间（毫秒）
TARO_APP_REQUEST_TIMEOUT=10000

# 是否开启 Mock 数据
TARO_APP_USE_MOCK=false

# 是否开启调试模式
TARO_APP_DEBUG=true
`
}

console.log('==========================================')
console.log('   心理评测小程序 - 环境配置向导')
console.log('==========================================\n')

function createEnvFile(env, apiUrl = null) {
  const filename = envFiles[env]
  const filepath = path.resolve(__dirname, '..', filename)

  if (fs.existsSync(filepath)) {
    console.log(`⚠️  ${filename} 已存在，跳过创建`)
    return false
  }

  let content = templates[env]

  // 如果提供了自定义 API 地址，替换模板中的地址
  if (apiUrl) {
    content = content.replace(/TARO_APP_API_BASE_URL=.*/, `TARO_APP_API_BASE_URL=${apiUrl}`)
  }

  fs.writeFileSync(filepath, content, 'utf8')
  console.log(`✅ 创建成功：${filename}`)
  return true
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function setup() {
  console.log('请选择要创建的环境配置：\n')
  console.log('1. 开发环境 (使用 Mock 数据，无需后端)')
  console.log('2. 开发环境 (连接真实后端 API)')
  console.log('3. 全部环境 (开发 + 生产 + 测试)')
  console.log('0. 退出\n')

  const choice = await askQuestion('请输入选项 [1-3, 0]: ')

  console.log('')

  switch (choice) {
    case '1':
      // 开发环境 Mock
      createEnvFile('development')
      console.log('\n✨ 配置完成！')
      console.log('\n📝 使用说明：')
      console.log('   1. 运行: pnpm dev:weapp')
      console.log('   2. 使用测试账号登录: test / 123456')
      console.log('   3. 体验完整功能（使用 Mock 数据）\n')
      break

    case '2':
      // 开发环境 真实 API
      console.log('请输入后端 API 地址（例如: http://localhost:8080）')
      const apiUrl = await askQuestion('API 地址: ')

      if (!apiUrl) {
        console.log('❌ API 地址不能为空')
        break
      }

      createEnvFile('development', apiUrl)

      // 修改 Mock 配置
      const devFile = path.resolve(__dirname, '..', '.env.development')
      let content = fs.readFileSync(devFile, 'utf8')
      content = content.replace('TARO_APP_USE_MOCK=true', 'TARO_APP_USE_MOCK=false')
      fs.writeFileSync(devFile, content, 'utf8')

      console.log('\n✨ 配置完成！')
      console.log('\n📝 使用说明：')
      console.log(`   1. 确保后端服务运行在: ${apiUrl}`)
      console.log('   2. 运行: pnpm dev:weapp')
      console.log('   3. 使用真实账号登录测试\n')
      break

    case '3':
      // 全部环境
      createEnvFile('development')
      createEnvFile('production')
      createEnvFile('test')

      console.log('\n✨ 配置完成！')
      console.log('\n📝 下一步：')
      console.log('   1. 编辑 .env.production 修改生产环境 API 地址')
      console.log('   2. 编辑 .env.test 修改测试环境 API 地址（可选）')
      console.log('   3. 运行: pnpm dev:weapp\n')
      break

    case '0':
      console.log('👋 再见！\n')
      break

    default:
      console.log('❌ 无效的选项\n')
  }

  rl.close()
}

setup().catch(console.error)

