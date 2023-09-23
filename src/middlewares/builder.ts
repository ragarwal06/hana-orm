import { connection } from '@/connection/conn.js';
import { HanaOrm } from '@/connection/orm.js';
import { find } from '@/operations/find.js';
import { insert } from '@/operations/insert.js';
import { remove } from '@/operations/remove.js';
import { update } from '@/operations/update.js';
import { type GenericType } from '@/types/generic.js';

export const databaseOperations = () => {
  return {
    insert, // create
    find, // read
    update, // update
    remove, // remove
    prepareForTable: <T extends GenericType>(tableName: string) => {
      const conn = connection.conn;
      if (conn == undefined) throw new Error('Hana client not ready');
      return new HanaOrm<T>(conn, tableName);
    },
  };
};
