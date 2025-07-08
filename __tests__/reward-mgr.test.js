/* eslint-disable no-underscore-dangle */
const simulate = require('miniprogram-simulate');
const { ADMIN_OPENIDS } = require('../miniprogram/common/constants');

let mgrDef;
let editDef;
let originalPage;

beforeAll(() => {
  originalPage = global.Page;
  global.Page = (obj) => { mgrDef = obj; };
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/admin/reward-mgr/reward-mgr');
  global.Page = (obj) => { editDef = obj; };
  // eslint-disable-next-line global-require
  require('../miniprogram/pages/admin/edit-reward/edit-reward');
});

afterAll(() => {
  global.Page = originalPage;
});

global.getApp = () => ({ globalData: { openid: ADMIN_OPENIDS[0] } });

const loadMgr = async () => {
  const id = await simulate.load({
    template: '<view></view>',
    methods: {
      onShow: mgrDef.onShow,
      openAdd: mgrDef.openAdd,
      closeAdd: mgrDef.closeAdd,
      handleAdd: mgrDef.handleAdd,
      handleNameChange: mgrDef.handleNameChange,
      handlePointsChange: mgrDef.handlePointsChange,
      handleStockChange: mgrDef.handleStockChange,
    },
    data: mgrDef.data,
  });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

const loadEdit = async () => {
  const id = await simulate.load({
    template: '<view></view>',
    methods: {
      onLoad: editDef.onLoad,
      handleUpdate: editDef.handleUpdate,
      handleDelete: editDef.handleDelete,
      handlePointsChange: editDef.handlePointsChange,
      handleStockChange: editDef.handleStockChange,
    },
    data: editDef.data,
  });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

test('add reward success', async () => {
  const add = jest.fn().mockResolvedValue({ _id: 'n1' });
  wx.cloud = {
    database: () => ({
      collection: () => ({
        get: jest.fn().mockResolvedValue({ data: [] }),
        add,
      }),
    }),
  };
  const page = await loadMgr();
  await page.instance.onShow();
  page.instance.handleNameChange({ detail: { value: 'A' } });
  page.instance.handlePointsChange({ detail: { value: '1' } });
  page.instance.handleStockChange({ detail: { value: '2' } });
  await page.instance.handleAdd();
  expect(add).toHaveBeenCalled();
  expect(page.instance.data.rewards.length).toBe(1);
});

test('add reward fail', async () => {
  const add = jest.fn().mockRejectedValue(new Error('fail'));
  wx.cloud = {
    database: () => ({
      collection: () => ({
        get: jest.fn().mockResolvedValue({ data: [] }),
        add,
      }),
    }),
  };
  const page = await loadMgr();
  await page.instance.onShow();
  page.instance.handleNameChange({ detail: { value: 'A' } });
  page.instance.handlePointsChange({ detail: { value: '1' } });
  page.instance.handleStockChange({ detail: { value: '2' } });
  await page.instance.handleAdd();
  expect(page.instance.data.rewards.length).toBe(0);
});

test('update reward success', async () => {
  const update = jest.fn().mockResolvedValue({});
  const doc = {
    get: jest.fn().mockResolvedValue({
      data: {
        _id: 'r1',
        name: 'A',
        points: 1,
        stock: 1,
        img: '',
      },
    }),
    update,
    remove: jest.fn().mockResolvedValue({}),
  };
  wx.cloud = {
    database: () => ({
      collection: () => ({
        doc: () => doc,
      }),
    }),
  };
  wx.navigateBack = jest.fn();
  const page = await loadEdit();
  await page.instance.onLoad({ id: 'r1' });
  page.instance.handlePointsChange({ detail: { value: '5' } });
  page.instance.handleStockChange({ detail: { value: '6' } });
  await page.instance.handleUpdate();
  expect(update).toHaveBeenCalled();
});

test('delete reward fail', async () => {
  const remove = jest.fn().mockRejectedValue(new Error('fail'));
  const doc = {
    get: jest.fn().mockResolvedValue({
      data: {
        _id: 'r1',
        name: 'A',
        points: 1,
        stock: 1,
        img: '',
      },
    }),
    update: jest.fn().mockResolvedValue({}),
    remove,
  };
  wx.cloud = {
    database: () => ({
      collection: () => ({
        doc: () => doc,
      }),
    }),
  };
  wx.navigateBack = jest.fn();
  const page = await loadEdit();
  await page.instance.onLoad({ id: 'r1' });
  await page.instance.handleDelete();
  expect(remove).toHaveBeenCalled();
  expect(wx.navigateBack).not.toHaveBeenCalled();
});
