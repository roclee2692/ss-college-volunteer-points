const simulate = require('miniprogram-simulate');
const { LOG_STATUS } = require('../miniprogram/common/constants');
const { LOG_TYPES } = require('../common/constants');

let def;
let originalPage;

beforeAll(() => {
  originalPage = global.Page;
  global.Page = (obj) => { def = obj; };
  global.getApp = () => ({ globalData: { openid: 'u1' } });
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/history/history');
});

afterAll(() => {
  global.Page = originalPage;
});

wx.cloud = {
  database: () => ({
    collection: () => ({
      where: () => ({
        get: jest.fn().mockResolvedValue({
          data: [
            {
              _id: '1', type: LOG_TYPES.LABOR, minutes: 10, status: LOG_STATUS.APPROVED, remark: 'r1',
            },
          ],
        }),
      }),
    }),
  }),
};

const loadPage = async () => {
  const id = await simulate.load({
    template: '<view></view>',
    methods: { onShow: def.onShow },
    data: def.data,
  });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

test('history page fetches logs', async () => {
  const page = await loadPage();
  await page.instance.onShow();
  expect(page.instance.data.logs.length).toBe(1);
  expect(page.instance.data.logs[0].minutes).toBe(10);
});
