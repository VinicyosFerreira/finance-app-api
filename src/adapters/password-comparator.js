import bycrpt from 'bcrypt';
export class PasswordComparatorAdapter {
  async execute(password, hashedPassword) {
    return await bycrpt.compare(password, hashedPassword);
  }
}
