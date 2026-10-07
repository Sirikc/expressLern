import { getElem, createElem, deleteElem, updateElem } from "./controller.js";
import express from 'express';
import authMiddleware from './middleware/authMiddleware.js';

const router = express.Router();

router.get('/elements/:elemId', authMiddleware, getElem);
router.post('/elements', authMiddleware, createElem);
router.put('/elements/:elemId', authMiddleware, updateElem);
router.delete('/elements/:elemId', authMiddleware, deleteElem);

router.post('/echo', (req, res) => res.status(200).json(req.body));

export default router;
