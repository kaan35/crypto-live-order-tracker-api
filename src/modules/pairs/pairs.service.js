import * as pairsModel from './pairs.model.js';

export const findAllSortedByTitle = async () =>
  await pairsModel.findAll({
    cacheKey: 'pairs-findAllSortedByTitle',
    sort: { title: 1 },
  });

export const findOneByKey = async (key) =>
  await pairsModel.findOne({
    cacheKey: `pairs-findOneByKey-${key}`,
    filter: { key },
  });
