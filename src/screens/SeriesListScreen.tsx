import React from 'react';
import { ListType } from '../services/jam';
import { SeriesList } from '../components/SeriesList';
import { SeriesRoute, SeriesRouteProps } from '../navigators/Routing';
import { JamRouteLinks } from '../navigators/Routes';

export const SeriesListFavScreen: React.FC<SeriesRouteProps<SeriesRoute.FAV>> = () => (
	<SeriesList query={{
		listType: ListType.faved,
		goLeft: JamRouteLinks.series(),
		goRight: JamRouteLinks.serieslist(ListType.recent)
	}} />
);
export const SeriesListRecentScreen: React.FC<SeriesRouteProps<SeriesRoute.RECENT>> = () => (
	<SeriesList query={{
		listType: ListType.recent,
		goLeft: JamRouteLinks.serieslist(ListType.faved),
		goRight: JamRouteLinks.serieslist(ListType.frequent)
	}} />
);
export const SeriesListFrequentScreen: React.FC<SeriesRouteProps<SeriesRoute.FREQUENT>> = () => (
	<SeriesList query={{
		listType: ListType.frequent,
		goLeft: JamRouteLinks.serieslist(ListType.recent),
		goRight: JamRouteLinks.serieslist(ListType.random)
	}} />
);

export const SeriesListRandomScreen: React.FC<SeriesRouteProps<SeriesRoute.RANDOM>> = () => (
	<SeriesList query={{
		listType: ListType.random,
		goLeft: JamRouteLinks.serieslist(ListType.frequent),
		goRight: JamRouteLinks.serieslist(ListType.highest)
	}} />
);

export const SeriesListHighestScreen: React.FC<SeriesRouteProps<SeriesRoute.HIGHEST>> = () => (
	<SeriesList query={{
		listType: ListType.highest,
		goLeft: JamRouteLinks.serieslist(ListType.random),
		goRight: JamRouteLinks.serieslist(ListType.avghighest)
	}} />
);

export const SeriesListAvgHighestScreen: React.FC<SeriesRouteProps<SeriesRoute.AVGHIGHEST>> = () => (
	<SeriesList query={{
		listType: ListType.avghighest,
		goLeft: JamRouteLinks.serieslist(ListType.highest)
	}} />
);
