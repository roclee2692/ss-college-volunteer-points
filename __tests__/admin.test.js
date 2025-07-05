const simulate = require('miniprogram-simulate');

let auditDef;
let statsDef;
let originalPage;

beforeAll(() => {
  originalPage = global.Page;
  global.Page = (obj) => { auditDef = obj; };
  require('../miniprogram/pages/admin/audit/audit');
  global.Page = (obj) => { statsDef = obj; };
  require('../miniprogram/pages/admin/stats/stats');
});

afterAll(() => {
  global.Page = originalPage;
});

const logsData = [
  { _id: '1', userId: 'u1', type: 'labor', minutes: 10, status: 'pending' },
  { _id: '2', userId: 'u1', type: 'volunteer', minutes: 20, status: 'approved' },
];
const usersData = { u1: { totalPoints: 0 } };

wx.cloud = {
  database: () => ({
    collection: () => ({
      where: () => ({
        get: jest.fn().mockResolvedValue({ data: logsData.filter((l) => l.status === 'pending') }),
      }),
    }),
  }),
  callFunction: jest.fn(async ({ name, data }) => {
    if (name === 'approveLog') {
      const log = logsData.find((l) => l._id === data.logId);
      log.status = 'approved';
      const pts = log.type === 'volunteer' ? log.minutes * 2 : log.minutes;
      usersData[log.userId].totalPoints += pts;
      return { result: { ok: true } };
    }
    if (name === 'getStats') {
      let labor = 0;
      let volunteer = 0;
      logsData.filter((l) => l.status === 'approved').forEach((l) => {
        if (l.type === 'labor') labor += l.minutes;
        else volunteer += l.minutes;
      });
      return { result: { laborMinutes: labor, volunteerMinutes: volunteer } };
    }
    return { result: {} };
  }),
};

global.getApp = () => ({ globalData: { openid: 'admin_openid' } });

const loadAudit = async () => {
  const id = await simulate.load({
    template: '<view></view>',
    methods: { onShow: auditDef.onShow, handleApprove: auditDef.handleApprove },
    data: auditDef.data,
  });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

const loadStats = async () => {
  const id = await simulate.load({
    template: '<view></view>',
    methods: { onShow: statsDef.onShow, refresh: statsDef.refresh },
  });
  const page = simulate.render(id);
  page.attach(document.createElement('parent'));
  return page;
};

test('approve then stats update', async () => {
  const auditPage = await loadAudit();
  await auditPage.instance.onShow();
  await auditPage.instance.handleApprove({ currentTarget: { dataset: { id: '1' } } });

  const statsPage = await loadStats();
  const res = await statsPage.instance.onShow();
  expect(wx.cloud.callFunction).toHaveBeenLastCalledWith({ name: 'getStats' });
  expect(res.result).toEqual({ laborMinutes: 10, volunteerMinutes: 20 });
});
