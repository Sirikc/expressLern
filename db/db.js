import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri);

await client.connect();

console.log('Connected to MongoDB');

const db = client.db('expressLernDB');

// Пользователь либо из /api/users (name + age), либо из /api/auth/register (email + password)
const userSchema = {
  bsonType: 'object',
  anyOf: [
    { required: ['name', 'age'] },
    { required: ['email', 'password'] }
  ],
  properties: {
    name: { bsonType: 'string', description: 'имя пользователя' },
    age: { bsonType: 'number', minimum: 0, description: 'возраст пользователя' },
    email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', description: 'email для входа' },
    password: { bsonType: 'string', description: 'хеш пароля в формате "salt:hash"' }
  }
};

const bookSchema = {
  bsonType: 'object',
  required: ['name'],
  properties: {
    name: { bsonType: 'string', description: 'название книги' }
  }
};

const orderSchema = {
  bsonType: 'object',
  required: ['product', 'data'],
  properties: {
    product: { bsonType: 'array', description: 'список товаров заказа' },
    data: { bsonType: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'дата заказа в формате YYYY-MM-DD' }
  }
};

async function applySchema(name, schema) {
  const validator = { $jsonSchema: schema };
  const exists = await db.listCollections({ name }).hasNext();

  if (exists) {
    await db.command({ collMod: name, validator, validationLevel: 'strict', validationAction: 'error' });
  } else {
    await db.createCollection(name, { validator, validationLevel: 'strict', validationAction: 'error' });
  }
}

await applySchema('users', userSchema);
await applySchema('books', bookSchema);
await applySchema('orders', orderSchema);

export const dbUsers = db.collection('users');
export const dbBooks = db.collection('books');
export const dbOrders = db.collection('orders');
