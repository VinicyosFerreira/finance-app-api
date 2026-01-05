import request from 'supertest';
import { app } from '../app.cjs';
import { user, transaction } from '../tests/index.js';
import { faker } from '@faker-js/faker';
import { TransactionType } from '../generated/prisma/client.js';

describe('Transaction Routes E2E Tests', () => {
  it('POST /api/transactions/:userId return 201 and created transaction', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdTransaction, status } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        user_id: createdUser.id,
        id: undefined,
      });

    expect(status).toBe(201);
    expect(createdTransaction.user_id).toBe(createdUser.id);
    expect(createdTransaction.name).toBe(transaction.name);
    expect(createdTransaction.type).toBe(transaction.type);
    expect(String(createdTransaction.amount)).toBe(String(transaction.amount));
  });

  it('GET /api/transactions/?userId return 200 and transactions', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        user_id: createdUser.id,
        id: undefined,
      });

    const response = await request(app).get(
      `/api/transactions?userId=${createdUser.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body[0].id).toBe(createdTransaction.id);
    expect(response.body[0].user_id).toBe(createdUser.id);
    expect(response.body[0].name).toBe(createdTransaction.name);
    expect(response.body[0].type).toBe(createdTransaction.type);
    expect(String(response.body[0].amount)).toBe(
      String(createdTransaction.amount)
    );
  });

  it('PATCH /api/transactions /:transactionId return 200 and updated transaction', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        user_id: createdUser.id,
        id: undefined,
      });

    const updateTransactionPayload = {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: TransactionType.EXPENSE,
    };

    const response = await request(app)
      .patch(`/api/transactions/${createdTransaction.id}`)
      .send(updateTransactionPayload);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdTransaction.id);
    expect(response.body.user_id).toBe(createdUser.id);
    expect(response.body.name).toBe(updateTransactionPayload.name);
    expect(response.body.type).toBe(updateTransactionPayload.type);
    expect(String(response.body.amount)).toBe(
      String(updateTransactionPayload.amount)
    );
  });

  it('DELETE /api/transactions/:transactionId return 200 and deleted transaction', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        user_id: createdUser.id,
        id: undefined,
      });

    const response = await request(app).delete(
      `/api/transactions/${createdTransaction.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdTransaction.id);
  });

  it('GET /api/transactions/:transactionId return 404 when transaction not found', async () => {
    const response = await request(app).get(
      `/api/transactions/${faker.string.uuid()}`
    );
    expect(response.status).toBe(404);
  });

  it('PATCH /api/transactions/:transactionId return 404 when transaction not found', async () => {
    const response = await request(app)
      .patch(`/api/transactions/${faker.string.uuid()}`)
      .send({
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: TransactionType.EXPENSE,
      });

    expect(response.status).toBe(404);
  });

  it('DELETE /api/transactions/:transactionId return 404 when transaction not found', async () => {
    const response = await request(app).delete(
      `/api/transactions/${faker.string.uuid()}`
    );
    expect(response.status).toBe(404);
  });
});
