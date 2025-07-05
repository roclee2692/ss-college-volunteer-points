const cloud = require('wx-server-sdk');
const { LOG_STATUS } = require('../common/constants');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const logs = db.collection('Logs');

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { type, minutes, remark } = event;
  await logs.add({
    data: {
      userId: OPENID,
      type,
      minutes,
      remark,
      createdAt: db.serverDate(),
      status: LOG_STATUS.PENDING,
    },
  });
  return { ok: true };
};
