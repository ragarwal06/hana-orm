import { connection, createClient, hanaConfig } from '@/connection/conn.js';
import type hana from '@sap/hana-client';
import { type Response } from 'express';
import { databaseOperations } from './builder.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MiddlewareReturn = (req: any, _: Response, next: any) => void;

const connectDB = (config?: hana.ConnectionOptions) => {
  return new Promise((resolve, reject) => {
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

    createClient(config)
      .then((conn) => {
        resolve(conn);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const prepareClient = (config?: hana.ConnectionOptions): MiddlewareReturn => {
  connectDB(config)
    .then(() => {
      console.log('Database connected');
    })
    .catch((e) => {
      throw e;
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, _: Response, next: any) => {
    if (connection.conn != undefined) {
      req.db = databaseOperations();
      next();
      return;
    }
    throw new Error('Database client not ready');
  };
};
