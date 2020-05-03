import React from 'react';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';
import {snackError} from '../services/snack';

class PodcastsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUMS>> {
	state: {
		index: Index;
		refreshing: boolean;
	} = {
		index: [],
		refreshing: false
	};

	componentDidMount(): void {
		this.load();
	}

	private load(forceRefresh: boolean = false): void {
		this.setState({refreshing: true});
		dataService.podcastsIndex(forceRefresh)
			.then(index => {
				this.setState({index, refreshing: false});
			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private reload = (): void => {
		this.load(true);
	};

	render(): React.ReactElement {
		const {index, refreshing} = this.state;
		return (
			<IndexList
				index={index}
				title="Podcasts"
				titleIcon="podcast"
				refreshing={refreshing}
				onRefresh={this.reload}
			/>
		);
	}
}

export default withTheme(PodcastsScreen);
