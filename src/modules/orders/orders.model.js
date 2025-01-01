import { ObjectId } from 'mongodb';
import { getCache, setCache } from '../../utils/cache.js';
import { database } from '../../utils/db.js';

const orders = database.collection('orders');

export async function getItemId() {
  let largestItem = await orders.find().sort({ itemId: -1 }).limit(1).toArray();

  largestItem = largestItem[0];
  return largestItem?.itemId > 0 ? largestItem?.itemId + 1 : 1;
}

export const findAll = async ({ cacheKey = '', filter = {}, limit = 0, skip = 0, sort = {} }) => {
  let cacheResult, data;

  if (cacheKey) {
    cacheResult = await getCache(cacheKey);
    if (cacheResult) {
      return cacheResult
        ? { cache: true, data: cacheResult, status: 'success' }
        : { message: 'Not found', status: 'error' };
    } else {
      if (sort && limit) {
        data = filter
          ? await orders.find(filter).sort(sort).skip(skip).limit(limit).toArray()
          : await orders.find().skip(skip).limit(limit).toArray();
      } else if (sort) {
        data = filter
          ? await orders.find(filter).sort(sort).toArray()
          : await orders.find().sort(sort).toArray();
      } else {
        data = filter ? await orders.find(filter).toArray() : await orders.find().toArray();
      }

      if (cacheKey) {
        await setCache(cacheKey, data);
      }
    }
  }

  return data?.length > 0
    ? { data, status: 'success' }
    : { data: null, message: 'Not found', status: 'error' };
};

export const insertOne = async (requestData) => {
  const resultData = await orders.insertOne(requestData);
  const data = await orders.findOne({
    _id: new ObjectId(resultData.insertedId),
  });

  return {
    data,
    message: 'Record successfully created',
    status: 'success',
  };
};
