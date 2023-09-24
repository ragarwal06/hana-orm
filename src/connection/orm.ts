import { insert as insertHana, type InsertArgs } from '@/operations/insert.js';
import { find as findHana, type FindArgs } from '@/operations/find.js';
import { type GenericType } from '@/types/generic.js';
import type hana from '@sap/hana-client';
import { update as updateHana, type UpdateArgs } from '@/operations/update.js';
import { type QueryParams, query as queryHana } from '@/operations/query.js';
import { type DeleteArgs, remove as removeHana } from '@/operations/remove.js';

/**
 * Hana ORM class for SQL generics functions
 * @function insert
 * @function find
 */
export class HanaOrm<T extends GenericType> {
  // table name for the required operations
  tableName: string;

  // hana connections
  connection: hana.Connection;

  constructor(connection: hana.Connection, tableName = '') {
    this.tableName = tableName;
    this.connection = connection;
  }

  /**
   * Insert the query in the database
   * @param {InsertArgs<T>} args the required data to be inserted
   * @returns {Promise<boolean>} the query for preparation
   */
  async insert(args: InsertArgs<T>): Promise<boolean> {
    try {
      await insertHana({
        tableName: this.tableName,
        ...args,
      });
    } catch (e) {
      return false;
    }
    return Promise.resolve(true);
  }

  /**
   * Query the database table for data based on conditions
   * @param {FindArgs<T>} args the conditions along with column filters if any
   * @param {Boolean} onlyOne specify if only one value has to be returned
   * @returns {Promise<T[]>} the selected data
   */
  find<FindOne extends boolean>(
    findArgs: FindArgs<T>,
    onlyOne: FindOne
  ): Promise<FindOne extends true ? T : T[]> {
    return findHana(
      {
        ...findArgs,
        tableName: this.tableName,
      },
      onlyOne
    );
  }

  /**
   * Update the table in the database
   * @param {UpdateArgs<T>} args the required data to be update with conditions
   * @returns {Promise<number>} the number of affectedRows
   */
  update(args: UpdateArgs<T>): Promise<number> {
    return updateHana({
      tableName: this.tableName,
      ...args,
    });
  }

  /**
   * Delete rows from table in the database
   * @param {DeleteArgs<T>} args the required data to be deleted with conditions
   * @returns {Promise<number>} the number of affectedRows
   */
  remove(args: DeleteArgs<T>): Promise<number> {
    return removeHana({
      tableName: this.tableName,
      ...args,
    });
  }

  /**
   * Execute raw queries
   * @param query the raw query string
   * @returns {Promise<unknown>}
   */
  query<Return>({ query, values = [] }: Omit<QueryParams, 'conn'>): Promise<Return> {
    return queryHana<Return>({
      query,
      values,
    });
  }
}
