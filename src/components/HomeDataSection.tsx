import {HomeData} from '../services/types';
import React from 'react';
import {HomeSection} from './HomeSection';
import {HomeRoute} from '../navigators/Routing';
import {ListType} from '../services/jam';

export const HomeDataSection: React.FC<{ homeData?: HomeData; }> = React.memo(({homeData}) => {
	if (!homeData) {
		return (<></>);
	}
	return (
		<>
			<HomeSection title="Recently Played Albums" section={homeData?.albumsRecent} sectionNavig={
				{route: HomeRoute.ALBUMLIST, params: {listType: ListType.recent}}
			}/>
			<HomeSection title="Recently Played Artists" section={homeData?.artistsRecent}sectionNavig={
				{route: HomeRoute.ARTISTLIST, params: {listType: ListType.faved}}
			}/>
			<HomeSection title="Favourite Albums" section={homeData?.albumsFaved} sectionNavig={
				{route: HomeRoute.ALBUMLIST, params: {listType: ListType.faved}}
			}/>
			<HomeSection title="Favourite Artists" section={homeData?.artistsFaved}sectionNavig={
				{route: HomeRoute.ARTISTLIST, params: {listType: ListType.faved}}
			}/>
		</>
	);
});
