const assert = require('assert');
const content = require('../content_scripts/content.js');

describe('Crypto Price Converter', () => {
  // 测试数字解析功能
  describe('数字解析', () => {
    it('应正确解析普通数字"100BTC"', () => {
      const match = '100BTC'.match(content.CRYPTO_REGEX);
      assert.strictEqual(parseFloat(match[1]), 100);
    });

    it('应正确解析带逗号数字"100,000BTC"', () => {
      const match = '100,000BTC'.match(content.CRYPTO_REGEX);
      assert.strictEqual(parseFloat(match[1].replace(/,/g, '')), 100000);
    });

    it('应正确解析带小数和逗号数字"1,000.5BTC"', () => {
      const match = '1,000.5BTC'.match(content.CRYPTO_REGEX);
      assert.strictEqual(parseFloat(match[1].replace(/,/g, '')), 1000.5);
    });
  });

  // 测试API错误处理
  describe('handleAPIError()', () => {
    it('应正确处理网络错误', () => {
      const result = content.handleAPIError({ code: 'NETWORK_ERROR' });
      assert.strictEqual(result, '网络错误，请检查连接');
    });

    it('应正确处理API限制错误', () => {
      const result = content.handleAPIError({ code: 'RATE_LIMIT' });
      assert.strictEqual(result, '请求过于频繁，请稍后再试');
    });

    it('应处理未知错误', () => {
      const result = content.handleAPIError({});
      assert.strictEqual(result, '发生未知错误');
    });
  });
});