const { ADMIN_OPENIDS } = require('../../common/constants');
const { updateReward, deleteReward, uploadImage } = require('../../../utils/cloudApi');

Page({
  data: {
    id: '',
    name: '',
    points: 0,
    stock: 0,
    img: '',
  },
  async onLoad(options) {
    const { openid } = getApp().globalData;
    if (!ADMIN_OPENIDS.includes(openid)) {
      wx.navigateBack();
      return;
    }
    const { id } = options;
    this.setData({ id });
    try {
      const db = wx.cloud.database();
      const res = await db.collection('Rewards').doc(id).get();
      this.setData(res.data);
    } catch (e) {
      // ignore
    }
  },
  handlePointsChange(e) {
    this.setData({ points: Number(e.detail.value) });
  },
  handleStockChange(e) {
    this.setData({ stock: Number(e.detail.value) });
  },
  async handleChooseImage() {
    try {
      const choose = await wx.chooseImage({ count: 1 });
      const { fileID } = await uploadImage(choose.tempFilePaths[0]);
      this.setData({ img: fileID });
    } catch (e) {
      // ignore
    }
  },
  async handleUpdate() {
    try {
      await updateReward(this.data.id, {
        points: this.data.points,
        stock: this.data.stock,
        img: this.data.img,
      });
      wx.navigateBack();
    } catch (e) {
      // ignore
    }
  },
  async handleDelete() {
    try {
      await deleteReward(this.data.id);
      wx.navigateBack();
    } catch (e) {
      // ignore
    }
  },
});
