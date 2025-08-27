import React from 'react';
import { Lyrics } from './Lyrics';
import { useCurrentTrackID } from '../services/player.hooks.ts';

export const PlayerLyrics: React.FC = () => {
	const currentTrackID = useCurrentTrackID();
	return (
		<Lyrics id={currentTrackID} />
	);
};
