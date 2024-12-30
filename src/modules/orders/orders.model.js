import { ObjectId } from 'mongodb';
import { database } from '../../utils/db.js';

const orders = database.collection('orders');

export async function getItemId() {
  let largestItem = await orders.find().sort({ itemId: -1 }).limit(1).toArray();

  largestItem = largestItem[0];
  return largestItem?.itemId > 0 ? largestItem?.itemId + 1 : 1;
}

export const findAll = async (filter = null, sort = {}, skip = 0, limit = 0) => {
  let data;
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
