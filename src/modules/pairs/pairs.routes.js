import express from 'express';
import * as pairsController from './pairs.controller.js';

const router = express.Router();

router.get('/key/:key', pairsController.findOneByKey);

export default router;
