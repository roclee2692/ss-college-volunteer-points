const { ADMIN_OPENIDS, LOG_STATUS } = require('../../../../cloudfunctions/common/constants');

Page({
  data: { logs: [] },
  async onShow() {
    const { openid } = getApp().globalData;
    if (!ADMIN_OPENIDS.includes(openid)) {
      wx.navigateBack();
      return;
    }
    const db = wx.cloud.database();
    const res = await db.collection('Logs').where({ status: LOG_STATUS.PENDING }).get();
    this.setData({ logs: res.data });
  },
  async handleApprove(e) {
    const { id } = e.currentTarget.dataset;
    await wx.cloud.callFunction({ name: 'approveLog', data: { logId: id } });
    // eslint-disable-next-line no-underscore-dangle
    this.setData({ logs: this.data.logs.filter((log) => log._id !== id) });
  },
});
