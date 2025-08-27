import { useEffect, useState } from 'react';
import { useTrackPlayerCurrentTrack } from './player.api.ts';

export function useCurrentTrackID(): string | undefined {
	const [trackId, setTrackId] = useState<string | undefined>(undefined);
	const track = useTrackPlayerCurrentTrack();

	useEffect(() => {
		setTrackId(track?.id);
	}, [track]);

	return trackId;
}
