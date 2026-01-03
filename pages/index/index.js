// pages/index/index.js
const app = getApp()
const questionParser = require('../../utils/questionParser.js')
const videoManager = require('../../utils/videoManager.js')

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
    // 从全局数据获取积分
    this.setData({
      score: app.globalData.score || 0
    })
    
    // 加载题目数据
    this.loadQuestions()
  },

  // 加载题目数据
  loadQuestions() {
    try {
      // 从txt文件加载题目（本地方式）
      const questions = questionParser.loadQuestionsFromTxt()
      this.setData({
        questionBank: questions
      })
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

  // 开始学习
  startLearning() {
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
    const earnedScore = 5
    const newScore = this.data.score + earnedScore
    
    // 更新全局积分
    app.globalData.score = newScore
    
    this.setData({
      score: newScore,
      earnedScore: earnedScore,
      toastMessage: '回答正确',
      showScore: true,
      showToast: true
    })

    // 5秒后自动显示下一题按钮
    const timer = setTimeout(() => {
      this.setData({
        showNextButton: true
      })
    }, 5000)

    this.setData({
      nextQuestionTimer: timer
    })
  },

  // 处理错误答案
  handleWrongAnswer() {
    this.setData({
      toastMessage: '回答正确', // 按照用户需求，答错也显示"回答正确"
      showScore: false,
      showToast: false // 先不显示，等5秒或点击后显示
    })

    // 5秒后显示提示
    const toastTimer = setTimeout(() => {
      this.setData({
        showToast: true
      })
      
      // 再5秒后显示下一题按钮
      const nextTimer = setTimeout(() => {
        this.setData({
          showNextButton: true
        })
      }, 5000)
      
      this.setData({
        nextQuestionTimer: nextTimer
      })
    }, 5000)

    this.setData({
      toastTimer: toastTimer
    })
  },

  // 点击答题区域（用于答错后点击屏幕显示提示）
  handleQuestionAreaClick(e) {
    // 如果点击的是选项，不处理（选项有自己的点击事件）
    if (e.target.dataset.index !== undefined) {
      return
    }
    
    // 如果已经答错且还没显示提示，点击后显示提示
    if (!this.data.showToast && this.data.hasAnswered && this.data.selectedAnswer !== this.data.currentQuestion.correctAnswer) {
      this.setData({
        showToast: true
      })
      
      // 清除之前的定时器
      if (this.data.toastTimer) {
        clearTimeout(this.data.toastTimer)
      }
      
      // 5秒后显示下一题按钮
      const timer = setTimeout(() => {
        this.setData({
          showNextButton: true
        })
      }, 5000)
      
      this.setData({
        nextQuestionTimer: timer
      })
    }
  },

  // 点击提示弹窗
  handleToastClick() {
    if (this.data.showNextButton) {
      // 如果已经显示下一题按钮，点击后直接进入下一题
      this.nextQuestion()
    }
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
      wx.showModal({
        title: '恭喜完成',
        content: `您已完成所有题目！总积分：${this.data.score}`,
        showCancel: false,
        success: () => {
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
            showScore: false
          })
        }
      })
    }
  }
})

