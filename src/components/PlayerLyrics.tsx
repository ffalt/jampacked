import React from 'react';
import { Lyrics } from './Lyrics';
import { useTrackPlayerCurrentTrackID } from 'react-native-track-player';

export const PlayerLyrics: React.FC = () => {
	const currentTrackID = useTrackPlayerCurrentTrackID();
	return (
		<Lyrics id={currentTrackID} />
	);
};
