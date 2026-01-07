# 微信小程序 - 学习答题系统

一个功能完整的微信小程序，包含视频学习和答题功能。

## 功能特点

1. **视频学习**：点击"开始学习"按钮播放视频
2. **随机抽题**：视频播放完成后，从题库中随机抽取3道选择题
3. **答题系统**：
   - 每道题只能选择一次答案
   - 答对获得5积分，显示"回答正确"提示
   - 答错高亮正确答案（绿色）和选择的错误答案（红色）
4. **自动跳转**：答题后5秒自动显示下一题按钮，也可手动点击进入下一题

## 项目结构

```
E:\cursorjava\
├── app.js                 # 小程序入口文件
├── app.json              # 小程序全局配置
├── app.wxss              # 小程序全局样式
├── sitemap.json          # 小程序索引配置
├── questions.txt         # 题目数据文件
├── utils/
│   ├── questionParser.js # 题目解析工具
│   └── videoManager.js   # 视频管理工具（GitHub Pages配置）
├── video/                # 视频文件目录
│   ├── video1.mp4        # 视频文件1
│   ├── video2.mp4        # 视频文件2
│   └── video3.mp4        # 视频文件3
├── pages/
│   └── index/
│       ├── index.js      # 页面逻辑
│       ├── index.json    # 页面配置
│       ├── index.wxml    # 页面结构
│       └── index.wxss    # 页面样式
└── README.md             # 项目说明
```

## 使用说明

### 1. 配置视频地址（使用GitHub Pages）

视频文件通过GitHub Pages提供，配置步骤：

1. **上传视频到GitHub**
   - 将视频文件（video1.mp4, video2.mp4, video3.mp4）放在 `video/` 文件夹
   - 确保每个文件小于100MB（GitHub限制）
   - 上传到GitHub仓库

2. **启用GitHub Pages**
   - 在GitHub仓库中，进入 Settings -> Pages
   - Source选择 `main` 分支，Folder选择 `/root`
   - 保存后获得URL：`https://your-username.github.io/your-repo-name/`

3. **修改配置**
   - 打开 `utils/videoManager.js`
   - 修改 `baseUrl` 为你的GitHub Pages地址：
   ```javascript
   const config = {
     useNetworkUrl: true,
     baseUrl: 'https://your-username.github.io/your-repo-name/video/'
   }
   ```

**注意**：
- 视频文件必须小于100MB
- 如果文件过大，需要先压缩（参考 `GitHub不使用LFS配置指南.md`）
- 在微信开发者工具中测试时，需要勾选"不校验合法域名"

### 2. 自定义题库

题目数据存储在 `questions.txt` 文件中，格式：
```
题目名称|问题|A|选项A|B|选项B|C|选项C|D|选项D|正确答案索引(0-3)
```

也可以直接在 `utils/questionParser.js` 中修改题目数据。

```javascript
{
  question: '题目内容',
  options: [
    { label: 'A', text: '选项A' },
    { label: 'B', text: '选项B' },
    { label: 'C', text: '选项C' },
    { label: 'D', text: '选项D' }
  ],
  correctAnswer: 3 // 正确答案索引（0=A, 1=B, 2=C, 3=D）
}
```

### 3. 在微信开发者工具中运行

1. 打开微信开发者工具
2. 选择"小程序"
3. 导入项目，选择 `E:\cursorjava` 目录
4. 填写你的 AppID（测试可以使用测试号）
5. 点击"编译"即可运行

## 功能说明

### 答题流程

1. **开始学习**：点击"开始学习"按钮，播放视频
2. **视频结束**：视频播放完成后，自动进入答题环节
3. **选择答案**：点击选项，只能选择一次
4. **查看结果**：
   - 答对：显示"回答正确"，获得5积分，5秒后显示"下一题"按钮
   - 答错：高亮正确答案（绿色）和错误答案（红色），5秒后或点击屏幕显示提示，再5秒后显示"下一题"按钮
5. **继续答题**：点击"下一题"按钮或等待自动跳转，进入下一题
6. **完成**：答完3道题后，显示完成提示和总积分

### 样式说明

- **正确答案**：绿色背景（#4caf50），绿色边框
- **错误答案**：红色背景（#f44336），红色边框
- **积分显示**：右上角显示当前积分，答对题目时在提示中显示获得的积分

## 注意事项

1. **视频文件**：
   - 视频文件通过GitHub Pages提供
   - 每个文件必须小于100MB（GitHub限制）
   - 如果文件过大，需要先压缩
   - 参考 `GitHub不使用LFS配置指南.md` 了解详细步骤

2. **题库数量**：确保题库中的题目数量不少于3道，否则可能无法正常抽题

3. **样式适配**：样式已针对小程序进行优化，如需调整可在 `index.wxss` 中修改

4. **开发测试**：在微信开发者工具中，需要勾选"不校验合法域名"才能测试GitHub Pages的视频

## 扩展建议

- 可以添加题目分类功能
- 可以添加答题历史记录
- 可以添加积分排行榜
- 可以添加更多题目类型（判断题、多选题等）

