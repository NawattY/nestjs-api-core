// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      merchantId?: number;
      branchId?: number;
      locale?: string;
    }
  }
}
