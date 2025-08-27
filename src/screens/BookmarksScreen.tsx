import React, { useCallback, useEffect } from 'react';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { useLazyBookmarksQuery } from '../services/queries/bookmarks.ts';
import { JamPlayer } from '../services/player.service.ts';
import { snackError } from '../utils/snack.ts';
import { Tracks } from '../components/Tracks.tsx';
import { defaultShowArtistTrackDisplay } from '../components/TrackItem.tsx';
import { PageHeader } from '../components/PageHeader.tsx';
import { ClickIcon } from '../components/ClickIcon.tsx';
import { objectHeaderStyles } from '../components/ObjectHeader.tsx';

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
		<PageHeader
			title="Bookmarks"
			headerTitleCmds={(
				<ClickIcon iconName="play" onPress={playTracks} style={objectHeaderStyles.button} fontSize={objectHeaderStyles.buttonIcon.fontSize} />
			)}
		>
		</PageHeader>
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
