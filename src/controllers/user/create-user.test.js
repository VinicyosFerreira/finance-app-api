import { CreateUserController } from './create-user.js';

describe('Create User Controller', () => {
  it('should return 201 when creating a user successfully', async () => {
    // stub
    class CreateUserUseCaseStub {
      execute(user) {
        return user;
      }
    }

    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(
      createUserUseCaseStub
    );
    const httpRequest = {
      body: {
        first_name: 'vinicyos',
        last_name: 'ferreira',
        email: 'vinif@11.com',
        password: '12345678',
      },
    };

    // act
    const result = await createUserController.execute(httpRequest);

    // assert
    expect(result.statusCode).toBe(201);
    expect(result.body).not.toBeUndefined();
  });
});
