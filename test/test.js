const assert = require('assert');
const { convertCurrency, handleAPIError } = require('../content_scripts/content.js');

describe('Crypto Price Converter', () => {
  // 测试货币转换功能
  describe('convertCurrency()', () => {
    it('应正确处理"1ETH"格式输入', () => {
      assert.strictEqual(convertCurrency('1ETH'), '1 ETH');
    });

    it('应正确处理"1 ETH"格式输入', () => {
      assert.strictEqual(convertCurrency('1 ETH'), '1 ETH');
    });

    it('应正确处理带小数输入"0.5BTC"', () => {
      assert.strictEqual(convertCurrency('0.5BTC'), '0.5 BTC');
    });
  });

  // 测试API错误处理
  describe('handleAPIError()', () => {
    it('应正确处理网络错误', () => {
      const result = handleAPIError({ code: 'NETWORK_ERROR' });
      assert.strictEqual(result, '网络错误，请检查连接');
    });

    it('应正确处理API限制错误', () => {
      const result = handleAPIError({ code: 'RATE_LIMIT' });
      assert.strictEqual(result, '请求过于频繁，请稍后再试');
    });

    it('应处理未知错误', () => {
      const result = handleAPIError({});
      assert.strictEqual(result, '发生未知错误');
    });
  });
});