import {HomeData} from '../services/types';
import React from 'react';
import {HomeSection} from './HomeSection';

export const HomeDataSection: React.FC<{ homeData?: HomeData; }> = React.memo(({homeData}) => {
	if (!homeData) {
		return (<></>);
	}
	return (
		<>
			<HomeSection title="Recently Played Albums" section={homeData?.albumsRecent}/>
			<HomeSection title="Recently Played Artists" section={homeData?.artistsRecent}/>
			<HomeSection title="Favourite Albums" section={homeData?.albumsFaved}/>
			<HomeSection title="Favourite Artists" section={homeData?.artistsFaved}/>
		</>
	);
});
