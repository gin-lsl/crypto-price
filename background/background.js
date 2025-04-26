// 默认设置
const defaultSettings = {
  refreshInterval: 5 // 分钟
};

// 加密货币价格缓存
const priceCache = {
  ETH: null,
  SOL: null,
  BTC: null,
  lastUpdated: null,
  settings: {...defaultSettings}
};

// 更新价格缓存
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana,bitcoin&vs_currencies=usd';
const MAX_RETRIES = 3;

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

async function updatePriceCache() {
  try {
    const data = await fetchWithRetry(API_URL);
    if (!data?.ethereum?.usd || !data?.solana?.usd || !data?.bitcoin?.usd) {
      throw new Error('Invalid API response format');
    }
    
    priceCache.ETH = data.ethereum.usd;
    priceCache.SOL = data.solana.usd;
    priceCache.BTC = data.bitcoin.usd;
    priceCache.lastUpdated = Date.now();
  } catch (error) {
    console.error('Failed to update price cache:', error);
    // 使用最后一次有效价格
    return priceCache.ETH && priceCache.SOL;
  }
}

// 处理消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  try {
    if (request.type === 'GET_CRYPTO_PRICE') {
      if (!['ETH', 'SOL', 'BTC'].includes(request.symbol)) {
        throw new Error(`Invalid symbol: ${request.symbol}`);
      }
      
      // 根据设置的时间间隔更新缓存
      const refreshIntervalMs = (priceCache.settings.refreshInterval || 5) * 60 * 1000;
      const shouldUpdate = !priceCache.lastUpdated ||
                         Date.now() - priceCache.lastUpdated > refreshIntervalMs;
      
      if (shouldUpdate) {
        await updatePriceCache();
      }
      
      sendResponse({
        price: priceCache[request.symbol],
        lastUpdated: priceCache.lastUpdated
      });
    }
    else if (request.type === 'SETTINGS_UPDATED') {
      if (typeof request.settings?.refreshInterval === 'number') {
        priceCache.settings.refreshInterval = request.settings.refreshInterval;
        sendResponse({ success: true });
      } else {
        throw new Error('Invalid settings format');
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ error: error.message });
  }
  return true; // 保持消息通道开放
});

// 初始化时更新价格并加载设置
chrome.storage.sync.get(['refreshInterval'], (result) => {
  if (result.refreshInterval) {
    priceCache.settings.refreshInterval = result.refreshInterval;
  }
  updatePriceCache();
});