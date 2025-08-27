import { AudioFormatType } from '../services/jam';
import { TrackEntry } from '../types/track.ts';
import { TrackPlayerTrack } from '../services/player.api.ts';
import { JamService } from '../services/jam.service.ts';

export async function buildTrackPlayerTrack(jam: JamService, t: TrackEntry): Promise<TrackPlayerTrack> {
	const headers = jam.currentUserToken ? { Authorization: `Bearer ${jam.currentUserToken}` } : undefined;
	const imageID = t.seriesID ? t.id : (t.albumID ?? t.id);
	const url = jam.stream.streamUrl({ id: t.id, format: AudioFormatType.mp3 }, !headers);
	return {
		id: t.id,
		url,
		title: t.title,
		artist: t.artist,
		album: t.album,
		genre: t.genre,
		duration: t.durationMS / 1000,
		artwork: jam.image.imageUrl({ id: imageID, size: 300 }, !headers),
		headers
		// type: TrackType.default;
		// date: t.tag?.year,
		// description?: string;
		// rating?: number | boolean;
		// userAgent?: string;
		// contentType?: string;
		// pitchAlgorithm?: PitchAlgorithm
	};
}
