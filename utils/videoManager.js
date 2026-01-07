// utils/videoManager.js
// 管理视频文件，随机选择视频

/**
 * 配置选项 - 使用GitHub Pages
 * 
 * 配置步骤：
 * 1. 将视频文件上传到GitHub仓库（确保每个文件小于100MB）
 * 2. 在GitHub仓库中启用GitHub Pages
 * 3. 获取GitHub Pages URL（格式：https://your-username.github.io/your-repo-name/）
 * 4. 将 useNetworkUrl 设置为 true
 * 5. 将 baseUrl 设置为你的GitHub Pages地址（以 /video/ 结尾）
 * 
 * 示例：
 * const config = {
 *   useNetworkUrl: true,
 *   baseUrl: 'https://makodesu.github.io/my-video-app/video/'
 * }
 */
const config = {
  useNetworkUrl: true, // 使用GitHub Pages网络URL
  // 使用GitHub Pages（最稳定，推荐）
  baseUrl: 'https://makodesu.github.io/my-video-app/video/'
  // 如果GitHub Pages速度慢，可以尝试jsDelivr CDN（可能有403限制）：
  // baseUrl: 'https://cdn.jsdelivr.net/gh/makodesu/my-video-app@main/video/'
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
  // 文件名可以不带扩展名，代码会自动添加.mp4
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

