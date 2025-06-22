export interface UserToken {
  userId: number;
  nome: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserToken;
    }
  }
}
