App({
  onLaunch() {
    wx.cloud.init({ env: 'test-env', traceUser: true });
  },
  globalData: {},
});
