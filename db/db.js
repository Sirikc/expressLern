import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri);

await client.connect();

console.log('Connected to MongoDB');

const db = client.db('expressLernDB');

export const dbUsers = db.collection('users');
export const dbBooks = db.collection('books');
export const dbOrders = db.collection('orders');
