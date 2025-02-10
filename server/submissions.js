import express from 'express';
import { getSheetValues, appendSheetValues } from './sheetsService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await getSheetValues({ auth: res.locals.googleAuth });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { data } = req.body;
  const update = await appendSheetValues({ auth: res.locals.googleAuth, data });
  res.json(update);
});

export default router;
