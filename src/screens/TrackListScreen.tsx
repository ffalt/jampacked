import React from 'react';
import {TracksRoute, TracksRouteProps} from '../navigators/Routing';
import {ListType} from '../services/jam';
import {TrackList} from '../components/TrackList';

export const TrackListFavScreen: React.FC<TracksRouteProps<TracksRoute.FAV>> = () => {
	return (<TrackList query={{listType: ListType.faved}}/>);
};
export const TrackListRecentScreen: React.FC<TracksRouteProps<TracksRoute.RECENT>> = () => {
	return (<TrackList query={{listType: ListType.recent}}/>);
};
export const TrackListRandomScreen: React.FC<TracksRouteProps<TracksRoute.RANDOM>> = () => {
	return (<TrackList query={{listType: ListType.random}}/>);
};
export const TrackListHighestScreen: React.FC<TracksRouteProps<TracksRoute.HIGHEST>> = () => {
	return (<TrackList query={{listType: ListType.highest}}/>);
};
export const TrackListAvgHighestScreen: React.FC<TracksRouteProps<TracksRoute.AVGHIGHEST>> = () => {
	return (<TrackList query={{listType: ListType.avghighest}}/>);
};
export const TrackListFrequentScreen: React.FC<TracksRouteProps<TracksRoute.FREQUENT>> = () => {
	return (<TrackList query={{listType: ListType.frequent}}/>);
};
