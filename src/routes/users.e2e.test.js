import request from 'supertest';
import { app } from '../app.js';
import { user } from '../tests/index.js';
import { faker } from '@faker-js/faker';
import { TransactionType } from '../generated/prisma/client.js';

describe('User Routes E2E Tests', () => {
  it('POST /api/users return 201 and created user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    expect(response.status).toBe(201);
  });

  it('GET /api/users/:userId return 200 and user', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .get(`/api/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.access_token}`);

    expect(response.status).toBe(200);
  });

  it('PATCH /api/users/:userId return 200 and updated user', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const updateUserPayload = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    };

    const { body: updatedUser, status } = await request(app)
      .patch(`/api/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.access_token}`)
      .send(updateUserPayload);

    expect(status).toBe(200);
    expect(updatedUser.first_name).toBe(updateUserPayload.first_name);
    expect(updatedUser.last_name).toBe(updateUserPayload.last_name);
    expect(updatedUser.email).toBe(updateUserPayload.email);
    expect(updatedUser.password).not.toBe(updateUserPayload.password);
  });

  it('DELETE /api/users/:userID return 200 and deleted user', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .delete(`/api/users/${createdUser.id}`)
      .set('Authorization', `Bearer ${createdUser.tokens.access_token}`);
    expect(response.status).toBe(200);
  });

  it('GET api/users/:userId/balance return 200 and user balance', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    await Promise.all([
      request(app).post('/api/transactions').send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: TransactionType.EARNING,
        amount: 10000,
      }),
      request(app).post('/api/transactions').send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: TransactionType.EXPENSE,
        amount: 3000,
      }),
      request(app).post('/api/transactions').send({
        user_id: createdUser.id,
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: TransactionType.INVESTMENT,
        amount: 4000,
      }),
    ]);

    const response = await request(app)
      .get(`/api/users/${createdUser.id}/balance`)
      .set('Authorization', `Bearer ${createdUser.tokens.access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      earnings: '10000',
      expenses: '3000',
      investments: '4000',
      balance: '3000',
    });
  });

  it('POST /api/users/login return 200 and user with token when user credentials are valid', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users')
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app).post('/api/users/login').send({
      email: createdUser.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdUser);
  });
});
