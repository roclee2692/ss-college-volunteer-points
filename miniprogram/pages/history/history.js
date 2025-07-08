Page({
  data: {
    logs: [],
    loading: true,
  },
  async onShow() {
    this.setData({ loading: true });
    try {
      const db = wx.cloud.database();
      const { openid } = getApp().globalData;
      const res = await db
        .collection('Logs')
        .where({ userId: openid })
        .get();
      this.setData({ logs: res.data });
    } catch (e) {
      // ignore fetch failure
    }
    this.setData({ loading: false });
  },
});
