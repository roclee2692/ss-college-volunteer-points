const fs = require('fs');
const path = require('path');
const simulate = require('miniprogram-simulate');

test('index page navigation', () => {
  let def;
  global.Page = (obj) => { def = obj; };
  require('../miniprogram/pages/index/index.js');
  wx.navigateTo = jest.fn();

  const template = fs.readFileSync(
    path.resolve(__dirname, '../miniprogram/pages/index/index.wxml'),
    'utf8'
  );
  const id = simulate.load({ template, methods: { handleStart: def.handleStart } });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  page.instance.handleStart();
  expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/home/home' });
});
