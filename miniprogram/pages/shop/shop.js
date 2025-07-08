const { getRewards, redeem } = require('../../utils/cloudApi');

Page({
  data: {
    rewards: [],
  },
  async onLoad() {
    const rewards = await getRewards();
    this.setData({ rewards });
  },
  async handleRedeem(e) {
    const id = Number(e.currentTarget.dataset.id);
    const res = await redeem(id);
    if (res.ok) {
      const rewards = await getRewards();
      this.setData({ rewards });
      wx.showToast({ title: '兑换成功' });
    } else if (res.msg) {
      wx.showToast({ title: res.msg, icon: 'none' });
    }
  },
});
