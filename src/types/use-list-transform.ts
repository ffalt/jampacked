import { AlbumType, ListType } from '../services/jam';

export type UseListCallFunctionTransform<T> = (
	albumTypes: Array<AlbumType>,
	listType: ListType | undefined,
	genreIDs: Array<string>,
	seed: string | undefined,
	take: number,
	skip: number,
	forceRefresh?: boolean) => T;
