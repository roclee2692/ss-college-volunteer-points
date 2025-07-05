const cloud = require('wx-server-sdk');
const { ADMIN_OPENIDS } = require('../common/constants');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const logs = db.collection('Logs');
const _ = db.command;

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  if (!ADMIN_OPENIDS.includes(OPENID)) {
    throw new Error('unauthorized');
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const res = await logs.where({
    status: 'approved',
    createdAt: _.gte(start),
  }).get();
  let labor = 0;
  let volunteer = 0;
  res.data.forEach((log) => {
    if (log.type === 'labor') labor += log.minutes;
    else if (log.type === 'volunteer') volunteer += log.minutes;
  });
  return { laborMinutes: labor, volunteerMinutes: volunteer };
};
