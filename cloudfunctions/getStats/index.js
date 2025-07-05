const cloud = require('wx-server-sdk');
const { ADMIN_OPENIDS, LOG_STATUS, LOG_TYPES } = require('../common/constants');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const logs = db.collection('Logs');
const _ = db.command;

exports.main = async () => {
  const { OPENID } = cloud.getWXContext();
  if (!ADMIN_OPENIDS.includes(OPENID)) {
    throw new Error('unauthorized');
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const res = await logs.where({
    status: LOG_STATUS.APPROVED,
    createdAt: _.gte(start),
  }).get();
  let labor = 0;
  let volunteer = 0;
  res.data.forEach((log) => {
    if (log.type === LOG_TYPES.LABOR) labor += log.minutes;
    else if (log.type === LOG_TYPES.VOLUNTEER) volunteer += log.minutes;
  });
  return { laborMinutes: labor, volunteerMinutes: volunteer };
};
