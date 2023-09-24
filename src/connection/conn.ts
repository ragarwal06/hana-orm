import hana from '@sap/hana-client';
import xsenv from '@sap/xsenv';

export interface ConnectionParams {
  lastUpdated?: Date;
  conn?: hana.Connection;
}

export const connection: ConnectionParams = {};

export const hanaConfig = () => {
  return xsenv.cfServiceCredentials({ tag: 'hana' });
};

export const createClient = (config: hana.ConnectionOptions, override = false) => {
  return new Promise<hana.Connection>((resolve, reject) => {
    if (!override && connection?.conn != undefined) return resolve(connection.conn);
    if (connection?.conn != undefined) connection.conn.disconnect();
    const conn = hana.createConnection();
    try {
      conn.connect(config, (err) => {
        if (err) reject(err);
        connection.conn = conn;
        connection.lastUpdated = new Date();
        resolve(conn);
      });
    } catch (error) {
      reject(error);
    }
  });
};
