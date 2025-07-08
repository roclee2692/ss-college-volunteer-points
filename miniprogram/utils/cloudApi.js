function addReward(data) {
  const db = wx.cloud.database();
  return db.collection('Rewards').add({ data });
}

function updateReward(id, data) {
  const db = wx.cloud.database();
  return db.collection('Rewards').doc(id).update({ data });
}

function deleteReward(id) {
  const db = wx.cloud.database();
  return db.collection('Rewards').doc(id).remove();
}

function uploadImage(filePath) {
  return wx.cloud.uploadFile({
    cloudPath: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    filePath,
  });
}

module.exports = {
  addReward,
  updateReward,
  deleteReward,
  uploadImage,
};
