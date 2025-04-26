# 浏览器插件架构设计方案

## 1. 功能概述
该浏览器插件的主要功能是当用户选中特定格式的加密货币文本（如1.3ETH、1ETH、1 ETH、1.4SOL、1SOL、1 SOL）时，显示对应的美元价值。插件将包含以下组件：

## 2. 组件设计

### 2.1 内容脚本(Content Script)
- **功能**：监听页面上的文本选择事件，检测选中的文本是否符合特定格式。
- **实现**：
  - 使用`document.addEventListener('selectionchange', ...)`监听文本选择变化
  - 使用正则表达式匹配选中的文本，如`/(\d+(\.\d+)?)\s*(ETH|SOL)/i`
  - 如果匹配成功，将选中的文本和加密货币类型发送到后台脚本

### 2.2 后台脚本(Background Script)
- **功能**：处理价格API请求，获取加密货币的当前美元价值。
- **实现**：
  - 使用`chrome.runtime.onMessage.addListener(...)`监听来自内容脚本的消息
  - 调用加密货币价格API（如CoinGecko API）获取当前价格
  - 将计算结果返回给内容脚本

### 2.3 弹出UI(Popup)
- **功能**：提供可选配置界面，允许用户自定义设置。
- **实现**：
  - 使用HTML/CSS创建简单的配置界面
  - 提供选项如默认加密货币、显示单位等
  - 使用`chrome.storage.sync`保存用户设置

### 2.4 清单文件(manifest.json)
- **功能**：定义插件的配置和权限。
- **实现**：
  - 包含`content_scripts`、`background`、`permissions`等字段
  - 确保跨浏览器兼容性，使用`manifest_version: 3`（Chrome）和`manifest_version: 2`（Firefox）

## 3. 技术选型建议

### 3.1 前端技术
- **HTML/CSS**：用于创建弹出UI界面
- **JavaScript**：用于内容脚本和后台脚本的逻辑实现

### 3.2 API选择
- **CoinGecko API**：免费、稳定，支持多种加密货币的实时价格查询

### 3.3 跨浏览器兼容性
- **Chrome**：使用`manifest_version: 3`
- **Firefox**：使用`manifest_version: 2`，并确保API调用和事件监听兼容

## 4. 详细设计流程图

```mermaid
graph TD
    A[用户选中文本] --> B[内容脚本监听选择事件]
    B --> C{文本匹配加密货币格式?}
    C -->|是| D[发送加密货币类型和数量到后台脚本]
    C -->|否| E[结束]
    D --> F[后台脚本接收消息]
    F --> G[调用CoinGecko API获取价格]
    G --> H[计算美元价值]
    H --> I[返回结果到内容脚本]
    I --> J[内容脚本显示tip]