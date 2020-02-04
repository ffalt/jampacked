import React from 'react';
import ThemedText from '../components/ThemedText';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';

export default class PodcastScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.PODCAST>> {

	render(): React.ReactElement {
		return (
			<ThemedText>Podcast Screen</ThemedText>
		);
	}
}
