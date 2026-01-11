// utils/questionParser.js
// 解析题目txt文件内容

/**
 * 解析题目txt文件内容
 * 格式：题目名称|问题|A|选项A|B|选项B|C|选项C|D|选项D|正确答案索引(0-3)|分值
 * 如果分值不存在，默认为5分
 * @param {string} txtContent - txt文件内容
 * @returns {Array} 题目数组
 */
function parseQuestions(txtContent) {
  const lines = txtContent.trim().split('\n')
  const questions = []
  
  for (let line of lines) {
    line = line.trim()
    if (!line) continue
    
    const parts = line.split('|')
    if (parts.length < 11) continue // 至少需要11个部分
    
    const question = {
      question: parts[1], // 问题
      options: [
        { label: parts[2], text: parts[3] }, // A选项
        { label: parts[4], text: parts[5] }, // B选项
        { label: parts[6], text: parts[7] }, // C选项
        { label: parts[8], text: parts[9] }  // D选项
      ],
      correctAnswer: parseInt(parts[10]) || 0, // 正确答案索引
      score: parseInt(parts[11]) || 5 // 分值，默认为5分
    }
    
    questions.push(question)
  }
  
  return questions
}

/**
 * 从txt文件加载题目（小程序环境）
 * 注意：小程序不能直接读取本地文件，所以这里直接使用txt文件的内容
 * 如果需要更新题目，请修改questions.txt文件，然后复制内容到这里
 * 或者使用loadQuestionsFromGitHub从GitHub加载
 */
function loadQuestionsFromTxt() {
  // 从questions.txt文件读取的内容
  // 格式：题目名称|问题|A|选项A|B|选项B|C|选项C|D|选项D|正确答案索引(0-3)|分值
  const txtContent = `题目1|以下哪个是JavaScript的数据类型？|A|String|B|Number|C|Boolean|D|以上都是|3|5
题目2|微信小程序的页面文件不包括以下哪个？|A|.js|B|.wxml|C|.wxss|D|.html|3|5
题目3|以下哪个方法可以获取用户信息？|A|wx.getUserInfo|B|wx.getUserProfile|C|wx.login|D|wx.request|1|5
题目4|小程序中如何设置页面标题？|A|在app.json中设置|B|在页面的.json文件中设置|C|使用wx.setNavigationBarTitle|D|以上都可以|3|5
题目5|以下哪个不是小程序的全局配置？|A|pages|B|window|C|tabBar|D|component|3|5`
  
  return parseQuestions(txtContent)
}

/**
 * 从GitHub加载题目
 * @param {string} githubUrl - GitHub文件URL（GitHub Pages或raw.githubusercontent.com）
 * @returns {Promise} 返回题目数组的Promise
 */
function loadQuestionsFromGitHub(githubUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: githubUrl,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          try {
            const questions = parseQuestions(res.data)
            resolve(questions)
          } catch (error) {
            reject(new Error('解析题目失败: ' + error.message))
          }
        } else {
          reject(new Error('加载题目失败，状态码: ' + res.statusCode))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 从服务器加载题目（推荐方式）
 * @param {string} url - 题目文件URL
 * @returns {Promise} 返回题目数组的Promise
 */
function loadQuestionsFromServer(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          const questions = parseQuestions(res.data)
          resolve(questions)
        } else {
          reject(new Error('加载题目失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

module.exports = {
  parseQuestions,
  loadQuestionsFromTxt,
  loadQuestionsFromServer,
  loadQuestionsFromGitHub
}

