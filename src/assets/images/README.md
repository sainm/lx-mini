# 图片资源目录

此目录用于存放项目中使用的图片资源。

## 📁 文件说明

### logo.png
- **用途**: 应用Logo，显示在登录页等位置
- **建议尺寸**: 512x512px 或更高（正方形）
- **格式**: PNG（支持透明背景）
- **注意**: 文件大小建议控制在 100KB 以内

## 🎨 图片使用指南

### 在页面中引用图片

**方法1: 使用根路径（推荐，适用于小程序）**
```vue
<image src="/assets/images/logo.png" mode="aspectFill" />
```

**方法2: 使用 @ 别名（需要配置）**
```vue
<image src="@/assets/images/logo.png" mode="aspectFill" />
```

**方法3: 使用相对路径**
```vue
<image src="../../assets/images/logo.png" mode="aspectFill" />
```

**方法4: 在 script 中引入（动态导入）**
```vue
<script setup>
import logoImg from '@/assets/images/logo.png'
</script>

<template>
  <image :src="logoImg" mode="aspectFill" />
</template>
```

## 📏 尺寸建议

| 图片类型 | 建议尺寸 | 用途 |
|---------|---------|------|
| Logo | 512x512px | 应用图标、登录页 |
| 封面图 | 750x420px | 任务封面、banner |
| 头像 | 200x200px | 用户头像 |
| 缩略图 | 120x120px | 列表缩略图 |

## ⚠️ 注意事项

1. **文件命名**: 使用小写字母和连字符，如 `logo.png`、`task-cover.png`
2. **文件大小**: 图片尽量压缩，单个文件建议不超过 200KB
3. **格式选择**: 
   - PNG: 需要透明背景时使用
   - JPG: 照片、封面图等
   - WebP: 更小的文件大小（需确保兼容性）
4. **微信小程序限制**: 小程序包大小有限制，建议将大图放在服务器，使用网络图片

