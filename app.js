App({
  onLaunch() {
    // 小程序启动
  },
  globalData: {
    userInfo: null,
    score: 0, // 用户积分
    // 每日观看限制开关
    // true: 启用限制（上线时使用）
    // false: 关闭限制（测试时使用）
    enableDailyVideoLimit: false
  }
})

