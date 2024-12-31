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
        await removeCache(`orders-findAllByItemLimit-${pairDetail?.data?._id}`);
        await removeCache(`orders-findAllByItemMarket-${pairDetail?.data?._id}`);
        sendSocketEvent(`pair-${pairDetail?.data?.key}-order-${orderType}`, result?.data);
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
  const pairDetail = await pairsModel.findOne({ key: id }, `orders-findAllByItemLimit-${id}`);
  const ordersBuy = await ordersModel.findAll(
    { actionType: 'buy', orderType: 'limit', pairId: pairDetail?.data?._id },
    { price: -1 },
    0,
    10,
  );
  const ordersSell = await ordersModel.findAll(
    { actionType: 'sell', orderType: 'limit', pairId: pairDetail?.data?._id },
    { price: -1 },
    0,
    10,
  );

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
  const pairDetail = await pairsModel.findOne({ key: id }, `orders-findAllByItemMarket-${id}`);
  const orders = await ordersModel.findAll(
    { orderType: 'market', pairId: pairDetail?.data?._id },
    { insertDateTimeStamp: -1 },
    0,
    10,
  );

  return {
    data: orders?.data,
    status: 'success',
  };
};
