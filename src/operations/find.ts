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
  conditions?: Partial<T>;
  columnNames?: Array<keyof T>;
  clause?: 'AND' | 'OR';
}

/**
 * Insert the query in the database
 * @param {FindArgs<T> & SharedArgs} data the required data to be found based on conditions
 * @returns {ActionReturnType} the query for preparation with values
 */
const findQuery = <T extends GenericType>({
  columnNames = [],
  conditions = {},
  tableName = '',
  clause = 'AND',
}: FindArgs<T> & SharedArgs): ActionReturnType => {
  const columns =
    columnNames.length === 0 ? '*' : columnNames.map((value) => `"${value.toString()}"`).join(', ');

  const args: string[] = [];
  const values = [];
  for (const [key, value] of Object.entries(conditions)) {
    args.push(`"${key}" = ?`);
    values.push(value);
  }

  tableName = `"${tableName}"`;
  if (args.length == 0) return [`SELECT ${columns} FROM ${tableName}`, values];
  return [`SELECT ${columns} FROM ${tableName} WHERE ${args.join(' ' + clause + ' ')}`, values];
};

/**
 * Query the database table for data based on conditions
 * @param {FindArgs<T> & SharedArgs} args the conditions along with column filters if any
 * @returns {Promise<T[]>} the selected data
 */
export const find = <T extends GenericType>({
  columnNames = [],
  conditions = {},
  clause = 'AND',
  tableName = '',
}: FindArgs<T> & SharedArgs): Promise<T[]> => {
  const [sql, values] = findQuery({
    columnNames,
    conditions,
    clause,
    tableName,
  });
  return query<T[]>({
    query: sql,
    values,
  });
};

/**
 * Query the database table for data based on conditions
 * @param {FindArgs<T> & SharedArgs} args the conditions along with column filters if any
 * @returns {Promise<T[]>} the selected data
 */
export const findOne = <T extends GenericType>({
  columnNames = [],
  conditions = {},
  clause = 'AND',
  tableName = '',
}: FindArgs<T> & SharedArgs): Promise<T> => {
  const [sql, values] = findQuery({
    columnNames,
    conditions,
    clause,
    tableName,
  });
  return query<T>({
    query: `${sql} LIMIT 1`,
    values,
  });
};
