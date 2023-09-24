import { type ActionReturnType } from '@/types/actions-sql-types.js';
import { type GenericType } from '@/types/generic.js';
import { type SharedArgs } from '@/types/shared-types.js';
import { query } from './query.js';

/**
 * @interface UpdateArgs<T>
 * @property {Partial<T>} conditions the required conditions
 * @property {Partial<T>} newValues the values to be updated
 */
export interface UpdateArgs<T> {
  conditions: Partial<T>;
  newValues: Partial<T>;
  clause?: 'AND' | 'OR';
}

/**
 * update the data in the database
 * @param {UpdateArgs<T> & SharedArgs} data the required data to be processed
 * @returns {ActionReturnType} the query for preparation with values
 */
const updateQuery = <T extends GenericType>({
  newValues = {},
  conditions = {},
  tableName = '',
  clause = 'AND',
}: UpdateArgs<T> & SharedArgs): ActionReturnType => {
  const whereValues: string[] = [];
  const whereClauses = [];
  for (const [key, value] of Object.entries(conditions)) {
    whereClauses.push(`${key} = ?`);
    whereValues.push(value);
  }

  const updatesValues: string[] = [];
  const updates = Object.keys(newValues).reduce((query, column, index) => {
    updatesValues.push(newValues[column] as string);
    if (index === 0) return `${query} ${column} = ?`;
    return `${query} ,${column} = ?`;
  }, '');

  if (whereClauses.length == 0) return [`UPDATE ${tableName} SET ${updates}`, updatesValues];
  return [
    `UPDATE ${tableName} SET ${updates} ${whereClauses.join(' ' + clause + ' ')}`,
    [...updatesValues, ...whereValues],
  ];
};

/**
 * Update the table in the database
 * @param {UpdateArgs<T> & SharedArgs} args the required data to be update with conditions
 * @returns {Promise<number>} the number of affectedRows
 */
export const update = <T extends GenericType>({
  conditions = {},
  newValues = {},
  clause = 'AND',
  tableName = '',
}: UpdateArgs<T> & SharedArgs): Promise<number> => {
  const [sql, values] = updateQuery({
    conditions,
    newValues,
    clause,
    tableName,
  });
  return query<number>({ query: sql, values });
};
