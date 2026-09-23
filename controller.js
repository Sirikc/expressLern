import Book from './models/book.js'
import User from './models/user.js'
import Order from './models/order.js'

import { dbBooks, dbOrders, dbUsers } from './db/db.js';

import { ObjectId } from 'mongodb';


export async function getElem(req, res) {

  if (!req.body) {
		return res.status(400).json({ message: "Bad request" });
	}

  const { elemName} = req.body;
  const { elemId } = req.params;
  if (!ObjectId.isValid(elemId)) {
      return res.status(400).json({ message: 'Invalid ID' });
  }

  const id = new ObjectId(elemId);

  if (elemName === 'book') {
    const book = await dbBooks.findOne({ _id: id });
    return res.status(200).json({ book });
  }

  if (elemName === 'user') {
    const user = await dbUsers.findOne({ _id: id });
    return res.status(200).json({user});
  }
  if (elemName === 'order') {
    const order = await dbOrders.findOne({ _id: id });
    return res.status(200).json({ order });
  }
  res.status(404).json({message: "element not found"})
}

export async function createElem(req, res) {
  if (!req.body) {
		return res.status(400).json({ message: "Bad request" });
	}

  const elemName = req.body.elemName;

  if (elemName === 'book') {
    const { bookName } = req.body;
    const result = await dbBooks.insertOne(new Book(bookName));


    return res.status(201).json(result);
  }

  if (elemName === 'user') {
    let {userName, userAge} = req.body;
    userAge = Number(userAge);

    const result = await dbUsers.insertOne(new User(userAge, userName));

    return res.status(201).json(result);
  }

  if (elemName === 'order') {
    const { orderArrProduct, orderDate} = req.body;
    const result = await dbOrders.insertOne(new Order(orderArrProduct, orderDate));

    return res.status(201).json(result);
  }

  res.status(404).json({message: "element not found"})
}

export async function updateElem(req, res) {
  const { elemId } = req.params;
  const { elemName } = req.body;

    if (!req.body) {
        return res.status(400).json({ message: 'Bad request' });
    }

    let collection;
    let elementName;

    if (elemName === 'book') {
        collection = dbBooks;
        elementName = 'book';
    } else if (elemName === 'user') {
        collection = dbUsers;
        elementName = 'user';
    } else if (elemName === 'order') {
        collection = dbOrders;
        elementName = 'order';
    } else {
        return res.status(400).json({ message: 'Unknown element' });
    }

    if (!ObjectId.isValid(elemId)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const id = new ObjectId(elemId);

    const result = await collection.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { returnDocument: 'after' }
    );

    if (!result) {
        return res.status(404).json({
            message: `${elementName} not found`
        });
    }

    return res.status(200).json({
        [elementName]: result
    });
}

export async function deleteElem(req, res) {

  let {elemId} = req.params;
  let { elemName } = req.body;
  if (!ObjectId.isValid(elemId)) {
      return res.status(400).json({ message: 'Invalid ID' });
  }

  const id = new ObjectId(elemId);

  if (elemName === 'book') {
    const result = await dbBooks.deleteOne({_id: id})

    if (result.deletedCount === 0) {
      return res.status(404).json({message: 'element not found'})
    }

    return res.status(200).json({message: 'delete sucсsessed'})
  }

  if (elemName === 'user') {
    const result = await dbUsers.deleteOne({_id: id})

    if (result.deletedCount === 0) {
      return res.status(404).json({message: 'element not found'})
    }

    return res.status(200).json({message: 'delete sucсsessed'})

  }

  if (elemName === 'order') {
    const result = await dbOrders.deleteOne({_id: id})

        if (result.deletedCount === 0) {
          return res.status(404).json({message: 'element not found'})
        }

        return res.status(200).json({message: 'delete sucсsessed'})
  }
  res.status(404).json({message: "element not found"})
}
