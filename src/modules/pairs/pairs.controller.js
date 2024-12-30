import * as pairsService from './pairs.service.js';

export const findOneByKey = async (req, res) => {
  res.send(await pairsService.findOneByKey(req.params.key));
};
