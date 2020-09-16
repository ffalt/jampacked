import React, {useCallback, useEffect, useState} from 'react';
import {SectionListData, StyleSheet} from 'react-native';
import {ThemedText} from '../components/ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {Item} from '../components/Item';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {BaseEntry} from '../services/types';
import {NavigationService} from '../navigators/navigation';
import {FavIcon} from '../components/FavIcon';
import {JamObjectType} from '../services/jam';
import {useLazySeriesQuery} from '../services/queries/series.hook';
import {DefaultSectionList} from '../components/DefSectionList';

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
	const [getSeries, {loading, error, series}] = useLazySeriesQuery();
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

	const ListHeaderComponent = useCallback((): JSX.Element => {
		const headerTitleCmds = (
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.series} id={id}/>
		);
		return (
			<ObjHeader
				id={id}
				title={name}
				typeName="Series"
				details={details}
				headerTitleCmds={headerTitleCmds}
			/>
		);
	}, [details, id, name]);

	const renderSection = useCallback(({section}: { section: SectionListData<BaseEntry> }): JSX.Element =>
		(<ThemedText style={[styles.SectionHeader, {borderBottomColor: theme.separator}]}>{section.title}</ThemedText>), [theme.separator]);

	const renderItem = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>), []);

	return (
		<DefaultSectionList
			sections={series?.sections}
			ListHeaderComponent={ListHeaderComponent}
			renderSectionHeader={renderSection}
			renderItem={renderItem}
			error={error}
			loading={loading}
			reload={reload}
		/>
	);
};
