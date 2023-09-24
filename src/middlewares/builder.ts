import { connection } from '@/connection/conn.js';
import { HanaOrm } from '@/connection/orm.js';
import { find, findOne } from '@/operations/find.js';
import { insert } from '@/operations/insert.js';
import { remove } from '@/operations/remove.js';
import { update } from '@/operations/update.js';
import { type GenericType } from '@/types/generic.js';

export interface DatabaseOperations {
  insert: typeof insert;
  find: typeof find;
  findOne: typeof findOne;
  update: typeof update;
  remove: typeof remove;
  prepareForTable: <T extends GenericType>(tableName: string) => HanaOrm<T>;
}

export const databaseOperations = (): DatabaseOperations => {
  return {
    insert, // create
    find, // read
    findOne, // read
    update, // update
    remove, // remove
    prepareForTable: <T extends GenericType>(tableName: string) => {
      const conn = connection.conn;
      if (conn == undefined) throw new Error('Hana client not ready');
      return new HanaOrm<T>(conn, tableName);
    },
  };
};
