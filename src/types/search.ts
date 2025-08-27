import { BaseEntry } from './base.ts';

export interface SearchResultData {
	query: string;
	total: number;
	skip?: number;
	entries: Array<BaseEntry>;
}
