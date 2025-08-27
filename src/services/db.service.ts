import { ANDROID_DATABASE_PATH, type DB, IOS_LIBRARY_PATH, open, QueryResult, Scalar } from '@op-engineering/op-sqlite';
import { Platform } from 'react-native';

class DatabaseService {
	db?: DB;

	async init() {
		await this.connect('jam.db');
	}

	async connect(name: string): Promise<DB> {
		if (this.db) {
			return this.db;
		}
		this.db = await new Promise<DB>((resolve, reject) => {
			try {
				const db = open({
					name,
					location: (Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH) as string
				});
				resolve(db);
			} catch (error: unknown) {
				reject(error);
			}
		});
		return this.db;
	}

	async disconnect(): Promise<void> {
		if (!this.db) {
			return;
		}
		this.db.close();
		this.db = undefined;
	}

	/**
	 * Executes a query
	 * @param sql Query to be executed
	 * @param parameters Params that substitutes '?' in the query
	 */
	async query(sql: string, parameters: Array<unknown> = []): Promise<QueryResult> {
		const sqlParameters = this.treatParams(parameters);
		return this.executeQuery(sql, sqlParameters);
	}

	private async executeQuery(sql: string, para: Array<Scalar>): Promise<QueryResult> {
		return this.db!.execute(sql, para);
	}

	/**
	 * Execute a query and get returned rows as an array
	 * Used in SELECT queries
	 * @param sql Query to be executed
	 * @param parameters Params that substitutes '?' in the query
	 */
	async queryAndGetRows(sql: string, parameters: Array<unknown> = []): Promise<Array<Record<string, Scalar> | undefined>> {
		const result = await this.query(sql, parameters);
		if (!result?.rows) {
			return [];
		}
		const data: Array<Record<string, Scalar> | undefined> = [];
		for (let index = 0; index < result.rows.length; index += 1) {
			data.push(result.rows.at(index));
		}
		return data;
	}

	/**
	 * Executes a query and get the inserted id
	 * Used in INSERT queries
	 * @param sql Query to be executed
	 * @param parameters Params that substitutes '?' in the query
	 */
	async queryAndGetInsertId(sql: string, parameters: Array<unknown> = []): Promise<number | undefined> {
		const result = await this.query(sql, parameters);
		return result.insertId;
	}

	/**
	 * Insert data in the database
	 * @param table Table to be inserted
	 * @param keys Keys to be inserted
	 * @param values Values to be inserted
	 */
	async insert(table: string, keys: Array<string>, values: Array<string | number | Date>): Promise<number | undefined> {
		const gaps = keys.map(() => '?');
		const sql = `INSERT INTO ${table} (${keys.join(', ')})
                 VALUES (${gaps.join(', ')})`;
		return this.queryAndGetInsertId(sql, values);
	}

	/**
	 * Update data in the database
	 * @param table Table to be inserted
	 * @param keys Keys to be inserted
	 * @param values Values to be inserted
	 * @param where Where statement to know which lines will be updated
	 */
	async update(table: string, keys: Array<string>, values: Array<string | number | Date>, where?: Record<string, string | number | Date>): Promise<QueryResult> {
		const keysString = keys.map(k => `${k} = ?`).join(', ');
		const { sql, params } = this.buildWhere(where);
		const query = `UPDATE ${table}
                   SET ${keysString} ${sql}`;
		return this.query(query, [...values, ...params]);
	}

	/**
	 * Delete one or more rows in a table
	 * @param table Table name
	 * @param statement Where statement to know which lines will be deleted
	 */
	async delete<T>(table: string, statement?: WhereStatement<T>): Promise<QueryResult> {
		const { sql, params } = this.buildWhere(statement);
		const query = `DELETE
                   FROM ${table} ${sql}`;
		return this.query(query, params);
	}

	/**
	 * Treats an where object and returns the query with its parameters
	 * @param where Where statement
	 */
	private buildWhere<T>(where?: WhereStatement<T>): WhereStatementResult<T> {
		const values: Array<T> = [];
		let sql = '';
		if (where) {
			for (const k of Object.keys(where)) {
				values.push(where[k]);
			}
			// qlty-ignore: radarlint-js:typescript:S4624 false positive
			sql = `WHERE ${Object.keys(where).map(k => `${k} = ?`).join(' AND ')}`;
		}
		return { params: values, sql };
	}

	/**
	 * Treat all parameters to be used in queries
	 * @param parameters Parameters
	 */
	private treatParams(parameters: Array<unknown> = []): Array<Scalar> {
		return parameters.map(p => this.treatParam(p));
	}

	private treatParam(parameter: unknown): Scalar {
		if (parameter === undefined || parameter === null) {
			return null;
		}
		switch (typeof parameter) {
			case 'string': {
				return parameter.trim();
			}
			case 'number': {
				return parameter;
			}
			case 'boolean': {
				return parameter ? 1 : 0;
			}
			case 'object': {
				if (parameter instanceof Date) {
					return parameter.toISOString();
				} else {
					return JSON.stringify(parameter);
				}
			}
			default: {
				return JSON.stringify(parameter);
			}
		}
	}
}

type WhereStatement<T> = Record<string, T>;

interface WhereStatementResult<T> {
	sql: string;
	params: Array<T>;
}

const dbService = new DatabaseService();
export default dbService;
