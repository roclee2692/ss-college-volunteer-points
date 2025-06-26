const fs = require('fs');
const path = require('path');

const wx = { navigateTo: jest.fn() };

global.wx = wx;

test('index page script and template', () => {
  let pageInstance;
  global.Page = (obj) => { pageInstance = obj; };
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/index/index.js');

  pageInstance.handleStart();
  expect(wx.navigateTo).toHaveBeenCalledWith({ url: '/pages/home/home' });

  const wxmlPath = path.resolve(__dirname, '../miniprogram/pages/index/index.wxml');
  const content = fs.readFileSync(wxmlPath, 'utf8');
  expect(content).toMatch('善水书院积分系统');
});

