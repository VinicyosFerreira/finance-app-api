import validator from 'validator';
import { badRequest } from './http.js';

export const invalidAmountResponse = () => {
  return badRequest({ message: 'The amount must be a valid currency' });
};

export const invalidTypeResponse = () => {
  return badRequest({
    message: 'The type must be EARNING, EXPENSE or INVESTMENT',
  });
};

export const checkIfAmountIsValid = (amount) => {
  return validator.isCurrency(amount.toString(), {
    allow_negatives: false,
    digits_after_decimal: [2],
    decimal_separator: '.',
  });
};

export const checkIfTypeIsValid = (type) => {
  return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type);
};
