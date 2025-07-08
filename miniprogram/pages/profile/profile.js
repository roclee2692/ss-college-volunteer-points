const { getUser } = require('../../utils/mockApi');

Page({
  data: {
    user: null,
    loading: true,
  },
  onShow() {
    this.setData({ user: getUser(), loading: false });
  },
});
