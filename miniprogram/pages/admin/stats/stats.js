const { ADMIN_OPENIDS } = require('../../../common/constants');
const wxCharts = require('../../../wxcharts');

Page({
  onShow() {
    return this.refresh();
  },
  async refresh() {
    const { openid } = getApp().globalData;
    if (!ADMIN_OPENIDS.includes(openid)) {
      wx.navigateBack();
      return;
    }
    const res = await wx.cloud.callFunction({ name: 'getStats' });
    const { laborMinutes, volunteerMinutes } = res.result;
    // eslint-disable-next-line no-new, new-cap
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [
        { name: '劳动', data: laborMinutes },
        { name: '志愿', data: volunteerMinutes },
      ],
      width: 300,
      height: 200,
    });
    // returning result makes it easier for tests to assert
    // eslint-disable-next-line consistent-return
    return res;
  },
});
