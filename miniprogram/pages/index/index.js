const app = getApp();

Page({
  async handleStart() {
    try {
      const res = await wx.cloud.callFunction({ name: 'login' });
      app.globalData.openid = res.result.openid;
      wx.navigateTo({ url: '/pages/home/home' });
    } catch (e) {
      // ignore login failure
    }
  },
});
