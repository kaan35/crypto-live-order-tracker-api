import express from 'express';
import * as ordersController from './orders.controller.js';

const router = express.Router();

router.get('/:id/group/type', ordersController.findAllGroupType);
router.post('/', ordersController.create);

export default router;
