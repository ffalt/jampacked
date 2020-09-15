import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, SectionList, SectionListData, StyleSheet} from 'react-native';
import {ThemedText} from '../components/ThemedText';
import {staticTheme, useTheme} from '../style/theming';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {Item} from '../components/Item';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {Separator} from '../components/Separator';
import {FavIcon} from '../components/FavIcon';
import {JamObjectType} from '../services/jam';
import {BaseEntry} from '../services/types';
import {ErrorView} from '../components/ErrorView';
import {ListEmpty} from '../components/ListEmpty';
import {useLazyArtistQuery} from '../services/queries/artist.hook';

const styles = StyleSheet.create({
	SectionHeader: {
		fontSize: staticTheme.fontSizeLarge,
		padding: staticTheme.padding,
		textTransform: 'capitalize',
		fontWeight: 'bold'
	}
});

const buildDetails = (albums?: number, tracks?: number, genre?: string): Array<HeaderDetail> => {
	return [
		{title: 'Albums', value: `${albums || ''}`},
		{title: 'Tracks', value: `${tracks || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const ArtistScreen: React.FC<HomeRouteProps<HomeRoute.ARTIST>> = ({route}) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getArtist, {loading, error, artist, called}] = useLazyArtistQuery();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getArtist(id);
		}
	}, [getArtist, id]);

	useEffect(() => {
		if (artist) {
			setDetails(buildDetails(artist.albumsCount, artist.tracksCount, genreDisplay(artist.genres)));
		}
	}, [artist]);

	const headerTitleCmds = (
		<FavIcon style={objHeaderStyles.button} objType={JamObjectType.artist} id={id}/>
	);

	const ListHeader = (
		<ObjHeader
			id={id}
			title={name}
			details={details}
			typeName="Artist"
			headerTitleCmds={headerTitleCmds}
		/>
	);

	const renderSection = ({section}: { section: SectionListData<BaseEntry> }): JSX.Element => (
		<ThemedText style={styles.SectionHeader}>{section.title}</ThemedText>
	);

	const renderItem = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>), []);
	const keyExtractor = useCallback((item: BaseEntry): string => item.id, []);

	const reload = useCallback((): void => {
		if (id) {
			getArtist(id, true);
		}
	}, [id, getArtist]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<SectionList
			sections={artist?.sections || []}
			ListHeaderComponent={ListHeader}
			ListEmptyComponent={<ListEmpty list={artist?.sections}/>}
			ItemSeparatorComponent={Separator}
			SectionSeparatorComponent={Separator}
			keyExtractor={keyExtractor}
			renderSectionHeader={renderSection}
			renderItem={renderItem}
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={80}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};
