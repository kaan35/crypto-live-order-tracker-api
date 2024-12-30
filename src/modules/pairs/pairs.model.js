import { database } from '../../utils/db.js';

const pairs = database.collection('pairs');

export const findAll = async (filter = null, sort = {}, skip = 0, limit = 0) => {
  let data;
  if (sort && limit) {
    data = filter
      ? await pairs.find(filter).sort(sort).skip(skip).limit(limit).toArray()
      : await pairs.find().skip(skip).limit(limit).toArray();
  } else if (sort) {
    data = filter
      ? await pairs.find(filter).sort(sort).toArray()
      : await pairs.find().sort(sort).toArray();
  } else {
    data = filter ? await pairs.find(filter).toArray() : await pairs.find().toArray();
  }

  return data?.length > 0
    ? { data, status: 'success' }
    : { data: null, message: 'Not found', status: 'error' };
};

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
