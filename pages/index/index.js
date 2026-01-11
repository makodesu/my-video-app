// pages/index/index.js
const app = getApp()
const questionParser = require('../../utils/questionParser.js')
const videoManager = require('../../utils/videoManager.js')
const scoreManager = require('../../utils/scoreManager.js')

Page({
  data: {
    // 页面状态
    showStartButton: true,
    showVideo: false,
    showQuestion: false,
    
    // 视频相关
    videoUrl: '', // 随机选择的视频路径
    
    // 题库数据
    questionBank: [],
    
    // 当前题目相关
    selectedQuestions: [], // 随机抽取的3道题
    currentQuestionIndex: 0,
    totalQuestions: 3,
    currentQuestion: {},
    selectedAnswer: null, // 用户选择的答案索引
    hasAnswered: false, // 是否已答题
    optionClass: ['', '', '', ''], // 选项样式类
    
    // 积分相关
    score: 0,
    earnedScore: 0,
    
    // 提示相关
    showToast: false,
    toastMessage: '',
    showScore: false,
    showNextButton: false,
    
    // 定时器
    toastTimer: null,
    nextQuestionTimer: null
  },

  onLoad() {
    // 从积分管理器获取用户总积分
    const totalScore = scoreManager.getUserTotalScore()
    this.setData({
      score: totalScore
    })
    
    // 加载题目数据
    this.loadQuestions()
  },

  onShow() {
    // 每次显示页面时刷新积分
    const totalScore = scoreManager.getUserTotalScore()
    this.setData({
      score: totalScore
    })
  },

  // 跳转到积分统计页面
  goToScorePage() {
    wx.navigateTo({
      url: '/pages/score/score'
    })
  },

  // 加载题目数据
  loadQuestions() {
    // 配置：是否从GitHub加载题目
    // true: 从GitHub加载（上线时使用）
    // false: 从本地加载（测试时使用）
    const useGitHub = false // 改为true启用GitHub加载
    const githubUrl = 'https://makodesu.github.io/my-video-app/questions.txt' // GitHub题目文件URL
    
    if (useGitHub) {
      // 从GitHub加载题目
      questionParser.loadQuestionsFromGitHub(githubUrl)
        .then(questions => {
          this.setData({
            questionBank: questions
          })
          console.log('从GitHub加载题目成功，共', questions.length, '道题')
        })
        .catch(error => {
          console.error('从GitHub加载题目失败:', error)
          // 失败时使用本地题目
          this.loadLocalQuestions()
        })
    } else {
      // 从本地加载题目
      this.loadLocalQuestions()
    }
  },

  // 从本地加载题目
  loadLocalQuestions() {
    try {
      const questions = questionParser.loadQuestionsFromTxt()
      this.setData({
        questionBank: questions
      })
      console.log('从本地加载题目成功，共', questions.length, '道题')
    } catch (error) {
      console.error('加载题目失败:', error)
      wx.showToast({
        title: '加载题目失败',
        icon: 'none'
      })
    }
  },

  onUnload() {
    // 清除定时器
    this.clearTimers()
  },

  // 清除所有定时器
  clearTimers() {
    if (this.data.toastTimer) {
      clearTimeout(this.data.toastTimer)
    }
    if (this.data.nextQuestionTimer) {
      clearTimeout(this.data.nextQuestionTimer)
    }
  },

  // 检查今日是否已观看视频
  checkTodayVideoWatched() {
    // 如果功能未启用，直接返回false（允许观看）
    if (!app.globalData.enableDailyVideoLimit) {
      return false
    }
    
    try {
      const today = new Date().toDateString() // 获取今天的日期字符串，格式：Mon Jan 01 2024
      const lastWatchDate = wx.getStorageSync('lastVideoWatchDate')
      
      // 如果今天已经看过，返回true
      if (lastWatchDate === today) {
        return true
      }
      
      return false
    } catch (error) {
      console.error('检查观看记录失败:', error)
      return false // 出错时允许观看
    }
  },

  // 记录今日已观看视频
  recordTodayVideoWatched() {
    // 如果功能未启用，不记录
    if (!app.globalData.enableDailyVideoLimit) {
      return
    }
    
    try {
      const today = new Date().toDateString()
      wx.setStorageSync('lastVideoWatchDate', today)
    } catch (error) {
      console.error('记录观看日期失败:', error)
    }
  },

  // 开始学习
  startLearning() {
    // 检查今日是否已观看视频
    if (this.checkTodayVideoWatched()) {
      wx.showModal({
        title: '提示',
        content: '今日已经看过视频了，明天再来吧',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }
    
    // 随机选择一个视频
    let randomVideoUrl = videoManager.getRandomVideo()
    
    if (!randomVideoUrl) {
      wx.showToast({
        title: '没有可用的视频',
        icon: 'none'
      })
      return
    }
    
    // 打印视频路径用于调试
    console.log('选择的视频路径:', randomVideoUrl)
    
    // 如果是本地路径，尝试多种格式
    if (!randomVideoUrl.startsWith('http://') && !randomVideoUrl.startsWith('https://')) {
      // 尝试使用绝对路径（从项目根目录）
      // 如果这个不行，可以尝试相对路径：../../video/video1.mp4
      randomVideoUrl = randomVideoUrl.startsWith('/') ? randomVideoUrl : '/' + randomVideoUrl
    }
    
    // 记录今日已观看
    this.recordTodayVideoWatched()
    
    this.setData({
      showStartButton: false,
      showVideo: true,
      videoUrl: randomVideoUrl
    })
  },
  
  // 视频加载错误处理
  onVideoError(e) {
    console.error('视频加载错误:', e.detail)
    wx.showToast({
      title: '视频加载失败，请检查文件是否存在',
      icon: 'none',
      duration: 3000
    })
  },

  // 视频播放结束
  onVideoEnd() {
    // 随机抽取3道题
    const selectedQuestions = this.getRandomQuestions(3)
    
    this.setData({
      showVideo: false,
      showQuestion: true,
      selectedQuestions: selectedQuestions,
      currentQuestion: selectedQuestions[0],
      currentQuestionIndex: 0
    })
  },

  // 从题库中随机抽取指定数量的题目
  getRandomQuestions(count) {
    const bank = this.data.questionBank
    const shuffled = [...bank].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  },

  // 选择答案
  selectOption(e) {
    if (this.data.hasAnswered) {
      return // 已经答过题，不允许再次选择
    }

    const selectedIndex = e.currentTarget.dataset.index
    const correctAnswer = this.data.currentQuestion.correctAnswer
    const isCorrect = selectedIndex === correctAnswer

    // 设置已答题状态
    this.setData({
      selectedAnswer: selectedIndex,
      hasAnswered: true
    })

    // 设置选项样式
    const optionClass = ['', '', '', '']
    if (isCorrect) {
      // 答对了
      optionClass[selectedIndex] = 'correct'
      this.handleCorrectAnswer()
    } else {
      // 答错了
      optionClass[selectedIndex] = 'wrong'
      optionClass[correctAnswer] = 'correct'
      this.handleWrongAnswer()
    }

    this.setData({
      optionClass: optionClass
    })
  },

  // 处理正确答案
  handleCorrectAnswer() {
    // 获取当前题目的分值（如果没有设置，默认为5分）
    const earnedScore = this.data.currentQuestion.score || 5
    
    // 使用积分管理器记录积分
    const newTotalScore = scoreManager.addUserScore(earnedScore)
    
    // 立即显示结果和下一题按钮
    this.setData({
      score: newTotalScore,
      earnedScore: earnedScore,
      toastMessage: '回答正确',
      showScore: true,
      showToast: true,
      showNextButton: true // 立即显示下一题按钮
    })
  },

  // 处理错误答案
  handleWrongAnswer() {
    // 立即显示结果和下一题按钮
    this.setData({
      toastMessage: '回答错误',
      showScore: false,
      showToast: true, // 立即显示提示
      showNextButton: true // 立即显示下一题按钮
    })
  },

  // 点击答题区域（已不需要，保留以防其他地方调用）
  handleQuestionAreaClick(e) {
    // 如果点击的是选项，不处理（选项有自己的点击事件）
    if (e.target.dataset.index !== undefined) {
      return
    }
  },

  // 点击提示弹窗（关闭弹窗，但不进入下一题）
  handleToastClick() {
    // 点击弹窗背景关闭提示，但不进入下一题
    // 只有点击"下一题"按钮才会进入下一题
    this.setData({
      showToast: false
    })
  },

  // 下一题
  nextQuestion() {
    this.clearTimers()
    
    const nextIndex = this.data.currentQuestionIndex + 1
    
    if (nextIndex < this.data.totalQuestions) {
      // 还有下一题
      this.setData({
        currentQuestionIndex: nextIndex,
        currentQuestion: this.data.selectedQuestions[nextIndex],
        selectedAnswer: null,
        hasAnswered: false,
        optionClass: ['', '', '', ''],
        showToast: false,
        showNextButton: false,
        showScore: false
      })
    } else {
      // 所有题目答完
      const totalScore = scoreManager.getUserTotalScore()
      wx.showModal({
        title: '恭喜完成',
        content: `您已完成所有题目！总积分：${totalScore}`,
        showCancel: false,
        confirmText: '查看积分统计',
        success: (res) => {
          // 重置到开始状态
          this.setData({
            showStartButton: true,
            showQuestion: false,
            currentQuestionIndex: 0,
            selectedAnswer: null,
            hasAnswered: false,
            optionClass: ['', '', '', ''],
            showToast: false,
            showNextButton: false,
            showScore: false,
            score: totalScore
          })
          
          // 如果点击了确认，跳转到积分统计页面
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/score/score'
            })
          }
        }
      })
    }
  }
})

