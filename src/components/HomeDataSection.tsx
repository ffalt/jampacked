import {HomeData} from '../services/types';
import React from 'react';
import {HomeSection} from './HomeSection';
import {AlbumsRoute, ArtistsRoute} from '../navigators/Routing';

export const HomeDataSection: React.FC<{ homeData?: HomeData; }> = React.memo(({homeData}) => {
	if (!homeData) {
		return (<></>);
	}
	return (
		<>
			<HomeSection
				title="Recently Played Albums"
				section={homeData?.albumsRecent}
				sectionNavig={{route: AlbumsRoute.RECENT}}
			/>
			<HomeSection
				title="Recently Played Artists"
				section={homeData?.artistsRecent}
				sectionNavig={{route: ArtistsRoute.RECENT}}
			/>
			<HomeSection
				title="Favorite Albums"
				section={homeData?.albumsFaved}
				sectionNavig={{route: AlbumsRoute.FAV}}
			/>
			<HomeSection
				title="Favorite Artists"
				section={homeData?.artistsFaved}
				sectionNavig={{route: ArtistsRoute.FAV}}
			/>
		</>
	);
});
