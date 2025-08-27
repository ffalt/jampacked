import React from 'react';
import { DownloadsRoute, DownloadsRouteProps } from '../navigators/Routing';
import { useTrackPlayerDownloadsCached } from '../services/player.api.ts';
import { DownloadsPage } from '../components/Downloads';
import pinService from '../services/pin.service.ts';

export const DownloadsScreen: React.FC<DownloadsRouteProps<DownloadsRoute.ALL>> = () => {
	const downloads = useTrackPlayerDownloadsCached(pinService.manager);
	return (
		<DownloadsPage title="All Downloads" downloads={downloads} />
	);
};
