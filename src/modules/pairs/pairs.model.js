import { database } from '../../utils/db.js';

const pairs = database.collection('pairs');

export const findOne = async (filter) => {
  let data, error;
  try {
    data = await pairs.findOne(filter);
  } catch (e) {
    error = e.message;
  }

  return data
    ? { data, status: 'success' }
    : {
        error,
        message: 'Kayıt bulunamadı',
        status: 'failed',
      };
};
