import { type ActionReturnType } from '@/types/actions-sql-types.js';
import { type GenericType } from '@/types/generic.js';
import { type SharedArgs } from '@/types/shared-types.js';
import { query } from './query.js';

/**
 * @interface DeleteArgs<T>
 * @property {Partial<T>} conditions the required conditions
 * @property {string} clause the required clause
 */
export interface DeleteArgs<T> {
  conditions: Partial<T>;
  clause?: 'AND' | 'OR';
}

/**
 * delete the data in the database
 * @param {DeleteArgs<T> & SharedArgs} data the required data to be processed
 * @returns {ActionReturnType} the query for preparation with values
 */
const removeQuery = <T extends GenericType>({
  conditions = {},
  tableName = '',
  clause = 'AND',
}: DeleteArgs<T> & SharedArgs): ActionReturnType => {
  const args = [];
  const values = [];
  for (const [key, value] of Object.entries(conditions)) {
    args.push(`${key} = ?`);
    values.push(value);
  }

  if (args.length == 0) return [`DELETE FROM ${tableName}`, values];
  return [`DELETE FROM ${tableName} WHERE ${args.join(' ' + clause + ' ')}`, values];
};

/**
 * Delete rows from table in the database
 * @param {DeleteArgs<T> & SharedArgs} args the required data to be deleted with conditions
 * @returns {Promise<number>} the number of affectedRows
 */
export const remove = <T extends GenericType>({
  conditions = {},
  clause = 'AND',
  tableName = '',
}: DeleteArgs<T> & SharedArgs): Promise<number> => {
  const [sql, values] = removeQuery({
    conditions,
    clause,
    tableName,
  });
  return query<number>({ query: sql, values });
};
