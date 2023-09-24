import { type ExecutionParams } from '@/types/actions-sql-types.js';
import type hana from '@sap/hana-client';
import { connection } from '@/connection/conn.js';

export interface QueryParams {
  query: ExecutionParams[0];
  values?: ExecutionParams[1];
  conn?: hana.Connection;
}

/**
 * Execute queries
 * @param query the query string
 * @param values the query values if any
 * @returns<ReturnType> unknow for DDL, number of affectedRows for DML & values for DAL
 */
export const query = <ReturnType>({
  query,
  values = [],
  conn = connection.conn,
}: QueryParams): Promise<ReturnType> => {
  return new Promise<ReturnType>((resolve, reject) => {
    if (!conn) throw new Error('Hana client is not ready');
    conn.exec(query, values, (err, result) => {
      if (err) reject(err);
      resolve(result as ReturnType);
    });
  });
};
