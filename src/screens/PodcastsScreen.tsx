import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class PodcastsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.PODCASTS>> {

	render(): JSX.Element {
		return (
			<ThemedText>Podcasts Screen</ThemedText>
		);
	}
}
