import { type ActionReturnType } from '@/types/actions-sql-types.js';
import { type GenericType } from '@/types/generic.js';
import { type SharedArgs } from '@/types/shared-types.js';
import { query } from './query.js';

/**
 * @interface FindArgs<T>
 * @property {Partial<T>} conditions the required conditions
 * @property {(keyof T)[]} columnNames the column names
 */
export interface FindArgs<T> {
  conditions: Partial<T>;
  columnNames: Array<keyof T>;
  clause?: 'AND' | 'OR';
}

/**
 * Insert the query in the database
 * @param {FindArgs<T>} data the required data to be found based on conditions
 * @returns {ActionReturnType} the query for preparation with values
 */
const findQuery = <T extends GenericType>({
  columnNames,
  conditions,
  tableName,
  clause = 'AND',
}: FindArgs<T> & SharedArgs): ActionReturnType => {
  const columns = columnNames.length === 0 ? '*' : columnNames.join(', ');

  const args: string[] = [];
  const values = [];
  for (const [key, value] of Object.entries(conditions)) {
    args.push(`${key} = ?`);
    values.push(value);
  }

  if (args.length == 0) return [`SELECT ${columns} FROM ${tableName}`, values];
  return [`SELECT ${columns} FROM ${tableName} WHERE ${args.join(' ' + clause + ' ')}`, values];
};

/**
 * Query the database table for data based on conditions
 * @param {FindArgs<T>} args the conditions along with column filters if any
 * @param {string} tableName the table name to do operations on
 * @param {Boolean} onlyOne specify if only one value has to be returned
 * @returns {Promise<T[]>} the selected data
 */
export const find = <T extends GenericType, FindOne extends boolean>(
  { columnNames = [], conditions, clause = 'AND' }: FindArgs<T>,
  tableName: string,
  onlyOne: FindOne
): Promise<FindOne extends true ? T : T[]> => {
  type ReturnType = Promise<FindOne extends true ? T : T[]>;
  const [sql, values] = findQuery({
    columnNames,
    conditions,
    clause,
    tableName,
  });

  if (!onlyOne) return query<T[]>({ query: sql, values }) as ReturnType;
  return query<T>({
    query: `${sql} LIMIT 1`,
    values,
  }) as ReturnType;
};
