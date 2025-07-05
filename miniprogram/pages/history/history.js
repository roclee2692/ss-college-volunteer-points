const { LOG_STATUS } = require('../../common/constants');

Page({
  data: {
    logs: [],
  },
  async onShow() {
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
  },
});
