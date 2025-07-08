let cloudApi;
const mockApi = require('../miniprogram/utils/mockApi');

describe('cloudApi', () => {
  beforeEach(() => {
    jest.resetModules();
    global.wx = { cloud: { database: jest.fn(), callFunction: jest.fn() } };
    // eslint-disable-next-line global-require
    cloudApi = require('../miniprogram/utils/cloudApi');
  });

  test('getRewards success', async () => {
    const rewards = [{ _id: '1' }];
    wx.cloud.database.mockReturnValue({
      collection: () => ({ get: jest.fn().mockResolvedValue({ data: rewards }) })
    });
    const res = await cloudApi.getRewards();
    expect(res).toEqual(rewards);
  });

  test('getRewards failure fallback', async () => {
    wx.cloud.database.mockReturnValue({
      collection: () => ({ get: jest.fn().mockRejectedValue(new Error('fail')) })
    });
    const res = await cloudApi.getRewards();
    expect(Array.isArray(res)).toBe(true);
  });

  test('redeem success', async () => {
    wx.cloud.callFunction.mockResolvedValue({ result: { ok: true } });
    const res = await cloudApi.redeem(1);
    expect(wx.cloud.callFunction).toHaveBeenCalledWith({ name: 'redeem', data: { id: 1 } });
    expect(res).toEqual({ ok: true });
  });

  test('redeem fail fallback', async () => {
    wx.cloud.callFunction.mockRejectedValue(new Error('fail'));
    const res = await cloudApi.redeem(1);
    expect(res).toEqual({ ok: true });
  });

  test('getUserInfo success', async () => {
    global.getApp = () => ({ globalData: { openid: 'o1' } });
    wx.cloud.database.mockReturnValue({
      collection: () => ({ doc: () => ({ get: jest.fn().mockResolvedValue({ data: { _id: 'o1' } }) }) })
    });
    const res = await cloudApi.getUserInfo();
    expect(res._id).toBe('o1');
  });

  test('getUserInfo failure fallback', async () => {
    global.getApp = () => ({ globalData: { openid: 'o1' } });
    wx.cloud.database.mockReturnValue({
      collection: () => ({ doc: () => ({ get: jest.fn().mockRejectedValue(new Error('fail')) }) })
    });
    const res = await cloudApi.getUserInfo();
    expect(res).toHaveProperty('openid');
  });
});
