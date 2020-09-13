import React from 'react';
import {ListType} from '../services/jam';
import {SeriesList} from '../components/SeriesList';
import {SeriesRoute, SeriesRouteProps} from '../navigators/Routing';

export const SeriesListFavScreen: React.FC<SeriesRouteProps<SeriesRoute.FAV>> = () => {
	return (<SeriesList query={{listType: ListType.faved}}/>);
};
export const SeriesListRecentScreen: React.FC<SeriesRouteProps<SeriesRoute.RECENT>> = () => {
	return (<SeriesList query={{listType: ListType.recent}}/>);
};
export const SeriesListRandomScreen: React.FC<SeriesRouteProps<SeriesRoute.RANDOM>> = () => {
	return (<SeriesList query={{listType: ListType.random}}/>);
};
export const SeriesListHighestScreen: React.FC<SeriesRouteProps<SeriesRoute.HIGHEST>> = () => {
	return (<SeriesList query={{listType: ListType.highest}}/>);
};
export const SeriesListAvgHighestScreen: React.FC<SeriesRouteProps<SeriesRoute.AVGHIGHEST>> = () => {
	return (<SeriesList query={{listType: ListType.avghighest}}/>);
};
export const SeriesListFrequentScreen: React.FC<SeriesRouteProps<SeriesRoute.FREQUENT>> = () => {
	return (<SeriesList query={{listType: ListType.frequent}}/>);
};
