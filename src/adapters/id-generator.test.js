import { IdGeneratorAdapter } from './id-generator.js';

describe('IdGeneratorAdapter', () => {
  it('should generate random id correctly', () => {
    const sut = new IdGeneratorAdapter();
    const id = sut.execute();

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });
});
