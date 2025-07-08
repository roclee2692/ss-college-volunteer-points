const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const users = db.collection('Users');
const rewards = db.collection('Rewards');
const redeemColl = db.collection('Redeem');

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { id } = event;
  try {
    const userRes = await users.doc(OPENID).get();
    const rewardRes = await rewards.doc(id).get();
    const user = userRes.data;
    const reward = rewardRes.data;
    if (reward.stock <= 0) return { ok: false, msg: '库存不足' };
    if (user.totalPoints < reward.points) return { ok: false, msg: '积分不足' };
    await db.runTransaction(async (trans) => {
      await trans.collection('Rewards').doc(id).update({
        data: { stock: reward.stock - 1 },
      });
      await trans.collection('Users').doc(OPENID).update({
        data: { totalPoints: user.totalPoints - reward.points },
      });
      await trans.collection('Redeem').add({
        data: {
          userId: OPENID,
          rewardId: id,
          pointsUsed: reward.points,
          createdAt: db.serverDate(),
        },
      });
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, msg: '系统错误' };
  }
};
