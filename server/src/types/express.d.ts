declare global {
  namespace Express {
    interface Request {
      userId?: number; // Injected by AuthMiddleware
    }
  }
}

export {};
