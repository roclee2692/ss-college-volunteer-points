const { getRewards, mockRedeem } = require('../../utils/mockApi');

Page({
  data: {
    rewards: [],
  },
  onLoad() {
    this.setData({ rewards: getRewards() });
  },
  handleRedeem(e) {
    const id = Number(e.currentTarget.dataset.id);
    const ok = mockRedeem(id);
    if (ok) {
      this.setData({ rewards: getRewards() });
      wx.showToast({ title: '兑换成功' });
    }
  },
});
