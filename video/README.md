# 视频文件说明

## 重要提示

微信小程序**无法直接播放项目目录中的本地视频文件**。

## 解决方案

### 方案1：使用网络URL（推荐）

1. 将视频文件上传到服务器或云存储
2. 在 `utils/videoManager.js` 中修改配置：
   ```javascript
   const config = {
     useNetworkUrl: true, // 设置为true
     baseUrl: 'https://your-domain.com/video/' // 替换为实际视频服务器地址
   }
   ```
3. 在 `app.json` 中配置合法域名（如果使用自己的服务器）

### 方案2：使用临时文件路径

如果必须使用本地文件，需要通过 `wx.downloadFile` 下载到临时目录。

### 方案3：在开发环境中测试

在微信开发者工具中，可以尝试将视频文件放在 `pages/index/` 目录下，使用相对路径：
- 路径格式：`../../video/video1.mp4`

## 当前配置

当前使用本地路径：`/video/video1.mp4`

如果遇到 `MEDIA_ERR_SRC_NOT_SUPPORTED` 错误，请切换到网络URL方案。

