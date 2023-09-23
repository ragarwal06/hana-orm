import { type GenericType } from '@/types/generic.js';
import { type SharedArgs } from '../types/shared-types.js';
import { type ActionReturnType } from '@/types/actions-sql-types.js';
import { query } from './query.js';

/**
 * @interface InsertArgs<T>
 * @prop {Partial<T>} data the key-value pair data to be inserted
 */
export interface InsertArgs<T> {
  data: T;
}

/**
 * Insert the query in the database
 * @param {T | GenericType} data the object with key(column)-value pair
 * @returns {ActionReturnType} the query for preparation with values
 */
const insertQuery = <T extends GenericType>({
  data,
  tableName,
}: InsertArgs<T> & SharedArgs): ActionReturnType => {
  const keys = Object.keys(data);
  const columns = keys.join(', ');
  const values = keys.map(() => '?').join(', ');

  return [`INSERT INTO ${tableName} (${columns}) VALUES (${values})`, Object.values(keys)];
};

/**
 * Insert the query in the database
 * @param {InsertArgs<T>} args the required data to be inserted
 * @param {string} tableName the table name to do operations on
 * @returns {Promise<boolean>} the query for preparation
 */
export const insert = async <T extends GenericType>(
  args: InsertArgs<T>,
  tableName: string
): Promise<boolean> => {
  try {
    const [sql, values] = insertQuery({
      ...args,
      tableName: tableName,
    });
    await query<number>({ query: sql, values });
  } catch (e) {
    return false;
  }
  return Promise.resolve(true);
};
