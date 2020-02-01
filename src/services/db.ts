import SQLite from 'react-native-sqlite-storage';
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
		await database.connect();
		return database;
	}

	/**
	 * Start database connection
	 * Only used in getInstance() method
	 */
	async connect(): Promise<SQLite.SQLiteDatabase> {
		if (this.db) {
			return this.db;
		}
		this.db = await new Promise<SQLite.SQLiteDatabase>((resolve, reject) => {
			const db: SQLite.SQLiteDatabase = SQLite.openDatabase(
				{
					name: 'jam.db', location: 'Library'
				},
				() => resolve(db),
				err => reject(err)
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
	 * @param params Params that substitutes '?' in the query
	 */
	async query(sql: string, params: Array<any> = []): Promise<SQLite.ResultSet> {
		const para = this.treatParams(params);
		return new Promise<SQLite.ResultSet>(resolve => {
			this.db?.transaction(async tx => {
				const results = await (new Promise((resolve2, reject) => {
					tx.executeSql(sql, para, (a, b) => resolve2(b), err => reject(err));
				})) as any;
				resolve(results);
			});
		});
	}

	/**
	 * Execute a query and get returned rows as an array
	 * Used in SELECT queries
	 * @param sql Query to be executed
	 * @param params Params that substitutes '?' in the query
	 */
	async queryAndGetRows(sql: string, params: Array<any> = []): Promise<Array<any>> {
		const result = await this.query(sql, params);
		const data = [];

		for (let i = 0; i < result.rows.length; i += 1) {
			data.push(result.rows.item(i));
		}

		return data;
	}

	/**
	 * Executes a query and get the inserted id
	 * Used in INSERT queries
	 * @param sql Query to be executed
	 * @param params Params that substitutes '?' in the query
	 */
	async queryAndGetInsertId(sql: string, params: Array<any> = []): Promise<number> {
		const result = await this.query(sql, params);
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
		const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${gaps.join(', ')})`;
		return this.queryAndGetInsertId(sql, values);
	}

	/**
	 * Update data in the database
	 * @param table Table to be inserted
	 * @param keys Keys to be inserted
	 * @param values Values to be inserted
	 * @param where Where statement to know which lines will be updated
	 */
	async update(table: string, keys: Array<string>, values: Array<any>, where?: { [key: string]: any }): Promise<SQLite.ResultSet> {
		const keysString = keys.map(k => `${k} = ?`).join(', ');
		const {sql, params} = this.buildWhere(where);
		const query = `UPDATE ${table} SET ${keysString} ${sql}`;
		return this.query(query, values.concat(params));
	}

	/**
	 * Delete one or more rows in a table
	 * @param table Table name
	 * @param statement Where statement to know which lines will be deleted
	 */
	async delete<T>(table: string, statement?: WhereStatement<T>): Promise<any> {
		const {sql, params} = this.buildWhere(statement);
		const query = `DELETE ${table} ${sql}`;
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
			Object.keys(where).forEach(k => values.push(where[k]));
			sql = `WHERE ${Object.keys(where).map(k => `${k} = ?`).join(' AND ')}`;
		}
		return {params: values, sql};
	}

	/**
	 * Treat all parameters to be used in queries
	 * @param params Parameters
	 */
	private treatParams(params: Array<any>): Array<any> {
		const newParams: Array<any> = [];
		params.forEach(p => {
			switch (typeof p) {
				case 'string':
					newParams.push(p.trim());
					break;
				case 'boolean':
					newParams.push(p ? 1 : 0);
					break;
				case 'object':
					if (p instanceof Date) {
						newParams.push(p.toISOString());
					} else if (p !== null) {
						try {
							newParams.push(JSON.stringify(p));
						} catch (e) {
							newParams.push(p);
						}
					} else {
						newParams.push(p);
					}
					break;
				default:
					newParams.push(p);
			}
		});
		return newParams;
	}
}

type WhereStatement<T> = {
	[K: string]: T;
};

type WhereStatementResult = {
	sql: string
	params: Array<any>
};
