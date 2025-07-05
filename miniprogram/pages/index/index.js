Page({
  async handleStart() {
    try {
      await wx.cloud.callFunction({ name: 'login' });
      wx.navigateTo({ url: '/pages/home/home' });
    } catch (e) {
      // ignore login failure
    }
  },
});
