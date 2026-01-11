// utils/scoreManager.js
// 积分管理工具

/**
 * 获取或创建用户ID
 * @returns {string} 用户唯一ID
 */
function getUserId() {
  try {
    let userId = wx.getStorageSync('userId')
    if (!userId) {
      // 生成唯一ID（时间戳 + 随机数）
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      wx.setStorageSync('userId', userId)
    }
    return userId
  } catch (error) {
    console.error('获取用户ID失败:', error)
    // 如果出错，返回临时ID
    return 'user_' + Date.now()
  }
}

/**
 * 获取用户信息
 * @returns {Object} 用户信息 {userId, nickname}
 */
function getUserInfo() {
  const userId = getUserId()
  try {
    const userInfo = wx.getStorageSync('userInfo') || {}
    return {
      userId: userId,
      nickname: userInfo.nickname || '用户' + userId.substr(-6) // 默认昵称
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      userId: userId,
      nickname: '用户' + userId.substr(-6)
    }
  }
}

/**
 * 设置用户昵称
 * @param {string} nickname - 用户昵称
 */
function setUserNickname(nickname) {
  try {
    const userInfo = wx.getStorageSync('userInfo') || {}
    userInfo.nickname = nickname
    wx.setStorageSync('userInfo', userInfo)
  } catch (error) {
    console.error('设置用户昵称失败:', error)
  }
}

/**
 * 获取用户总积分
 * @returns {number} 用户总积分
 */
function getUserTotalScore() {
  try {
    const score = wx.getStorageSync('userTotalScore') || 0
    return parseInt(score)
  } catch (error) {
    console.error('获取用户总积分失败:', error)
    return 0
  }
}

/**
 * 增加用户积分
 * @param {number} score - 增加的积分
 */
function addUserScore(score) {
  try {
    const currentScore = getUserTotalScore()
    const newScore = currentScore + score
    wx.setStorageSync('userTotalScore', newScore)
    
    // 记录积分历史
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD格式
    const history = wx.getStorageSync('scoreHistory') || []
    history.push({
      date: today,
      score: score,
      timestamp: Date.now()
    })
    wx.setStorageSync('scoreHistory', history)
    
    return newScore
  } catch (error) {
    console.error('增加用户积分失败:', error)
    return getUserTotalScore()
  }
}

/**
 * 获取积分历史记录
 * @returns {Array} 积分历史记录数组
 */
function getScoreHistory() {
  try {
    return wx.getStorageSync('scoreHistory') || []
  } catch (error) {
    console.error('获取积分历史失败:', error)
    return []
  }
}

/**
 * 获取今日获得的积分
 * @returns {number} 今日积分
 */
function getTodayScore() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const history = getScoreHistory()
    let todayScore = 0
    
    history.forEach(record => {
      if (record.date === today) {
        todayScore += record.score
      }
    })
    
    return todayScore
  } catch (error) {
    console.error('获取今日积分失败:', error)
    return 0
  }
}

/**
 * 获取所有用户的积分排行榜（本地存储版本）
 * 注意：这只是本地数据，如果需要看到其他用户的真实数据，需要后端支持
 * @returns {Array} 排行榜数组，按积分降序排列
 */
function getLocalRanking() {
  try {
    // 获取当前用户数据
    const userInfo = getUserInfo()
    const totalScore = getUserTotalScore()
    
    // 本地存储版本：只显示当前用户
    // 如果需要显示其他用户，需要从服务器获取数据
    return [{
      userId: userInfo.userId,
      nickname: userInfo.nickname,
      totalScore: totalScore,
      isCurrentUser: true
    }]
  } catch (error) {
    console.error('获取排行榜失败:', error)
    return []
  }
}

/**
 * 从服务器获取排行榜（需要后端支持）
 * @param {string} serverUrl - 服务器API地址
 * @returns {Promise} 返回排行榜数据的Promise
 */
function getServerRanking(serverUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data)
        } else {
          reject(new Error('获取排行榜失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 上传用户积分到服务器（需要后端支持）
 * @param {string} serverUrl - 服务器API地址
 * @param {Object} userData - 用户数据 {userId, nickname, totalScore}
 * @returns {Promise} 返回上传结果的Promise
 */
function uploadScoreToServer(serverUrl, userData) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverUrl,
      method: 'POST',
      data: userData,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error('上传积分失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  getUserId,
  getUserInfo,
  setUserNickname,
  getUserTotalScore,
  addUserScore,
  getScoreHistory,
  getTodayScore,
  getLocalRanking,
  getServerRanking,
  uploadScoreToServer
}
