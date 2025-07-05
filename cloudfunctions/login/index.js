const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const users = db.collection('Users');

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { nickName, avatarUrl } = event;

  try {
    await users.doc(OPENID).get();
  } catch (err) {
    await users.doc(OPENID).set({
      name: nickName,
      avatar: avatarUrl,
      createdAt: db.serverDate(),
    });
  }

  return { openid: OPENID, nickName, avatarUrl };
};
