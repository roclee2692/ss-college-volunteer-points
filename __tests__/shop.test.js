let mockRedeem;
let getUser;
let getRewards;

({ mockRedeem, getUser, getRewards } = require('../miniprogram/utils/mockApi'));

describe('mockRedeem', () => {
  beforeEach(() => {
    jest.resetModules();
    // reload after reset
    // eslint-disable-next-line global-require
    ({ mockRedeem, getUser, getRewards } = require('../miniprogram/utils/mockApi'));
    global.wx = {};
  });

  test('success deducts points and stock', () => {
    wx.showToast = jest.fn();
    const user = getUser();
    const rewards = getRewards();
    const prevPoints = user.totalPoints;
    const prevStock = rewards[0].stock;
    const ok = mockRedeem(1);
    expect(ok).toBe(true);
    expect(user.totalPoints).toBe(prevPoints - rewards[0].points);
    expect(rewards[0].stock).toBe(prevStock - 1);
  });

  test('insufficient points toast', () => {
    wx.showToast = jest.fn();
    const user = getUser();
    const rewards = getRewards();
    user.totalPoints = 0;
    const prevStock = rewards[0].stock;
    const ok = mockRedeem(1);
    expect(ok).toBe(false);
    expect(wx.showToast).toHaveBeenCalledWith({ title: '积分不足', icon: 'none' });
    expect(user.totalPoints).toBe(0);
    expect(rewards[0].stock).toBe(prevStock);
  });
});
