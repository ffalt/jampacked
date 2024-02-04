import React from 'react';
import {DownloadsRoute, DownloadsRouteProps} from '../navigators/Routing';
import dataService from '../services/data';
import {useTrackPlayerCurrentDownloadsCached} from '../services/player-api';
import {DownloadsPage} from '../components/Downloads';

export const DownloadsActiveScreen: React.FC<DownloadsRouteProps<DownloadsRoute.ACTIVE>> = () => {
	const downloads = useTrackPlayerCurrentDownloadsCached(dataService.pin.manager);
	return (
		<DownloadsPage downloads={downloads} title="Active Downloads"/>
	);
};
