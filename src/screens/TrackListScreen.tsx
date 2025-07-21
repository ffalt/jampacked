import React from 'react';
import { TracksRoute, TracksRouteProps } from '../navigators/Routing';
import { ListType } from '../services/jam';
import { TrackList } from '../components/TrackList';
import { JamRouteLinks } from '../navigators/Routes';

export const TrackListFavScreen: React.FC<TracksRouteProps<TracksRoute.FAV>> = () => {
	return (<TrackList query={{
		listType: ListType.faved,
		goLeft: JamRouteLinks.tracks(),
		goRight: JamRouteLinks.tracklist(ListType.recent)
	}}/>);
};

export const TrackListRecentScreen: React.FC<TracksRouteProps<TracksRoute.RECENT>> = () => {
	return (<TrackList query={{
		listType: ListType.recent,
		goLeft: JamRouteLinks.tracklist(ListType.faved),
		goRight: JamRouteLinks.tracklist(ListType.frequent)
	}}/>);
};

export const TrackListFrequentScreen: React.FC<TracksRouteProps<TracksRoute.FREQUENT>> = () => {
	return (<TrackList query={{
		listType: ListType.frequent,
		goLeft: JamRouteLinks.tracklist(ListType.recent),
		goRight: JamRouteLinks.tracklist(ListType.random)
	}}/>);
};

export const TrackListRandomScreen: React.FC<TracksRouteProps<TracksRoute.RANDOM>> = () => {
	return (<TrackList query={{
		listType: ListType.random,
		goLeft: JamRouteLinks.tracklist(ListType.frequent),
		goRight: JamRouteLinks.tracklist(ListType.highest)
	}}/>);
};

export const TrackListHighestScreen: React.FC<TracksRouteProps<TracksRoute.HIGHEST>> = () => {
	return (<TrackList query={{
		listType: ListType.highest,
		goLeft: JamRouteLinks.tracklist(ListType.random),
		goRight: JamRouteLinks.tracklist(ListType.avghighest)
	}}/>);
};

export const TrackListAvgHighestScreen: React.FC<TracksRouteProps<TracksRoute.AVGHIGHEST>> = () => {
	return (<TrackList query={{
		listType: ListType.avghighest,
		goLeft: JamRouteLinks.tracklist(ListType.highest)
	}}/>);
};
