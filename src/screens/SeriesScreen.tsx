import React, {useCallback, useEffect, useState} from 'react';
import {SectionListData, View} from 'react-native';
import {ThemedText} from '../components/ThemedText';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {Item} from '../components/Item';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {BaseEntry} from '../services/types';
import {NavigationService} from '../navigators/navigation';
import {FavIcon} from '../components/FavIcon';
import {JamObjectType} from '../services/jam';
import {useLazySeriesQuery} from '../services/queries/series';
import {DefaultSectionList} from '../components/DefSectionList';
import {sharedStyles} from '../style/shared';

const buildDetails = (artist?: string, tracks?: number, genre?: string, toArtist?: () => void): Array<HeaderDetail> => {
	return [
		{title: 'Artist', value: `${artist || ''}`, click: artist ? toArtist : undefined},
		{title: 'Tracks', value: `${tracks || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const SeriesScreen: React.FC<HomeRouteProps<HomeRoute.SERIE>> = ({route}) => {
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getSeries, {loading, error, series}] = useLazySeriesQuery();
	const {id, name} = (route?.params || {});

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

	const ListHeaderComponent = (<ObjHeader
		id={id}
		title={name}
		typeName="Series"
		details={details}
		headerTitleCmds={<FavIcon style={objHeaderStyles.button} objType={JamObjectType.series} id={id}/>}
	/>);

	const renderSection = useCallback(({section}: { section: SectionListData<BaseEntry> }):React.JSX.Element => (
		<View style={sharedStyles.sectionHeader}>
			<ThemedText style={sharedStyles.sectionHeaderText}>{section.title}</ThemedText>
		</View>
	), []);

	const renderItem = useCallback(({item}: { item: BaseEntry }):React.JSX.Element => (<Item item={item}/>), []);

	return (
		<DefaultSectionList
			sections={series?.sections}
			ListHeaderComponent={ListHeaderComponent}
			renderSectionHeader={series && series.sections.length > 1 ? renderSection : undefined}
			renderItem={renderItem}
			error={error}
			loading={loading}
			reload={reload}
		/>
	);
};
