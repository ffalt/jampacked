import React from 'react';
import {DownloadsRoute, DownloadsRouteProps} from '../navigators/Routing';
import dataService from '../services/data';
import {DownloadsPage} from '../components/Downloads';

import {useCurrentDownloadsCached} from '../services/downloader-api.ts';

export const DownloadsActiveScreen: React.FC<DownloadsRouteProps<DownloadsRoute.ACTIVE>> = () => {
	const downloads = useCurrentDownloadsCached(dataService.pin.manager);
	return (
		<DownloadsPage downloads={downloads} title="Active Downloads"/>
	);
};
