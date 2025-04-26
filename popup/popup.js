document.addEventListener('DOMContentLoaded', () => {
  // 获取DOM元素
  const currencySelector = document.getElementById('currency-selector');
  const refreshInterval = document.getElementById('refreshInterval');
  const intervalValue = document.getElementById('intervalValue');
  const saveButton = document.getElementById('saveSettings');
  const statusDisplay = document.getElementById('statusDisplay');
  const lastUpdated = document.getElementById('lastUpdated');

  // 滑块值变化时更新显示
  refreshInterval.addEventListener('input', () => {
    intervalValue.textContent = refreshInterval.value;
  });

  // 加载保存的设置和状态
  chrome.storage.sync.get(['currency', 'refreshInterval', 'lastUpdated'], (result) => {
    if (result.currency) {
      currencySelector.value = result.currency;
    } else {
      currencySelector.value = 'USD'; // 默认值
    }
    if (result.refreshInterval) {
      refreshInterval.value = result.refreshInterval;
      intervalValue.textContent = result.refreshInterval;
    }
    if (result.lastUpdated) {
      lastUpdated.textContent = new Date(result.lastUpdated).toLocaleTimeString();
    }
  });

  // 获取扩展状态
  chrome.runtime.sendMessage({type: 'GET_STATUS'}, (response) => {
    if (response && response.status) {
      statusDisplay.textContent = response.status;
    }
  });

  // 保存设置
  saveButton.addEventListener('click', () => {
    const interval = parseInt(refreshInterval.value);
    if (isNaN(interval)) {
      alert('Please enter a valid number for refresh interval');
      return;
    }

    const settings = {
      currency: currencySelector.value,
      refreshInterval: interval,
      lastUpdated: Date.now()
    };

    chrome.storage.sync.set(settings, () => {
      // 显示保存成功的提示
      saveButton.textContent = 'Saved!';
      lastUpdated.textContent = new Date().toLocaleTimeString();
      setTimeout(() => {
        saveButton.textContent = 'Save Settings';
      }, 2000);
      
      // 通知background脚本设置已更新
      chrome.runtime.sendMessage({
        type: 'SETTINGS_UPDATED',
        settings
      });
    });
  });
});