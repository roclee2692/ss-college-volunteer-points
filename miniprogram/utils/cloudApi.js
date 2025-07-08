const { getRewards: getMockRewards, getUser, mockRedeem } = require('./mockApi');

function getDB() {
  return wx.cloud ? wx.cloud.database({ env: 'prod-env' }) : null;
}

async function getRewards() {
  const db = getDB();
  if (!db) return getMockRewards();
  try {
    const res = await db.collection('Rewards').get();
    return res.data;
  } catch (err) {
    return getMockRewards();
  }
}

async function redeem(id) {
  if (!wx.cloud || !wx.cloud.callFunction) {
    const ok = mockRedeem(id);
    return { ok };
  }
  try {
    const res = await wx.cloud.callFunction({ name: 'redeem', data: { id } });
    return res.result;
  } catch (err) {
    const ok = mockRedeem(id);
    return { ok };
  }
}

async function getUserInfo() {
  const db = getDB();
  if (!db) return getUser();
  try {
    const { openid } = getApp().globalData;
    const res = await db.collection('Users').doc(openid).get();
    return res.data;
  } catch (err) {
    return getUser();
  }
}

module.exports = { getRewards, redeem, getUserInfo };
