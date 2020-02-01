import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class TracksScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACKS>> {

	render(): JSX.Element {
		return (
			<ThemedText>Tracks Screen</ThemedText>
		);
	}
}
