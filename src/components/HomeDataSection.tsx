import {HomeData} from '../services/types';
import React from 'react';
import {HomeSection} from './HomeSection';
import {HomeRoute} from '../navigators/Routing';
import {AlbumType, ListType} from '../services/jam';
import {getUrlTypeIdByAlbumType} from '../services/jam-lists';

export const HomeDataSection: React.FC<{ homeData?: HomeData; }> = React.memo(({homeData}) => {
	if (!homeData) {
		return (<></>);
	}
	return (
		<>
			<HomeSection title="Recently Played Albums" section={homeData?.albumsRecent} sectionNavig={
				{route: HomeRoute.ALBUMLIST, params: {albumTypeID: getUrlTypeIdByAlbumType(AlbumType.album), listType: ListType.recent}}
			}/>
			<HomeSection title="Recently Played Artists" section={homeData?.artistsRecent}/>
			<HomeSection title="Favourite Albums" section={homeData?.albumsFaved} sectionNavig={
				{route: HomeRoute.ALBUMLIST, params: {albumTypeID: getUrlTypeIdByAlbumType(AlbumType.album), listType: ListType.faved}}
			}/>
			<HomeSection title="Favourite Artists" section={homeData?.artistsFaved}/>
		</>
	);
});
