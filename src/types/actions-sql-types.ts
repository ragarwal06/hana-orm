import hana from '@sap/hana-client';

const conn = hana.createConnection();
conn.close();

export type ExecutionParams = Parameters<typeof conn.exec>;
export type ExecutionConditionValues = ExecutionParams[1];

export type ActionReturnType = [string, ExecutionConditionValues];

export interface ActionParams {
  tableName: string;
  conn: hana.Connection;
}
