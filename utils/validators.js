import { ObjectId } from 'mongodb';

const isNumber = (value) => typeof value === 'number' && !Number.isNaN(value);
const isString = (value) => typeof value === 'string';
const isArray = (value) => Array.isArray(value);
const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

export function validatePassword(password) {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/;

  return regex.test(password);
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

export function validateId(id) {
  return ObjectId.isValid(id);
}

export function validateUpdateBody(body) {
  return isObject(body) && Object.keys(body).length > 0 && !('_id' in body);
}

export function validateUser(user) {
  if (!isNumber(user.age)) throw new Error('Age must be a number');
  if (!isString(user.name)) throw new Error('Name must be a string');
}

export function validateBook(book) {
  if (!isString(book.bookName)) throw new Error('bookName must be a string');

}

export function validateOrder(order) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!isArray(order.orderArrProduct)) throw new Error('orderArrProduct must be an array');
  if (!isString(order.orderDate)) throw new Error('orderDate must be a string');
  if (!regex.test(order.orderDate)) throw new Error('orderDate must be in the format YYYY-MM-DD');
}
