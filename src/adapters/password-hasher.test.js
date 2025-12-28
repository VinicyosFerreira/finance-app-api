import { faker } from '@faker-js/faker';
import { PasswordHasherAdapter } from './password-hasher.js';
describe('PasswordHasherAdapter', () => {
  it('should hash password correctly', async () => {
    const sut = new PasswordHasherAdapter();
    const password = faker.internet.password();
    const hashedPassword = await sut.execute(password);

    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toBe(password);
  });
});
