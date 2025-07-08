/* eslint-disable no-underscore-dangle */
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { value } = event;
  if (value && value.stock <= 5) {
    // placeholder: send subscribe message
    await cloud.callFunction({ name: 'notifyLowStock', data: { id: value._id } });
  }
  return {};
};
