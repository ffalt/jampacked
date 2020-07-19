import React from 'react';
import {useCurrentTrackID} from '../services/player';
import {Lyrics} from './Lyrics';

export const PlayerLyrics: React.FC = () => {
	const currentTrackID = useCurrentTrackID();
	return (
		<Lyrics id={currentTrackID}/>
	);
};
