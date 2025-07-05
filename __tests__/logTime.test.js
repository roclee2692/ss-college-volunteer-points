const simulate = require('miniprogram-simulate');

let def;
let originalPage;

beforeAll(() => {
  originalPage = global.Page;
  global.Page = (obj) => { def = obj; };
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/log-time/log-time');
});

afterAll(() => {
  global.Page = originalPage;
});

const loadPage = async () => {
  const id = await simulate.load({
    template: '<view></view>',
    methods: {
      handleSubmit: def.handleSubmit,
      handleTypeChange: def.handleTypeChange,
      handleMinutesChange: def.handleMinutesChange,
      handleRemarkChange: def.handleRemarkChange,
    },
    data: def.data,
  });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

test('addLog called on submit', async () => {
  wx.cloud = { callFunction: jest.fn().mockResolvedValue({}) };
  wx.showToast = jest.fn();
  wx.redirectTo = jest.fn();

  const page = await loadPage();
  page.instance.handleTypeChange({ detail: { value: 'volunteer' } });
  page.instance.handleMinutesChange({ detail: { value: '30' } });
  page.instance.handleRemarkChange({ detail: { value: 'remark' } });

  await page.instance.handleSubmit();

  expect(wx.cloud.callFunction).toHaveBeenCalledWith({
    name: 'addLog',
    data: { type: 'volunteer', minutes: 30, remark: 'remark' },
  });
});
