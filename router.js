import {
  getUser, createUser, updateUser, deleteUser,
  getBook, createBook, updateBook, deleteBook,
  getOrder, createOrder, updateOrder, deleteOrder
} from "./controller.js";
import express from 'express';
import authMiddleware from './middleware/authMiddleware.js';

const router = express.Router();

router.get('/users/:userId', authMiddleware, getUser);
router.post('/users', authMiddleware, createUser);
router.put('/users/:userId', authMiddleware, updateUser);
router.delete('/users/:userId', authMiddleware, deleteUser);

router.get('/books/:bookId', authMiddleware, getBook);
router.post('/books', authMiddleware, createBook);
router.put('/books/:bookId', authMiddleware, updateBook);
router.delete('/books/:bookId', authMiddleware, deleteBook);

router.get('/orders/:orderId', authMiddleware, getOrder);
router.post('/orders', authMiddleware, createOrder);
router.put('/orders/:orderId', authMiddleware, updateOrder);
router.delete('/orders/:orderId', authMiddleware, deleteOrder);

router.post('/echo', (req, res) => res.status(200).json(req.body));

export default router;
