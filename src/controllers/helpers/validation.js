import { badRequest } from './http.js';
import validator from 'validator';

export const checkIfIdIsValid = (id) => {
  return validator.isUUID(id);
};

export const invalidIdResponse = () => {
  return badRequest({ message: 'Invalid user id' });
};

export const requiredFieldsIsMissingResponse = (field) => {
  return badRequest({ message: `Missing field: ${field}` });
};
