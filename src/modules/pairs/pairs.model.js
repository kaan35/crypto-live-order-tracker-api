import { getCache, setCache } from '../../utils/cache.js';
import { database } from '../../utils/db.js';

const pairs = database.collection('pairs');

export const findAll = async ({
  cacheKey = null,
  filter = null,
  sort = {},
  skip = 0,
  limit = 0,
}) => {
  let cacheResult, data;

  if (cacheKey) {
    cacheResult = await getCache(cacheKey);
    if (cacheResult) {
      return cacheResult
        ? { cache: true, data: cacheResult, status: 'success' }
        : { message: 'Not found', status: 'error' };
    }
  }

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

  if (cacheKey) await setCache(cacheKey, data);

  return data?.length > 0
    ? { data, status: 'success' }
    : { data: null, message: 'Not found', status: 'error' };
};

export const findOne = async (filter, cacheKey = null) => {
  let cacheResult, data, error;

  if (cacheKey) {
    cacheResult = await getCache(cacheKey);
    if (cacheResult) {
      return cacheResult
        ? { cache: true, data: cacheResult, status: 'success' }
        : { message: 'Not found', status: 'error' };
    }
  }

  try {
    data = await pairs.findOne(filter);
  } catch (e) {
    error = e.message;
  }

  if (cacheKey) await setCache(cacheKey, data);

  return data
    ? { data, status: 'success' }
    : {
        error,
        message: 'Kayıt bulunamadı',
        status: 'failed',
      };
};
