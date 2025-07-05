Page({
  data: {
    type: 'labor',
    minutes: 0,
    remark: '',
  },
  handleTypeChange(e) {
    this.setData({ type: e.detail.value });
  },
  handleMinutesChange(e) {
    this.setData({ minutes: Number(e.detail.value) });
  },
  handleRemarkChange(e) {
    this.setData({ remark: e.detail.value });
  },
  async handleSubmit() {
    try {
      await wx.cloud.callFunction({
        name: 'addLog',
        data: {
          type: this.data.type,
          minutes: this.data.minutes,
          remark: this.data.remark,
        },
      });
      wx.showToast({ title: '提交成功' });
      wx.redirectTo({ url: '/pages/history/history' });
    } catch (e) {
      // ignore submit failure
    }
  },
});
