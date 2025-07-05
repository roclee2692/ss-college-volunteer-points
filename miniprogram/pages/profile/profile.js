Page({
  data: {
    name: '',
    studentId: '',
  },
  onNameChange(e) {
    this.setData({ name: e.detail });
  },
  onIdChange(e) {
    this.setData({ studentId: e.detail });
  },
  handleSubmit() {
    wx.showToast({ title: '保存成功', icon: 'success' });
    wx.navigateBack();
  },
});
