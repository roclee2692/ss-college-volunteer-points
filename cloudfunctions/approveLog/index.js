const cloud = require('wx-server-sdk');
const { ADMIN_OPENIDS, LOG_STATUS, LOG_TYPES, VOLUNTEER_POINTS_MULTIPLIER } = require('../common/constants');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const logs = db.collection('Logs');
const users = db.collection('Users');
const _ = db.command;

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  if (!ADMIN_OPENIDS.includes(OPENID)) {
    throw new Error('unauthorized');
  }
  const { logId } = event;
  const logRes = await logs.doc(logId).get();
  const log = logRes.data;
  if (!log || log.status !== LOG_STATUS.PENDING) {
    return { ok: false };
  }
  await logs.doc(logId).update({ data: { status: LOG_STATUS.APPROVED } });
  const points =
    log.type === LOG_TYPES.VOLUNTEER
      ? log.minutes * VOLUNTEER_POINTS_MULTIPLIER
      : log.minutes;
  await users.doc(log.userId).update({ data: { totalPoints: _.inc(points) } });
  return { ok: true, points };
};
