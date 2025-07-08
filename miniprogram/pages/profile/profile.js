const { getUser } = require('../../utils/mockApi');

Page({
  data: {
    user: null,
  },
  onShow() {
    this.setData({ user: getUser() });
  },
});
