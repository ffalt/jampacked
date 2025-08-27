export interface Document<T> {
	key: string;
	version: number;
	date: number;
	data: T;
}
