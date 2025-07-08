const fs = require('fs');
const path = require('path');
const simulate = require('miniprogram-simulate');
const exparser = require('miniprogram-exparser');

let def;
let originalPage;

beforeAll(() => {
  originalPage = global.Page;
  global.Page = (obj) => { def = obj; };
  global.getApp = () => ({ globalData: {} });
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/index/index');
  global.Page = () => {};
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/home/home');
});

afterAll(() => {
  global.Page = originalPage;
});

const loadPage = async () => {
  const template = fs.readFileSync(
    path.resolve(__dirname, '../miniprogram/pages/index/index.wxml'),
    'utf8',
  );
  const id = await simulate.load({ template, methods: { handleStart: def.handleStart } });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

test('navigate even on login failure', async () => {
  wx.cloud = { callFunction: jest.fn().mockRejectedValue(new Error('fail')) };
  wx.navigateTo = jest.fn();

  const page = await loadPage();
  const button = page.dom.querySelector('wx-button');
  // eslint-disable-next-line no-underscore-dangle
  exparser.triggerEvent(button.__wxElement, 'tap');
  await simulate.sleep(0);

  expect(wx.cloud.callFunction).toHaveBeenCalledWith({ name: 'login' });
  expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/home/home' });
});
