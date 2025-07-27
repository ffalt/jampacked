import React, { useCallback, useEffect } from 'react';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { JamPlayer } from '../services/player';
import { ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { JamObjectType } from '../services/jam';
import { FavIcon } from '../components/FavIcon';
import { snackError } from '../services/snack';
import { ThemedText } from '../components/ThemedText';
import { ErrorView } from '../components/ErrorView';
import { useLazyPodcastQuery } from '../services/queries/podcast';
import { Tracks } from '../components/Tracks';
import { ClickIcon } from '../components/ClickIcon';

export const PodcastScreen: React.FC<HomeRouteProps<HomeRoute.PODCAST>> = ({ route }) => {
	const [getPodcast, { loading, error, podcast }] = useLazyPodcastQuery();
	const { id, name } = (route?.params || {});

	useEffect(() => {
		if (id) {
			getPodcast(id);
		}
	}, [getPodcast, id]);

	const reload = useCallback((): void => {
		getPodcast(id, true);
	}, [getPodcast, id]);

	const playTracks = (): void => {
		if (podcast?.episodes) {
			JamPlayer.playTracks(podcast.episodes)
				.catch(error_ => {
					snackError(error_);
				});
		}
	};

	const ListHeaderComponent = (
		<ObjectHeader
			id={id}
			title={name}
			typeName="Podcast"
			customDetails={<ThemedText style={objectHeaderStyles.panel}>{podcast?.description}</ThemedText>}
			headerTitleCmds={(
				<>
					<ClickIcon iconName="play" onPress={playTracks} style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} />
					<FavIcon style={objectHeaderStyles.button} objType={JamObjectType.podcast} id={id} />
				</>
			)}
		/>
	);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
	}

	return (
		<Tracks tracks={podcast?.episodes} ListHeaderComponent={ListHeaderComponent} refreshing={loading} onRefresh={reload} />
	);
};
