import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class TrackScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACK>> {

	render(): JSX.Element {
		return (
			<ThemedText>Track Screen</ThemedText>
		);
	}
}
