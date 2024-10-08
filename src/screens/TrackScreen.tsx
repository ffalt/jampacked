import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { HeaderDetail, ObjHeader, objHeaderStyles } from '../components/ObjHeader';
import { genreDisplay } from '../utils/genre.utils';
import { JamPlayer } from '../services/player';
import { JamObjectType } from '../services/jam';
import { FavIcon } from '../components/FavIcon';
import { Lyrics } from '../components/Lyrics';
import { useTheme } from '../style/theming';
import { ErrorView } from '../components/ErrorView';
import { useLazyTrackQuery } from '../services/queries/track';
import { ClickIcon } from '../components/ClickIcon';
import { TrackEntry } from '../services/types';
import { NavigationService } from '../navigators/navigation';
import { Rating } from '../components/Rating';

const buildDetails = (track?: TrackEntry): Array<HeaderDetail> => {
	return [
		{
			title: 'Artist', value: track?.artist || '', click: track?.artistID ? () => {
				NavigationService.navigate(HomeRoute.ARTIST, { id: track?.artistID, name: track?.artist || '' });
			} : undefined
		},
		{
			title: 'Album', value: `${track?.album || ''}`, click: track?.artistID ? () => {
				NavigationService.navigate(HomeRoute.ALBUM, { id: track?.albumID, name: track?.album || '' });
			} : undefined
		},
		{
			title: 'Genre', value: (track?.genre ? genreDisplay([track.genre]) : '') || ''
		}
	];
};

export const TrackScreen: React.FC<HomeRouteProps<HomeRoute.TRACK>> = ({ route }) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getTrack, { loading, error, track }] = useLazyTrackQuery();
	const { id, name } = (route?.params || {});

	useEffect(() => {
		if (id) {
			getTrack(id);
		}
	}, [getTrack, id]);

	useEffect(() => {
		if (track) {
			setDetails(buildDetails(track));
		}
	}, [track]);

	const playTrack = useCallback((): void => {
		if (track) {
			JamPlayer.playTrack(track)
				.catch(e => console.error(e));
		}
	}, [track]);

	const reload = useCallback((): void => {
		getTrack(id, true);
	}, [getTrack, id]);

	const headerTitleCmds = (
		<>
			<ClickIcon iconName="play" onPress={playTrack} style={objHeaderStyles.button} fontSize={objHeaderStyles.buttonIcon.fontSize}/>
			<FavIcon style={objHeaderStyles.button} fontSize={objHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.track} id={id}/>
		</>
	);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<ScrollView
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={70}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		>
			<View>
				<ObjHeader
					id={id}
					title={name}
					typeName="Track"
					details={details}
					headerTitleCmds={headerTitleCmds}
					headerTitleCmdsExtras={<Rating fontSize={objHeaderStyles.buttonIcon.fontSize} objType={JamObjectType.track} id={id}/>}
				/>
				<Lyrics id={id}/>
			</View>
		</ScrollView>
	);
};
