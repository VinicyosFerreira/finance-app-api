export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`The provided e-mail ${email} already in use`);
    this.name = 'EmailAlreadyInUseError';
  }
}

export class UserNotFoundError extends Error {
  constructor(userId) {
    super(`User with id ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden');
    this.name = 'ForbiddenError';
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Invalid password');
    this.name = 'InvalidPasswordError';
  }
}
