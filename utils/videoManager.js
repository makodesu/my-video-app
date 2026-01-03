// utils/videoManager.js
// 管理视频文件，随机选择视频

/**
 * 配置选项
 * useNetworkUrl: 是否使用网络URL（true=网络URL, false=本地路径）
 * baseUrl: 网络URL的基础地址（如果useNetworkUrl为true时使用）
 * 
 * 使用网络URL的步骤：
 * 1. 将视频文件上传到云存储（推荐：腾讯云COS、阿里云OSS、七牛云等）
 * 2. 获取视频文件的访问URL
 * 3. 将 useNetworkUrl 设置为 true
 * 4. 将 baseUrl 设置为你的视频服务器地址（以 / 结尾）
 * 5. 在微信公众平台配置合法域名（正式环境需要）
 * 
 * 示例：
 * const config = {
 *   useNetworkUrl: true,
 *   baseUrl: 'https://your-bucket.cos.ap-guangzhou.myqcloud.com/'
 * }
 */
const config = {
  useNetworkUrl: false, // 设置为true使用网络URL，false使用本地路径
  baseUrl: 'https://your-domain.com/video/' // 网络URL的基础地址，请替换为实际地址
  // 示例：'https://your-bucket.cos.ap-guangzhou.myqcloud.com/'
  // 示例：'https://your-server.com/video/'
}

/**
 * 视频文件列表
 * 将视频文件放在根目录的video文件夹下，在这里添加视频文件名
 * 支持带扩展名和不带扩展名的文件名
 */
const videoList = [
  'video1',
  'video2',
  'video3'
  // 可以继续添加更多视频文件
  // 如果文件名有扩展名，请包含扩展名，如：'video1.mp4'
]

/**
 * 随机选择一个视频
 * @returns {string} 视频的路径（本地路径或网络URL）
 */
function getRandomVideo() {
  if (videoList.length === 0) {
    return '' // 如果没有视频，返回空字符串
  }
  
  const randomIndex = Math.floor(Math.random() * videoList.length)
  let videoFileName = videoList[randomIndex]
  
  // 如果文件名没有扩展名，自动添加.mp4
  if (!videoFileName.includes('.')) {
    videoFileName = videoFileName + '.mp4'
  }
  
  // 根据配置返回网络URL或本地路径
  if (config.useNetworkUrl) {
    // 使用网络URL（需要在app.json中配置合法域名）
    return config.baseUrl + videoFileName
  } else {
    // 使用本地路径
    // 注意：小程序通常无法直接播放项目目录中的视频文件
    // 如果遇到 MEDIA_ERR_SRC_NOT_SUPPORTED 错误，请使用网络URL方案
    // 尝试使用绝对路径（从项目根目录）
    return `/video/${videoFileName}`
  }
}

/**
 * 获取所有视频列表
 * @returns {Array} 视频文件名数组
 */
function getAllVideos() {
  return videoList
}

/**
 * 添加视频到列表
 * @param {string} videoFileName - 视频文件名
 */
function addVideo(videoFileName) {
  if (!videoList.includes(videoFileName)) {
    videoList.push(videoFileName)
  }
}

module.exports = {
  getRandomVideo,
  getAllVideos,
  addVideo
}

