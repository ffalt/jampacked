import { ListType } from '../services/jam';

export interface TrackEntry {
	id: string;
	duration: string;
	durationMS: number;
	trackNr: string;
	title: string;
	artist: string;
	album: string;
	podcastID?: string;
	seriesID?: string;
	albumID?: string;
	artistID?: string;
	genre?: string;
}

export interface TrackEntryList {
	listType?: ListType;
	items: Array<TrackEntry>;
	total: number;
	skip?: number;
	take?: number;
}
