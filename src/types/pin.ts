import { JamObjectType } from '../services/jam';
import { TrackEntry } from './track.ts';

export interface PinMedia {
	id: string;
	name: string;
	objType: JamObjectType;
	tracks: Array<TrackEntry>;
}

export interface PinState {
	active: boolean;
	pinned: boolean;
}

export interface PinCacheStat {
	files: number;
	size: number;
	humanSize: string;
}
