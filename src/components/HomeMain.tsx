import React, {useCallback, useEffect} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Stats} from './Stats';
import {HomeDataSection} from './HomeDataSection';
import {useLazyHomeDataQuery} from '../services/queries/home';
import dataService from '../services/data';
import {ErrorView} from './ErrorView';
import {useTheme} from '../style/theming';
import {HomeUserSection} from './HomeUserSection';
import {HomeAppSection} from './HomeAppSection';

export const HomeMain: React.FC = () => {
	const theme = useTheme();
	const [getHomeData, {loading, error, called, homeData}] = useLazyHomeDataQuery();
	useEffect(() => {
		if (!called) {
			getHomeData();
		}
	}, [getHomeData, called]);

	useEffect(() => {
		let isSubscribed = true;

		const update = (): void => {
			if (isSubscribed) {
				getHomeData();
			}
		};

		dataService.cache.subscribeHomeDataChangeUpdates(update);
		return (): void => {
			isSubscribed = false;
			dataService.cache.unsubscribeHomeDataChangeUpdates(update);
		};
	}, [getHomeData]);

	const reload = useCallback((): void => {
		getHomeData(true);
	}, [getHomeData]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}
	return (
		<ScrollView
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={70}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		>
			<Stats stats={homeData?.stats} label="Library"/>
			<HomeDataSection homeData={homeData?.homeData}/>
			<HomeUserSection userData={homeData?.user}/>
			<HomeAppSection/>
		</ScrollView>
	);
};
