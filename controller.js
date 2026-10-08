import Book from './models/book.js'
import User from './models/user.js'
import Order from './models/order.js'

import { dbBooks, dbOrders, dbUsers } from './db/db.js';

import { ObjectId } from 'mongodb';

import { validateBook, validateUser, validateOrder, validateId, validateUpdateBody } from './utils/validators.js';


export async function getUser(req, res) {
  if (!validateId(req.params.userId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const id = new ObjectId(req.params.userId);
  const user = await dbUsers.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }

  return res.status(200).json({ user });
}

export async function getBook(req, res) {
  if (!validateId(req.params.bookId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const id = new ObjectId(req.params.bookId);
  const book = await dbBooks.findOne({ _id: id });

  if (!book) {
    return res.status(404).json({ message: 'book not found' });
  }

  return res.status(200).json({ book });
}

export async function getOrder(req, res) {
  if (!validateId(req.params.orderId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const id = new ObjectId(req.params.orderId);
  const order = await dbOrders.findOne({ _id: id });

  if (!order) {
    return res.status(404).json({ message: 'order not found' });
  }

  return res.status(200).json({ order });
}


export async function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const { userName, userAge } = req.body;
  try {
    validateUser({ name: userName, age: userAge });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const result = await dbUsers.insertOne(new User(userName, userAge));

  return res.status(201).json(result);
}

export async function createBook(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const { bookName } = req.body;
  try {
    validateBook({ bookName });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const result = await dbBooks.insertOne(new Book(bookName));

  return res.status(201).json(result);
}

export async function createOrder(req, res) {
  if (!req.body) {
    return res.status(400).json({ message: 'Bad request' });
  }

  const { orderArrProduct, orderDate } = req.body;
  try {
    validateOrder({ orderArrProduct, orderDate });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const result = await dbOrders.insertOne(new Order(orderArrProduct, orderDate));

  return res.status(201).json(result);
}


export async function updateUser(req, res) {
  if (!validateId(req.params.userId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  if (!validateUpdateBody(req.body)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  const id = new ObjectId(req.params.userId);

  const result = await dbUsers.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { returnDocument: 'after' }
  );

  if (!result) {
    return res.status(404).json({ message: 'user not found' });
  }

  return res.status(200).json({ user: result });
}

export async function updateBook(req, res) {
  if (!validateId(req.params.bookId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  if (!validateUpdateBody(req.body)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  const id = new ObjectId(req.params.bookId);

  const result = await dbBooks.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { returnDocument: 'after' }
  );

  if (!result) {
    return res.status(404).json({ message: 'book not found' });
  }

  return res.status(200).json({ book: result });
}

export async function updateOrder(req, res) {
  if (!validateId(req.params.orderId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  if (!validateUpdateBody(req.body)) {
    return res.status(400).json({ message: 'Bad request' });
  }
  const id = new ObjectId(req.params.orderId);

  const result = await dbOrders.findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { returnDocument: 'after' }
  );

  if (!result) {
    return res.status(404).json({ message: 'order not found' });
  }

  return res.status(200).json({ order: result });
}


export async function deleteUser(req, res) {
  if (!validateId(req.params.userId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const id = new ObjectId(req.params.userId);

  const result = await dbUsers.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'user not found' });
  }

  return res.status(200).json({ message: 'user deleted' });
}

export async function deleteBook(req, res) {
  if (!validateId(req.params.bookId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const id = new ObjectId(req.params.bookId);

  const result = await dbBooks.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'book not found' });
  }

  return res.status(200).json({ message: 'book deleted' });
}

export async function deleteOrder(req, res) {
  if (!validateId(req.params.orderId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const id = new ObjectId(req.params.orderId);

  const result = await dbOrders.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'order not found' });
  }

  return res.status(200).json({ message: 'order deleted' });
}
