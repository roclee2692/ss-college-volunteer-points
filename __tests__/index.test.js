const fs = require('fs');
const path = require('path');
const simulate = require('miniprogram-simulate');
const exparser = require('miniprogram-exparser');

let def;

beforeAll(() => {
  global.Page = (obj) => { def = obj; };
  require('../miniprogram/pages/index/index');
  global.Page = () => {};
  require('../miniprogram/pages/home/home');
});

afterAll(() => {
  global.Page = undefined;
});

test('index page navigation', async () => {

  wx.navigateTo = jest.fn();

  const template = fs.readFileSync(
    path.resolve(__dirname, '../miniprogram/pages/index/index.wxml'),
    'utf8',
  );
  const id = simulate.load({ template, methods: { handleStart: def.handleStart } });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));

  const button = page.dom.querySelector('wx-button');
  exparser.triggerEvent(button.__wxElement, 'tap');
  await simulate.sleep(0);

  expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/home/home' });

  wx.navigateTo = originalNavigate;
  global.Page = originalPage;
});
