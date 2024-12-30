import express from 'express';
import * as ordersController from './orders.controller.js';

const router = express.Router();

router.get('/:id/limit', ordersController.findAllLimit);
router.get('/:id/market', ordersController.findAllMarket);
router.post('/', ordersController.create);

export default router;
