import jwt from 'jsonwebtoken';
import { unauthorized } from '../controllers/helpers/http.js';
export const auth = (req, res, next) => {
  try {
    const accessToken = req.headers?.authorization?.split('Bearer ')[1];

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.log(error);
    return unauthorized({ message: 'Unauthorized' });
  }
};
