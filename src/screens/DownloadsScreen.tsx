import React from 'react';
import { DownloadsRoute, DownloadsRouteProps } from '../navigators/Routing';
import dataService from '../services/data';
import { useTrackPlayerDownloadsCached } from '../services/player-api';
import { DownloadsPage } from '../components/Downloads';

export const DownloadsScreen: React.FC<DownloadsRouteProps<DownloadsRoute.ALL>> = () => {
	const downloads = useTrackPlayerDownloadsCached(dataService.pin.manager);
	return (
		<DownloadsPage title={'All Downloads'} downloads={downloads}/>
	);
};
