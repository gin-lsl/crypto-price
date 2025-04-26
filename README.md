# 加密货币价格转换器 - 浏览器扩展

![扩展图标](icons/logo-16.png)

## 功能说明
- 实时转换网页中的加密货币金额(如1ETH → 当前美元价值)
- 支持主流加密货币(ETH, BTC, SOL等)
- 自动检测多种输入格式(1ETH, 1 ETH, 0.5BTC等)
- 简洁的弹出界面显示转换结果

## 安装指南

### Chrome浏览器
1. 下载最新版扩展包(.crx文件)
2. 打开Chrome扩展页面(chrome://extensions)
3. 启用"开发者模式"
4. 拖放.crx文件到页面完成安装

### Firefox浏览器
1. 下载.xpi文件
2. 打开about:addons页面
3. 点击"从文件安装附加组件"
4. 选择.xpi文件完成安装

## 使用方法
1. 在任意网页选中加密货币金额(如"1ETH")
2. 点击扩展图标或使用快捷键(默认Ctrl+Shift+C)
3. 弹出窗口将显示转换后的法币价值

## 开发与测试
```bash
# 安装依赖
npm install

# 运行测试
npm test

# 打包扩展
node build.js
```

## 截图示例
![功能演示](screenshots/demo.png) *(截图待添加)*

## 许可证
MIT License