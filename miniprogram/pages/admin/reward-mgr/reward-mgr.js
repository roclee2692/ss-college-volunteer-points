/* eslint-disable no-underscore-dangle */
const { ADMIN_OPENIDS } = require('../../common/constants');
const { addReward } = require('../../../utils/cloudApi');

Page({
  data: {
    rewards: [],
    showAdd: false,
    name: '',
    points: 0,
    stock: 0,
  },
  async onShow() {
    const { openid } = getApp().globalData;
    if (!ADMIN_OPENIDS.includes(openid)) {
      wx.navigateBack();
      return;
    }
    try {
      const db = wx.cloud.database();
      const res = await db.collection('Rewards').get();
      this.setData({ rewards: res.data });
    } catch (e) {
      // ignore
    }
  },
  openAdd() {
    this.setData({
      showAdd: true,
      name: '',
      points: 0,
      stock: 0,
    });
  },
  closeAdd() {
    this.setData({ showAdd: false });
  },
  handleNameChange(e) {
    this.setData({ name: e.detail.value });
  },
  handlePointsChange(e) {
    this.setData({ points: Number(e.detail.value) });
  },
  handleStockChange(e) {
    this.setData({ stock: Number(e.detail.value) });
  },
  async handleAdd() {
    try {
      const res = await addReward({
        name: this.data.name,
        points: this.data.points,
        stock: this.data.stock,
        img: '',
      });
      this.setData({
        rewards: this.data.rewards.concat([
          {
            _id: res._id,
            name: this.data.name,
            points: this.data.points,
            stock: this.data.stock,
            img: '',
          },
        ]),
        showAdd: false,
      });
    } catch (e) {
      // ignore
    }
  },
  handleEdit(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/admin/edit-reward/edit-reward?id=${id}` });
  },
});
