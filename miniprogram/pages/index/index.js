const app = getApp();

Page({
  async handleStart() {
    console.log('[tap]', Date.now());
    wx.navigateTo({ url: '/pages/home/home' });
    try {
      const res = await wx.cloud.callFunction({ name: 'login' });
      app.globalData.openid = res.result.openid;
    } catch (e) {
      console.error(e);
    }
  },
});
