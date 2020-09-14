import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, TouchableOpacity, View} from 'react-native';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {HeaderDetail, ObjHeader, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import {JamPlayer} from '../services/player';
import {JamObjectType} from '../services/jam';
import {ThemedIcon} from '../components/ThemedIcon';
import {FavIcon} from '../components/FavIcon';
import {Lyrics} from '../components/Lyrics';
import {useTheme} from '../style/theming';
import {ErrorView} from '../components/ErrorView';
import {useLazyTrackQuery} from '../services/queries/track.hook';

const buildDetails = (artist?: string, album?: string, genre?: string): Array<HeaderDetail> => {
	return [
		{title: 'Artist', value: artist || ''},
		{title: 'Album', value: `${album || ''}`},
		{title: 'Genre', value: genre || ''}
	];
};

export const TrackScreen: React.FC<HomeRouteProps<HomeRoute.TRACK>> = ({route}) => {
	const theme = useTheme();
	const [details, setDetails] = useState<Array<HeaderDetail>>(buildDetails());
	const [getTrack, {loading, error, track}] = useLazyTrackQuery();
	const {id, name} = route?.params;

	useEffect(() => {
		if (id) {
			getTrack(id);
		}
	}, [getTrack, id]);

	useEffect(() => {
		if (track) {
			setDetails(buildDetails(track.artist, track.album, track.genre ? genreDisplay([track.genre]) : undefined));
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
			<TouchableOpacity style={objHeaderStyles.button} onPress={playTrack}>
				<ThemedIcon name="play" size={objHeaderStyles.buttonIcon.fontSize}/>
			</TouchableOpacity>
			<FavIcon style={objHeaderStyles.button} objType={JamObjectType.track} id={id}/>
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
				/>
				<Lyrics id={id}/>
			</View>
		</ScrollView>
	);
};
