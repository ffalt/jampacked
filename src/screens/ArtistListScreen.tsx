import React from 'react';
import {ArtistsRoute, ArtistsRouteProps} from '../navigators/Routing';
import {ListType} from '../services/jam';
import {ArtistList} from '../components/ArtistList';
import {JamRouteLinks} from '../navigators/Routes';

export const ArtistListFavScreen: React.FC<ArtistsRouteProps<ArtistsRoute.FAV>> = () => {
	return (<ArtistList query={{
		listType: ListType.faved,
		goLeft: JamRouteLinks.artists(),
		goRight: JamRouteLinks.artistlist(ListType.recent)
	}}/>);
};

export const ArtistListRecentScreen: React.FC<ArtistsRouteProps<ArtistsRoute.RECENT>> = () => {
	return (<ArtistList query={{
		listType: ListType.recent,
		goLeft: JamRouteLinks.artistlist(ListType.faved),
		goRight: JamRouteLinks.artistlist(ListType.recent)
	}}/>);
};

export const ArtistListFrequentScreen: React.FC<ArtistsRouteProps<ArtistsRoute.FREQUENT>> = () => {
	return (<ArtistList query={{
		listType: ListType.frequent,
		goLeft: JamRouteLinks.artistlist(ListType.recent),
		goRight: JamRouteLinks.artistlist(ListType.random)
	}}/>);
};

export const ArtistListRandomScreen: React.FC<ArtistsRouteProps<ArtistsRoute.RANDOM>> = () => {
	return (<ArtistList query={{
		listType: ListType.random,
		goLeft: JamRouteLinks.artistlist(ListType.frequent),
		goRight: JamRouteLinks.artistlist(ListType.highest)
	}}/>);
};

export const ArtistListHighestScreen: React.FC<ArtistsRouteProps<ArtistsRoute.HIGHEST>> = () => {
	return (<ArtistList query={{
		listType: ListType.highest,
		goLeft: JamRouteLinks.artistlist(ListType.random),
		goRight: JamRouteLinks.artistlist(ListType.avghighest)
	}}/>);
};

export const ArtistListAvgHighestScreen: React.FC<ArtistsRouteProps<ArtistsRoute.AVGHIGHEST>> = () => {
	return (<ArtistList query={{
		listType: ListType.avghighest,
		goLeft: JamRouteLinks.artistlist(ListType.highest)
	}}/>);
};
