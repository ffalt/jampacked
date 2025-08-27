import { BaseEntry } from './base.ts';

export interface IndexEntry extends BaseEntry {
	letter: string;
}

export type Index = Array<IndexEntry>;
