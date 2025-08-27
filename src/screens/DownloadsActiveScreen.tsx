import React from 'react';
import { DownloadsRoute, DownloadsRouteProps } from '../navigators/Routing';
import { useTrackPlayerCurrentDownloadsCached } from '../services/player.api.ts';
import { DownloadsPage } from '../components/Downloads';
import pinService from '../services/pin.service.ts';

export const DownloadsActiveScreen: React.FC<DownloadsRouteProps<DownloadsRoute.ACTIVE>> = () => {
	const downloads = useTrackPlayerCurrentDownloadsCached(pinService.manager);
	return (
		<DownloadsPage downloads={downloads} title="Active Downloads" />
	);
};
