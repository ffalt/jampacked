import React, { useCallback, useEffect, useMemo } from 'react';
import { SectionListData, View } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { Item } from '../components/Item';
import { HeaderDetail, ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { genreDisplay } from '../utils/genre.utils';
import { FavIcon } from '../components/FavIcon';
import { JamObjectType } from '../services/jam';
import { useLazyArtistQuery } from '../services/queries/artist';
import { DefaultSectionList } from '../components/DefaultSectionList.tsx';
import { sharedStyles } from '../style/shared';
import { Rating } from '../components/Rating';
import { BaseEntry } from '../types/base.ts';
import { NavigationService } from '../navigators/navigation.ts';

const buildDetails = (albums?: number, tracks?: number, genre?: string, clickGenre?: () => void): Array<HeaderDetail> => [
	{ title: 'Albums', value: `${albums}` },
	{ title: 'Tracks', value: `${tracks}` },
	{ title: 'Genre', value: genre ?? '', click: genre ? clickGenre : undefined }
];

export const ArtistScreen: React.FC<HomeRouteProps<HomeRoute.ARTIST>> = ({ route }) => {
	const [getArtist, { loading, error, artist }] = useLazyArtistQuery();
	const { id, name } = (route?.params ?? {});
	const details = useMemo(() => artist ?
		buildDetails(artist.albumsCount, artist.tracksCount, genreDisplay(artist.genres),
			(): void => {
				const genre = artist?.genres?.[0];
				if (genre) {
					NavigationService.navigate(HomeRoute.GENRE, { id: genre.id, name: genre.name });
				}
			}
		) :
		buildDetails(), [artist]);

	useEffect(() => {
		if (id) {
			getArtist(id);
		}
	}, [getArtist, id]);

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
