# 使用GitHub存储视频文件的完整指南

## 重要提示

GitHub对单个文件有**100MB的硬限制**，超过100MB的文件无法直接上传。

你的视频文件大小：
- ✅ video1.mp4: 86.4MB（可以直接上传）
- ❌ video2.mp4: 187.5MB（超过限制，需要Git LFS或压缩）
- ❌ video3.mp4: 398.1MB（超过限制，需要Git LFS或压缩）

## 方案一：使用Git LFS（推荐用于大文件）

### 步骤1：安装Git LFS

1. 下载Git LFS：https://git-lfs.github.com/
2. 安装Git LFS
3. 在命令行中验证安装：
   ```bash
   git lfs version
   ```

### 步骤2：初始化Git LFS

在你的项目目录中：

```bash
# 初始化Git LFS
git lfs install

# 跟踪所有.mp4文件
git lfs track "*.mp4"

# 或者只跟踪video文件夹中的文件
git lfs track "video/*.mp4"
```

这会创建一个 `.gitattributes` 文件。

### 步骤3：上传文件到GitHub

```bash
# 添加.gitattributes文件
git add .gitattributes

# 添加视频文件
git add video/*.mp4

# 提交
git commit -m "Add video files with Git LFS"

# 推送到GitHub
git push origin main
```

### 步骤4：获取GitHub Pages URL

1. 在GitHub仓库中，进入 **Settings** -> **Pages**
2. 选择分支（通常是 `main` 或 `master`）
3. 选择文件夹（通常是 `/root`）
4. 保存后，GitHub会给你一个URL，格式类似：
   ```
   https://your-username.github.io/your-repo-name/
   ```

### 步骤5：配置代码

在 `utils/videoManager.js` 中：

```javascript
const config = {
  useNetworkUrl: true,
  baseUrl: 'https://your-username.github.io/your-repo-name/video/'
}
```

## 方案二：压缩视频文件（适合所有文件都小于100MB）

### 步骤1：压缩视频

使用视频压缩工具（推荐HandBrake）：
- 下载：https://handbrake.fr/
- 压缩video2.mp4和video3.mp4到100MB以下
- 保持video1.mp4不变（已经在限制内）

### 步骤2：上传到GitHub

```bash
# 添加视频文件
git add video/*.mp4

# 提交
git commit -m "Add compressed video files"

# 推送到GitHub
git push origin main
```

### 步骤3：配置代码

同上，使用GitHub Pages URL。

## 方案三：混合方案（推荐）

- video1.mp4（86.4MB）：直接上传到GitHub
- video2.mp4和video3.mp4：使用Git LFS或压缩后上传

## 详细步骤（使用Git LFS）

### 1. 创建GitHub仓库

1. 登录GitHub：https://github.com
2. 点击右上角"+" -> "New repository"
3. 输入仓库名称（如：`my-video-app`）
4. 选择Public（GitHub Pages需要公开仓库）
5. 点击"Create repository"

### 2. 初始化本地Git仓库

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
```

### 3. 安装并配置Git LFS

```bash
# 安装Git LFS（如果还没安装）
# Windows: 下载安装包从 https://git-lfs.github.com/
# 或使用包管理器：choco install git-lfs

# 初始化Git LFS
git lfs install

# 跟踪视频文件
git lfs track "video/*.mp4"

# 这会创建.gitattributes文件
```

### 4. 提交并推送

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Add project with video files"

# 推送到GitHub
git push -u origin main
```

### 5. 启用GitHub Pages

1. 在GitHub仓库页面，点击 **Settings**
2. 左侧菜单找到 **Pages**
3. 在"Source"下选择分支（如：`main`）
4. 选择文件夹（如：`/root`）
5. 点击 **Save**
6. 等待几分钟，GitHub会给你一个URL：
   ```
   https://your-username.github.io/your-repo-name/
   ```

### 6. 修改代码配置

打开 `utils/videoManager.js`，修改：

```javascript
const config = {
  useNetworkUrl: true,
  baseUrl: 'https://your-username.github.io/your-repo-name/video/'
  // 注意：URL必须以 / 结尾
}
```

### 7. 测试

在微信开发者工具中：
1. 点击右上角"详情"
2. 勾选"不校验合法域名"
3. 重新编译运行

## 注意事项

### Git LFS限制

- **免费账户**：每月1GB带宽，1GB存储
- 如果超过限制，需要付费或使用其他方案

### GitHub Pages限制

- 仓库大小：建议不超过1GB
- 带宽：每月100GB（通常足够）
- 文件大小：单个文件建议不超过100MB（即使使用Git LFS）

### 视频文件建议

- 格式：MP4（H.264编码）
- 分辨率：根据需求调整（可以降低分辨率以减小文件）
- 码率：可以适当降低以减小文件大小

## 快速命令参考

```bash
# 安装Git LFS
git lfs install

# 跟踪视频文件
git lfs track "video/*.mp4"

# 添加并提交
git add .gitattributes
git add video/*.mp4
git commit -m "Add videos"

# 推送到GitHub
git push origin main
```

## 如果遇到问题

### 问题1：Git LFS文件显示为指针
- 这是正常的，Git LFS会管理大文件
- 确保已安装Git LFS客户端

### 问题2：GitHub Pages无法访问视频
- 检查URL是否正确
- 确保仓库是Public
- 等待几分钟让GitHub Pages生效

### 问题3：视频加载慢
- GitHub Pages没有CDN加速
- 考虑使用云存储服务（更快）

## 推荐方案对比

| 方案 | 优点 | 缺点 | 适合场景 |
|------|------|------|----------|
| Git LFS | 免费，简单 | 有带宽限制 | 小项目，测试用 |
| 压缩视频 | 无额外依赖 | 画质可能降低 | 对画质要求不高 |
| 云存储 | 速度快，无限制 | 需要注册账号 | 正式项目 |

