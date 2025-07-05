const fs = require('fs');
const path = require('path');
const simulate = require('miniprogram-simulate');

test('index page navigation', () => {
  const originalPage = global.Page;
  let def;
  global.Page = (obj) => { def = obj; };
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/index/index');

  global.Page = () => {};
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/home/home');

  const originalNavigate = wx.navigateTo;
  wx.navigateTo = jest.fn();

  const template = fs.readFileSync(
    path.resolve(__dirname, '../miniprogram/pages/index/index.wxml'),
    'utf8',
  );
  const id = simulate.load({ template, methods: { handleStart: def.handleStart } });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  page.instance.handleStart();

  expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/home/home' });

  wx.navigateTo = originalNavigate;
  global.Page = originalPage;
});
