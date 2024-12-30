import { ObjectId } from 'mongodb';
import { getDateTime, getDateTimeStamp } from '../../utils/date.js';
import { sendSocketEvent } from '../../utils/socket.js';
import * as pairsModel from './../pairs/pairs.model.js';
import * as ordersModel from './orders.model.js';

export const create = async (requestData) => {
  const { amount, orderType, pairKey, price } = requestData;
  let requestDataCheck = false;

  if (amount && orderType && pairKey && price) {
    requestDataCheck = true;
  }

  if (requestDataCheck) {
    const pairDetail = await pairsModel.findOne({ key: pairKey });

    if (pairDetail?.status === 'success') {
      const result = await ordersModel.insertOne({
        amount,
        insertDateTime: getDateTime(),
        insertDateTimeStamp: getDateTimeStamp(),
        itemId: await ordersModel.getItemId(),
        orderType,
        pairId: new ObjectId(pairDetail?.data?._id),
        price,
        total: price * amount,
      });

      if (result?.status === 'success') {
        sendSocketEvent(`pair-${pairDetail?.data?.key}-order`, result?.data);
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

export const findAllGroupType = async (id) => {
  const pairDetail = await pairsModel.findOne({ key: id });
  const ordersBuy = await ordersModel.findAll(
    { orderType: 'buy', pairId: pairDetail?.data?._id },
    { price: -1 },
    0,
    10,
  );
  const ordersSell = await ordersModel.findAll(
    { orderType: 'sell', pairId: pairDetail?.data?._id },
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
    message: 'Kayıt başarıyla güncellendi',
    status: 'success',
  };
};
