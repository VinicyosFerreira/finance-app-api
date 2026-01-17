import jwt from 'jsonwebtoken';

export class TokenGeneratorAdapter {
  execute(userId) {
    const tokens = {
      access_token: jwt.sign(
        { userId: userId },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn: '15m',
        }
      ),
      refresh_token: jwt.sign(
        { userId: userId },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
          expiresIn: '30d',
        }
      ),
    };

    return tokens;
  }
}
