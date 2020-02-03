import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class PlaylistScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACKS>> {

	render(): JSX.Element {
		return (
			<ThemedText>Playlist Screen</ThemedText>
		);
	}
}