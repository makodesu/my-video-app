// pages/score/score.js
const app = getApp()
const scoreManager = require('../../utils/scoreManager.js')

Page({
  data: {
    // 用户信息
    userInfo: {},
    totalScore: 0,
    todayScore: 0,
    
    // 排行榜
    ranking: [],
    currentUserRank: 0,
    
    // 积分历史
    scoreHistory: [],
    
    // 页面状态
    loading: false,
    useServer: false // 是否使用服务器数据
  },

  onLoad() {
    this.loadUserData()
    this.loadRanking()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadUserData()
    this.loadRanking()
  },

  // 加载用户数据
  loadUserData() {
    const userInfo = scoreManager.getUserInfo()
    const totalScore = scoreManager.getUserTotalScore()
    const todayScore = scoreManager.getTodayScore()
    const scoreHistory = scoreManager.getScoreHistory()
    
    // 按日期分组统计
    const historyByDate = {}
    scoreHistory.forEach(record => {
      if (!historyByDate[record.date]) {
        historyByDate[record.date] = 0
      }
      historyByDate[record.date] += record.score
    })
    
    // 转换为数组并排序
    const historyList = Object.keys(historyByDate).map(date => ({
      date: date,
      score: historyByDate[date]
    })).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7) // 最近7天
    
    this.setData({
      userInfo: userInfo,
      totalScore: totalScore,
      todayScore: todayScore,
      scoreHistory: historyList
    })
  },

  // 加载排行榜
  loadRanking() {
    if (this.data.useServer) {
      // 从服务器加载（需要配置服务器地址）
      const serverUrl = 'https://your-server.com/api/ranking'
      this.setData({ loading: true })
      
      scoreManager.getServerRanking(serverUrl)
        .then(ranking => {
          this.processRanking(ranking)
          this.setData({ loading: false })
        })
        .catch(error => {
          console.error('加载服务器排行榜失败:', error)
          // 失败时使用本地数据
          this.loadLocalRanking()
          this.setData({ loading: false })
        })
    } else {
      // 使用本地数据
      this.loadLocalRanking()
    }
  },

  // 加载本地排行榜
  loadLocalRanking() {
    const ranking = scoreManager.getLocalRanking()
    this.processRanking(ranking)
  },

  // 处理排行榜数据
  processRanking(ranking) {
    // 按积分降序排序
    const sortedRanking = ranking.sort((a, b) => b.totalScore - a.totalScore)
    
    // 找到当前用户的排名
    const currentUserId = scoreManager.getUserId()
    let currentUserRank = 0
    sortedRanking.forEach((user, index) => {
      if (user.userId === currentUserId) {
        currentUserRank = index + 1
        user.isCurrentUser = true
      }
    })
    
    this.setData({
      ranking: sortedRanking,
      currentUserRank: currentUserRank
    })
  },

  // 修改昵称
  editNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          scoreManager.setUserNickname(res.content.trim())
          this.loadUserData()
          this.loadRanking()
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 刷新数据
  refreshData() {
    this.loadUserData()
    this.loadRanking()
    wx.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  }
})
