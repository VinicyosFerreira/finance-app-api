import jwt from 'jsonwebtoken';

export class TokenVerifierAdapter {
  execute(token, secret) {
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
  }
}
