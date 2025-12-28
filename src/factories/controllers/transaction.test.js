import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from '../../controllers/index.js';
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from './transaction.js';

describe('Transaction Controller Factory', () => {
  it('should return a valid CreateTransactionController', () => {
    const sut = makeCreateTransactionController();
    expect(sut).toBeInstanceOf(CreateTransactionController);
  });

  it('should return a valid DeleteTransactionController', () => {
    const sut = makeDeleteTransactionController();
    expect(sut).toBeInstanceOf(DeleteTransactionController);
  });

  it('should return a valid GetTransactionByUserIdController', () => {
    const sut = makeGetTransactionByUserIdController();
    expect(sut).toBeInstanceOf(GetTransactionByUserIdController);
  });

  it('should return a valid UpdateTransactionController', () => {
    const sut = makeUpdateTransactionController();
    expect(sut).toBeInstanceOf(UpdateTransactionController);
  });
});
