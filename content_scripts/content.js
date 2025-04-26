// 匹配加密货币文本的正则表达式
const CRYPTO_REGEX = /(\d+(?:\.\d+)?)\s*(ETH|SOL|BTC)/i;

// 创建并显示tip元素
function showTip(text, usdValue, currency) {
  try {
    const tip = document.createElement('div');
    tip.className = 'crypto-tip';
    const currencySymbols = {
      USD: '$',
      CNY: '¥',
      EUR: '€'
    };
    const symbol = currencySymbols[currency] || '$';
    tip.textContent = `${text} ≈ ${symbol}${usdValue.toFixed(2)}`;
    
    // 样式设置
    Object.assign(tip.style, {
      position: 'absolute',
      backgroundColor: '#333',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '4px',
      zIndex: '9999',
      fontSize: '14px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });
    
    // 获取选中文本位置
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    tip.style.left = `${rect.left + window.scrollX + 10}px`;
    tip.style.top = `${rect.top + window.scrollY - 50}px`;
    
    document.body.appendChild(tip);
    
    // 3秒后自动消失
    setTimeout(() => {
      tip.remove();
    }, 3000);
  } catch (error) {
    console.error('Error showing tip:', error);
  }
}

// 移除所有tip元素
function clearTips() {
  document.querySelectorAll('.crypto-tip').forEach(tip => tip.remove());
}

// 监听文本选择变化
async function handleSelection() {
  try {
    clearTips();
    
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const selectedText = selection.toString().trim();
    const match = selectedText.match(CRYPTO_REGEX);
    
    if (match) {
      const amount = parseFloat(match[1]);
      const symbol = match[2].toUpperCase();
      
      // 发送消息到background获取价格
      const response = await chrome.runtime.sendMessage({
        type: 'GET_CRYPTO_PRICE',
        symbol
      });
      
      if (response?.prices) {
        chrome.storage.sync.get(['currency'], (result) => {
          const currency = result.currency || 'USD';
          const price = response.prices[currency] || response.prices.USD;
          const convertedValue = amount * price;
          showTip(selectedText, convertedValue, currency);
        });
      }
    }
  } catch (error) {
    console.error('Error handling selection:', error);
  }
}

// 防抖处理选择事件
let debounceTimer;
document.addEventListener('selectionchange', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(handleSelection, 200);
});