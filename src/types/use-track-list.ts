import type { ErrorLike } from '@apollo/client';
import { TrackEntryList } from './track.ts';
import { ListType } from '../services/jam';

export type UseTrackListCallFunction = (listType: ListType | undefined, genreIDs: Array<string>, seed: string | undefined, take: number, skip: number, forceRefresh?: boolean) => void;
export type useTrackListFunction = () => [
	UseTrackListCallFunction,
	{ loading: boolean; error?: ErrorLike; data?: TrackEntryList; called: boolean; queryID?: string }
];
