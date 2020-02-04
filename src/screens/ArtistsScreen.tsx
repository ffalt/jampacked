import React from 'react';
import {AlbumType} from '../services/jam';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';

export default class ArtistsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ARTISTS>> {
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
		dataService.artistIndex(AlbumType.album, forceRefresh)
			.then(index => {
				this.setState({index, refreshing: false});
			})
			.catch(e => {
				this.setState({refreshing: false});
				console.error(e);
			});
	}

	private reload = (): void => {
		this.load(true);
	};

	render(): React.ReactElement {
		return (
			<IndexList
				index={this.state.index}
				title="Artists"
				refreshing={this.state.refreshing}
				onRefresh={this.reload}
			/>
		);
	}
}
