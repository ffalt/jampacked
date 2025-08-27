import type { ErrorLike } from '@apollo/client';
import { BaseEntryList } from './base.ts';
import { AlbumType, ListType } from '../services/jam';

export type UseListCallFunction = (
	albumTypes: Array<AlbumType>,
	listType: ListType | undefined,
	genreIDs: Array<string>,
	seed: string | undefined,
	take: number,
	skip: number,
	forceRefresh?: boolean) => void;
export type useListFunction = () => [
	UseListCallFunction,
	{ loading: boolean; error?: ErrorLike; data?: BaseEntryList; called: boolean; queryID?: string }
];
