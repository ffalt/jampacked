import React from 'react';
import {useCurrentTrackID} from '../services/player';
import Lyrics from './Lyrics';

const PlayerLyrics: React.FC = () => {
	const currentTrackID = useCurrentTrackID();
	return (
		<Lyrics id={currentTrackID}/>
	);
};

export default PlayerLyrics;
