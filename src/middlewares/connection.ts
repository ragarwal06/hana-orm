import { createClient, hanaConfig } from '@/connection/conn.js';
import type hana from '@sap/hana-client';
import { type Request, type Response } from 'express';
import { databaseOperations } from './builder.js';

interface CustomRequest extends Request {
  db: ReturnType<typeof databaseOperations>;
}

export const prepareClient = (config?: hana.ConnectionOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: CustomRequest, _: Response, next: any) => {
    if (config == undefined || Object.keys(config).length == 0) {
      const configuration = hanaConfig();
      config = {
        serverNode: `${configuration.host}:${configuration.port}`,
        uid: configuration.user,
        pwd: configuration.password,
        encrypt: 'true',
        sslValidateCertificate: 'false',
        currentSchema: configuration.schema,
      };
    }

    await createClient(config);
    req.db = databaseOperations();
    next();
  };
};
