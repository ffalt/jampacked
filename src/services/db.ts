import { NITRO_SQLITE_NULL, type NitroSQLiteConnection, open, type QueryResult, type QueryResultRow, type SQLiteQueryParams, type SQLiteValue } from 'react-native-nitro-sqlite';

let database: Database | undefined;

export class Database {
	db?: NitroSQLiteConnection;

	/**
	 * Start the database and create an instance when necessary
	 */
	static async getInstance(): Promise<Database> {
		if (database) {
			return database;
		}
		database = new Database();
		await database.connect('jam.db');
		return database;
	}

	/**
	 * Start database connection
	 * Only used in getInstance() method
	 */
	async connect(name: string): Promise<NitroSQLiteConnection> {
		if (this.db) {
			return this.db;
		}
		this.db = await new Promise<NitroSQLiteConnection>((resolve, reject) => {
			try {
				const db = open({ name, location: 'Library' });
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
		database = undefined;
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

	private async executeQuery(sql: string, para: SQLiteQueryParams): Promise<QueryResult> {
		return this.db!.executeAsync(sql, para);
	}

	/**
	 * Execute a query and get returned rows as an array
	 * Used in SELECT queries
	 * @param sql Query to be executed
	 * @param parameters Params that substitutes '?' in the query
	 */
	async queryAndGetRows(sql: string, parameters: Array<unknown> = []): Promise<Array<QueryResultRow | undefined>> {
		const result = await this.query(sql, parameters);
		if (!result?.rows) {
			return [];
		}
		const data: Array<QueryResultRow | undefined> = [];
		for (let index = 0; index < result.rows.length; index += 1) {
			data.push(result.rows.item(index));
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
	async update(table: string, keys: Array<string>, values: Array<any>, where?: Record<string, any>): Promise<QueryResult> {
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
	private buildWhere<T>(where?: WhereStatement<T>): WhereStatementResult {
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
	private treatParams(parameters: Array<unknown> = []): SQLiteQueryParams {
		return parameters.map(p => this.treatParam(p));
	}

	private treatParam(parameter: unknown): SQLiteValue {
		if (parameter === undefined || parameter === null) {
			return NITRO_SQLITE_NULL;
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
					try {
						return JSON.stringify(parameter);
					} catch {
						return String(parameter);
					}
				}
			}
			default: {
				return JSON.stringify(parameter);
			}
		}
	}
}

type WhereStatement<T> = Record<string, T>;

interface WhereStatementResult {
	sql: string;
	params: Array<any>;
}
