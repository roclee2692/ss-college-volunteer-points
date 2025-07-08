const { getUserInfo } = require('../../utils/cloudApi');

Page({
  data: {
    user: null,
  },
  async onShow() {
    const user = await getUserInfo();
    this.setData({ user });
  },
});
