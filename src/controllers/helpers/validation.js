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

export const checkIfIsString = (value) => typeof value === 'string';

export const validateRequireFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field];
    const fieldIsEmpty =
      checkIfIsString(params[field]) &&
      validator.isEmpty(params[field], { ignore_whitespace: true });

    if (fieldIsMissing || fieldIsEmpty) {
      return {
        missingField: field,
        ok: false,
      };
    }
  }

  return {
    missingField: undefined,
    ok: true,
  };
};
