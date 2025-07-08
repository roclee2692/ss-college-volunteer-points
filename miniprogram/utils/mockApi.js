const rewards = require('../mock/rewards.json');
const user = require('../mock/user.json');

function getRewards() {
  return rewards;
}

function getUser() {
  return user;
}

function mockRedeem(rewardId) {
  const reward = rewards.find((r) => r.id === rewardId);
  if (!reward || reward.stock <= 0) return false;
  if (user.totalPoints < reward.points) {
    wx.showToast({ title: '积分不足', icon: 'none' });
    return false;
  }
  reward.stock -= 1;
  user.totalPoints -= reward.points;
  user.history.push({ id: reward.id, name: reward.name, points: reward.points });
  return true;
}

module.exports = { getRewards, getUser, mockRedeem };
