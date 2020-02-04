import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class PlaylistScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACKS>> {

	render(): React.ReactElement {
		return (
			<ThemedText>Playlist Screen</ThemedText>
		);
	}
}
