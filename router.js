import { getElem, createElem, deleteElem, updateElem } from "./controller.js";
import express from 'express';

const router = express.Router();

router.get('/elements/:elemId', getElem);
router.post('/elements', createElem);
router.put('/elements/:elemId', updateElem);
router.delete('/elements/:elemId', deleteElem);

router.post('/echo', (req, res) => res.status(200).json(req.body));

export default router;
