import bycrypt from 'bcrypt';

export class PasswordHasherAdapter {
  execute(password) {
    return bycrypt.hash(password, 10);
  }
}
