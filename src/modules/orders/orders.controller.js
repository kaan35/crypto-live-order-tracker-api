import * as ordersService from './orders.service.js';

export const create = async (req, res) => {
  res.send(await ordersService.create(req.body));
};

export const findAllLimit = async (req, res) => {
  res.send(await ordersService.findAllByItemLimit(req.params.id));
};

export const findAllMarket = async (req, res) => {
  res.send(await ordersService.findAllByItemMarket(req.params.id));
};
