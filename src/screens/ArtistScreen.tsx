import React, { useCallback, useEffect, useState } from 'react';
import { SectionListData, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { Item } from '../components/Item';
import { HeaderDetail, ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { genreDisplay } from '../utils/genre.utils';
import { FavIcon } from '../components/FavIcon';
import { JamObjectType } from '../services/jam';
import { BaseEntry } from '../services/types';
import { useLazyArtistQuery } from '../services/queries/artist';
import { DefaultSectionList } from '../components/DefaultSectionList.tsx';
import { sharedStyles } from '../style/shared';
import { Rating } from '../components/Rating';

const buildDetails = (albums?: number, tracks?: number, genre?: string): Array<HeaderDetail> => [
	{ title: 'Albums', value: `${albums}` },
	{ title: 'Tracks', value: `${tracks}` },
	{ title: 'Genre', value: genre || '' }
];

export const ArtistScreen: React.FC<HomeRouteProps<HomeRoute.ARTIST>> = ({ route }) => {
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getArtist, { loading, error, artist }] = useLazyArtistQuery();
	const { id, name } = (route?.params || {});

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

	const ListHeaderComponent = (
		<ObjectHeader
			id={id}
			title={name}
			typeName="Artist"
			details={details}
			headerTitleCmds={<FavIcon style={objectHeaderStyles.button} objType={JamObjectType.artist} id={id} />}
			headerTitleCmdsExtras={<Rating fontSize={objectHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.artist} id={id} />}
		/>
	);

	const renderSection = useCallback(({ section }: { section: SectionListData<BaseEntry> }): React.JSX.Element => (
		<View style={sharedStyles.sectionHeader}>
			<ThemedText style={sharedStyles.sectionHeaderText}>{section.title}</ThemedText>
		</View>
	), []);

	const renderItem = useCallback(({ item }: { item: BaseEntry }): React.JSX.Element => (<Item item={item} />), []);

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
