import { ObjectId } from 'mongodb';
import { removeCache } from '../../utils/cache.js';
import { getDateTime, getDateTimeStamp } from '../../utils/date.js';
import { sendSocketEvent } from '../../utils/socket.js';
import * as pairsModel from './../pairs/pairs.model.js';
import * as ordersModel from './orders.model.js';

export const create = async (requestData) => {
  const { actionType, amount, orderType, pairKey, price } = requestData;
  let requestDataCheck = false;

  if (actionType && amount && orderType && pairKey && price) {
    requestDataCheck = true;
  }

  if (requestDataCheck) {
    const pairDetail = await pairsModel.findOne({ key: pairKey });

    if (pairDetail?.status === 'success') {
      const result = await ordersModel.insertOne({
        actionType,
        amount: parseFloat(amount),
        insertDateTime: getDateTime(),
        insertDateTimeStamp: getDateTimeStamp(),
        itemId: await ordersModel.getItemId(),
        orderType,
        pairId: new ObjectId(pairDetail?.data?._id),
        price: parseFloat(price),
        total: parseFloat(price) * amount,
      });

      if (result?.status === 'success') {
        if (orderType === 'market') {
          await removeCache(`orders-findAllByItemMarket-${pairDetail?.data?._id}`);
        }
        if (orderType === 'limit') {
          await removeCache(`orders-findAllByItemLimitBuy-${pairDetail?.data?._id}`);
          await removeCache(`orders-findAllByItemLimitSell-${pairDetail?.data?._id}`);
        }
        sendSocketEvent(`pairs-${pairDetail?.data?.key}-order-${orderType}`, result?.data);
        return {
          message: 'Order successfully created',
          status: 'success',
        };
      }

      return {
        message: 'An error occurred',
        status: 'failed',
      };
    }
    return {
      message: 'Pair not found',
      status: 'failed',
    };
  }

  return {
    message: 'Please fill required fields',
    status: 'failed',
  };
};

export const findAllByItemLimit = async (id) => {
  const pairDetail = await pairsModel.findOne({
    cacheKey: `pairs-findAllByItemLimit-${id}`,
    filter: { key: id },
  });
  const ordersBuy = await ordersModel.findAll({
    cacheKey: `orders-findAllByItemLimitBuy-${pairDetail?.data?._id}`,
    filter: {
      actionType: 'buy',
      orderType: 'limit',
      pairId: new ObjectId(pairDetail?.data?._id),
    },
    limit: 10,
    sort: { price: -1 },
  });
  const ordersSell = await ordersModel.findAll({
    cacheKey: `orders-findAllByItemLimitSell-${pairDetail?.data?._id}`,
    filter: {
      actionType: 'sell',
      orderType: 'limit',
      pairId: new ObjectId(pairDetail?.data?._id),
    },
    limit: 10,
    sort: { price: -1 },
  });

  return {
    data: {
      groups: {
        buy: ordersBuy?.data,
        sell: ordersSell?.data,
      },
    },
    status: 'success',
  };
};

export const findAllByItemMarket = async (id) => {
  const pairDetail = await pairsModel.findOne({
    cacheKey: `pairs-findAllByItemMarket-${id}`,
    filter: { key: id },
  });
  const items = await ordersModel.findAll({
    cacheKey: `orders-findAllByItemMarket-${pairDetail?.data?._id}`,
    filter: {
      orderType: 'market',
      pairId: new ObjectId(pairDetail?.data?._id),
    },
    limit: 10,
    sort: { insertDateTimeStamp: -1 },
  });

  return items?.data?.length > 0
    ? { data: items.data, status: 'success' }
    : { data: null, message: 'Not found', status: 'error' };
};
