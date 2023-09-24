import { type DatabaseOperations } from '@/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDBClient = (req: any) => {
  return req.db as DatabaseOperations;
};
