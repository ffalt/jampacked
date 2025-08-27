import React from 'react';
import { HomeSection } from './HomeSection';
import { AlbumsRoute, ArtistsRoute } from '../navigators/Routing';
import { AlbumType } from '../services/jam';
import { HomeData } from '../types/home.ts';

export const HomeDataSection: React.FC<{ homeData?: HomeData }> = React.memo(({ homeData }) => {
	if (!homeData) {
		return (<></>);
	}
	return (
		<>
			<HomeSection
				title="Recently Played Albums"
				section={homeData?.albumsRecent}
				sectionNavig={{ route: AlbumsRoute.RECENT, params: { albumType: AlbumType.album } }}
			/>
			<HomeSection
				title="Recently Played Artists"
				section={homeData?.artistsRecent}
				sectionNavig={{ route: ArtistsRoute.RECENT }}
			/>
			<HomeSection
				title="Favorite Albums"
				section={homeData?.albumsFaved}
				sectionNavig={{ route: AlbumsRoute.FAV, params: { albumType: AlbumType.album } }}
			/>
			<HomeSection
				title="Favorite Artists"
				section={homeData?.artistsFaved}
				sectionNavig={{ route: ArtistsRoute.FAV }}
			/>
		</>
	);
});
