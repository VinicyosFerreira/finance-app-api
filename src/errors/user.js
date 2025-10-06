export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`The provided e-mail ${email} already in use`);
    this.name = 'EmailAlreadyInUseError';
  }
}
