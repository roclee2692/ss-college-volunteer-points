const { getUser } = require('../../utils/mockApi');

Page({
  data: {
    totalPoints: 0,
  },
  onShow() {
    const user = getUser();
    this.setData({ totalPoints: user.totalPoints });
  },
  goSubmit() {
    wx.navigateTo({ url: '/pages/log-time/log-time' });
  },
  goRedeem() {
    wx.navigateTo({ url: '/pages/shop/shop' });
  },
});
