import { badRequest } from './http.js';
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

export const checkIfPasswordIsValid = (password) => {
  return password.length >= 6;
};

export const checkIfEmailIsValid = (email) => {
  return validator.isEmail(email);
};
