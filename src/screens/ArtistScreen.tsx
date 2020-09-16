import React, {useCallback, useEffect, useState} from 'react';
import {SectionListData, StyleSheet} from 'react-native';
import {ThemedText} from '../components/ThemedText';
import {staticTheme} from '../style/theming';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {Item} from '../components/Item';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {FavIcon} from '../components/FavIcon';
import {JamObjectType} from '../services/jam';
import {BaseEntry} from '../services/types';
import {useLazyArtistQuery} from '../services/queries/artist.hook';
import {DefaultSectionList} from '../components/DefSectionList';

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
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getArtist, {loading, error, artist}] = useLazyArtistQuery();
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

	const ListHeaderComponent = useCallback((): JSX.Element => {
		const headerTitleCmds = (
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.artist} id={id}/>
		);
		return (
			<ObjHeader
				id={id}
				title={name}
				typeName="Artist"
				details={details}
				headerTitleCmds={headerTitleCmds}
			/>
		);
	}, [details, id, name]);

	const renderSection = ({section}: { section: SectionListData<BaseEntry> }): JSX.Element => (
		<ThemedText style={styles.SectionHeader}>{section.title}</ThemedText>
	);

	const renderItem = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>), []);

	const reload = useCallback((): void => {
		if (id) {
			getArtist(id, true);
		}
	}, [id, getArtist]);

	return (
		<DefaultSectionList
			sections={artist?.sections}
			ListHeaderComponent={ListHeaderComponent}
			renderSectionHeader={renderSection}
			renderItem={renderItem}
			error={error}
			loading={loading}
			reload={reload}
		/>
	);
};
