import { getCache, setCache } from '../../utils/cache.js';
import { database } from '../../utils/db.js';

const pairs = database.collection('pairs');

export const findAll = async ({ cacheKey = '', filter = {}, limit = 0, skip = 0, sort = {} }) => {
  let cacheResult, data;

  if (cacheKey) {
    cacheResult = await getCache(cacheKey);
  }

  if (cacheResult) {
    return cacheResult
      ? { cache: true, data: cacheResult, status: 'success' }
      : { message: 'Not found', status: 'error' };
  } else {
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

    if (cacheKey) {
      await setCache(cacheKey, data);
    }
  }

  return data?.length > 0
    ? { data, status: 'success' }
    : { data: null, message: 'Not found', status: 'error' };
};

export const findOne = async ({ cacheKey = '', filter }) => {
  let cacheResult, data;

  if (cacheKey) {
    cacheResult = await getCache(cacheKey);
  }

  if (cacheResult) {
    return cacheResult
      ? { cache: true, data: cacheResult, status: 'success' }
      : { message: 'Not found', status: 'error' };
  } else {
    data = await pairs.findOne(filter);
    if (cacheKey) {
      await setCache(cacheKey, data);
    }
  }

  return data ? { data, status: 'success' } : { data: null, message: 'Not found', status: 'error' };
};
