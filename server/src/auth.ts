import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'cdf13';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
