import * as ordersService from './orders.service.js';

export const create = async (req, res) => {
  res.send(await ordersService.create(req.body));
};

export const findAllGroupType = async (req, res) => {
  res.send(await ordersService.findAllGroupType(req.params.id));
};
