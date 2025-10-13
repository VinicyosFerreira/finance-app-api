import { badRequest, notFound } from './http.js';
import validator from 'validator';

export const invalidPasswordResponse = () => {
  return badRequest({
    message: 'Password must be at least 6 characters',
  });
};

export const invalidEmailResponse = () => {
  return badRequest({ message: 'Invalid email' });
};

export const invalidIdResponse = () => {
  return badRequest({ message: 'Invalid user id' });
};

export const userNotFoundResponse = () => {
  return notFound({ message: 'User not found' });
};

export const checkIfPasswordIsValid = (password) => {
  return password.length >= 6;
};

export const checkIfEmailIsValid = (email) => {
  return validator.isEmail(email);
};

export const checkIfIdIsValid = (id) => {
  return validator.isUUID(id);
};
