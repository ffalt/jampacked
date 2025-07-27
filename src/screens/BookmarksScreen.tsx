import React, { useCallback, useEffect } from 'react';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { useLazyBookmarksQuery } from '../services/queries/bookmarks.ts';
import { JamPlayer } from '../services/player.ts';
import { snackError } from '../services/snack.ts';
import { ObjectHeader, objectHeaderStyles } from '../components/ObjectHeader.tsx';
import { ClickIcon } from '../components/ClickIcon.tsx';
import { Tracks } from '../components/Tracks.tsx';
import { defaultShowArtistTrackDisplay } from '../components/TrackItem.tsx';

export const BookmarksScreen: React.FC<HomeRouteProps<HomeRoute.BOOKMARKS>> = () => {
	const [getBookmarks, { loading, error, called, bookmarks }] = useLazyBookmarksQuery();

	useEffect(() => {
		if (!called) {
			getBookmarks(20, 0);
		}
	}, [called, getBookmarks]);

	const reload = useCallback((): void => {
		getBookmarks(20, 0);
	}, [getBookmarks]);

	const playTracks = (): void => {
		if (bookmarks?.tracks) {
			JamPlayer.playTracks(bookmarks.tracks)
				.catch(error_ => {
					snackError(error_);
				});
		}
	};

	const ListHeaderComponent = (
		<ObjectHeader
			id="bookmarks"
			title="Bookmarks"
			typeName="Bookmarks"
			headerTitleCmds={(
				<>
					<ClickIcon iconName="play" onPress={playTracks} style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} />
				</>
			)}
		/>
	);

	return (
		<Tracks
			tracks={bookmarks?.tracks}
			ListHeaderComponent={ListHeaderComponent}
			refreshing={loading}
			error={error}
			onRefresh={reload}
			displayFunc={defaultShowArtistTrackDisplay}
		/>
	);
};
