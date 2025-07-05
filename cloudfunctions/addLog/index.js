const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const logs = db.collection('Logs');

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { type, minutes } = event;
  await logs.add({
    data: {
      userId: OPENID,
      type,
      minutes,
      createdAt: db.serverDate(),
      status: 'pending',
    },
  });
  return { ok: true };
};
