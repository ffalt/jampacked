import SQLite, { ResultSet } from 'react-native-sqlite-storage';
// import {SQLitePlugin, SQLResult} from 'react-native-sqlite-storage'

SQLite.enablePromise(false);

let database: Database | undefined;

export class Database {
	db?: SQLite.SQLiteDatabase;

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
	async connect(name: string): Promise<SQLite.SQLiteDatabase> {
		if (this.db) {
			return this.db;
		}
		this.db = await new Promise<SQLite.SQLiteDatabase>((resolve, reject) => {
			const db: SQLite.SQLiteDatabase = SQLite.openDatabase(
				{
					name, location: 'Library'
				},
				() => resolve(db),
				error => reject(error)
			);
		});
		return this.db;
	}

	async disconnect(): Promise<void> {
		if (!this.db) {
			return;
		}
		await this.db.close();
		this.db = undefined;
		database = undefined;
	}

	/**
	 * Executes a query
	 * @param sql Query to be executed
	 * @param parameters Params that substitutes '?' in the query
	 */
	async query(sql: string, parameters: Array<any> = []): Promise<SQLite.ResultSet> {
		const para = this.treatParams(parameters);
		return new Promise<SQLite.ResultSet>(resolve => {
			this.executeQuery(sql, para, resolve);
		});
	}

	private executeQuery(sql: string, para: Array<any>, resolve: (value: (PromiseLike<ResultSet> | ResultSet)) => void) {
		this.db?.transaction(async tx => {
			const results = await (new Promise((resolve2, reject) => {
				tx.executeSql(sql, para, (_a, b) => resolve2(b), error => reject(error));
			})) as any;
			resolve(results);
		}).catch(console.error);
	}

	/**
	 * Execute a query and get returned rows as an array
	 * Used in SELECT queries
	 * @param sql Query to be executed
	 * @param parameters Params that substitutes '?' in the query
	 */
	async queryAndGetRows(sql: string, parameters: Array<any> = []): Promise<Array<any>> {
		const result = await this.query(sql, parameters);
		const data = [];

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
	async queryAndGetInsertId(sql: string, parameters: Array<any> = []): Promise<number> {
		const result = await this.query(sql, parameters);
		return result.insertId;
	}

	/**
	 * Insert data in the database
	 * @param table Table to be inserted
	 * @param keys Keys to be inserted
	 * @param values Values to be inserted
	 */
	async insert(table: string, keys: Array<string>, values: Array<any>): Promise<number> {
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
	async update(table: string, keys: Array<string>, values: Array<any>, where?: Record<string, any>): Promise<SQLite.ResultSet> {
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
	async delete<T>(table: string, statement?: WhereStatement<T>): Promise<any> {
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
	private treatParams(parameters: Array<any>): Array<any> {
		const newParameters: Array<any> = [];
		for (const p of parameters) {
			switch (typeof p) {
				case 'string': {
					newParameters.push(p.trim());
					break;
				}
				case 'boolean': {
					newParameters.push(p ? 1 : 0);
					break;
				}
				case 'object': {
					if (p instanceof Date) {
						newParameters.push(p.toISOString());
					} else if (p === null) {
						newParameters.push(p);
					} else {
						try {
							newParameters.push(JSON.stringify(p));
						} catch {
							newParameters.push(p);
						}
					}
					break;
				}
				default: {
					newParameters.push(p);
				}
			}
		}
		return newParameters;
	}
}

type WhereStatement<T> = Record<string, T>;

interface WhereStatementResult {
	sql: string;
	params: Array<any>;
}
