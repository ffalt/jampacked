import React from 'react';
import {ArtistsRoute, ArtistsRouteProps} from '../navigators/Routing';
import {ListType} from '../services/jam';
import {ArtistList} from '../components/ArtistList';

// export const ArtistListScreen: React.FC<HomeRouteProps<HomeRoute.ARTISTLIST>> = ({route}) => {
// 	const [view, setView] = useState<{ listType?: ListType; albumType?: AlbumType }>({});
//
// 	useEffect(() => {
// 		setView({...route?.params});
// 	}, [route]);
//
// 	return (<ArtistList query={view}/>);
// };

export const ArtistListFavScreen: React.FC<ArtistsRouteProps<ArtistsRoute.FAV>> = ({}) => {
	return (<ArtistList query={{listType: ListType.faved}}/>);
};
export const ArtistListRecentScreen: React.FC<ArtistsRouteProps<ArtistsRoute.RECENT>> = ({}) => {
	return (<ArtistList query={{listType: ListType.recent}}/>);
};
export const ArtistListRandomScreen: React.FC<ArtistsRouteProps<ArtistsRoute.RANDOM>> = ({}) => {
	return (<ArtistList query={{listType: ListType.random}}/>);
};
export const ArtistListHighestScreen: React.FC<ArtistsRouteProps<ArtistsRoute.HIGHEST>> = ({}) => {
	return (<ArtistList query={{listType: ListType.highest}}/>);
};
export const ArtistListAvgHighestScreen: React.FC<ArtistsRouteProps<ArtistsRoute.AVGHIGHEST>> = ({}) => {
	return (<ArtistList query={{listType: ListType.avghighest}}/>);
};
export const ArtistListFrequentScreen: React.FC<ArtistsRouteProps<ArtistsRoute.FREQUENT>> = ({}) => {
	return (<ArtistList query={{listType: ListType.frequent}}/>);
};
