import * as pairsModel from './pairs.model.js';

export const findOneByKey = async (key) => await pairsModel.findOne({ key });
