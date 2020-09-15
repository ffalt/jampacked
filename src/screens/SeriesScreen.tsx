import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, SectionList, SectionListData, StyleSheet} from 'react-native';
import {ThemedText} from '../components/ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {Item} from '../components/Item';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {BaseEntry} from '../services/types';
import {NavigationService} from '../navigators/navigation';
import {Separator} from '../components/Separator';
import {FavIcon} from '../components/FavIcon';
import {JamObjectType} from '../services/jam';
import {ErrorView} from '../components/ErrorView';
import {ListEmpty} from '../components/ListEmpty';
import {useLazySeriesQuery} from '../services/queries/series.hook';

const styles = StyleSheet.create({
	ListHeaderTitle: {
		fontSize: staticTheme.fontSizeLarge,
		textAlign: 'center',
		marginLeft: 20,
		marginRight: 20
	},
	ListHeader: {
		paddingTop: 25,
		alignItems: 'center',
		justifyContent: 'center',
		height: 300
	},
	SectionHeader: {
		fontSize: staticTheme.fontSizeLarge,
		padding: 5,
		textTransform: 'capitalize',
		fontWeight: 'bold',
		borderBottomWidth: 1
	}
});

const buildDetails = (artist?: string, tracks?: number, genre?: string, toArtist?: () => void): Array<HeaderDetail> => {
	return [
		{title: 'Artist', value: `${artist || ''}`, click: artist ? toArtist : undefined},
		{title: 'Tracks', value: `${tracks || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const SeriesScreen: React.FC<HomeRouteProps<HomeRoute.SERIE>> = ({route}) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getSeries, {loading, error, called, series}] = useLazySeriesQuery();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getSeries(id);
		}
	}, [getSeries, id]);

	useEffect(() => {
		if (series) {
			setDetails(buildDetails(series.artistName, series.tracksCount, 'Audio Series', () => {
				NavigationService.navigate(HomeRoute.ARTIST, {id: series.artistID, name: series.artistName || ''});
			}));
		}
	}, [series]);

	const reload = useCallback((): void => {
		getSeries(id, true);
	}, [getSeries, id]);

	const headerTitleCmds = (
		<FavIcon style={objHeaderStyles.button} objType={JamObjectType.series} id={id}/>
	);

	const ListHeader = (
		<ObjHeader
			id={id}
			title={name}
			typeName="Series"
			details={details}
			headerTitleCmds={headerTitleCmds}
		/>
	);

	const renderSection = useCallback(({section}: { section: SectionListData<BaseEntry> }): JSX.Element =>
		(<ThemedText style={[styles.SectionHeader, {borderBottomColor: theme.separator}]}>{section.title}</ThemedText>), [theme.separator]);

	const renderItem = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>), []);

	const keyExtractor = useCallback((item: BaseEntry): string => item.id, []);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<SectionList
			sections={series?.sections || []}
			ListHeaderComponent={ListHeader}
			ListEmptyComponent={<ListEmpty list={series?.sections}/>}
			renderSectionHeader={renderSection}
			ItemSeparatorComponent={Separator}
			SectionSeparatorComponent={Separator}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={90}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};
