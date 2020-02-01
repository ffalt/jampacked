import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class PlaylistsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACKS>> {

	render(): JSX.Element {
		return (
			<ThemedText>Playlists Screen</ThemedText>
		);
	}
}
