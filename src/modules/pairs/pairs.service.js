import * as pairsModel from './pairs.model.js';

export const findAllSortedByTitle = async () => {
  const items = await pairsModel.findAll({
    cacheKey: 'pairs-findAllSortedByTitle',
    sort: { title: 1 },
  });

  return items?.data?.length > 0
    ? { data: items?.data, status: 'success' }
    : { data: null, message: 'Not found', status: 'error' };
};

export const findOneByKey = async (key) => await pairsModel.findOne({ key });
