import React from 'react';
import {AlbumType} from '../services/jam';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';

export default class ArtistsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ARTISTS>> {
	state: {
		index: Index
	} = {
		index: []
	};

	async componentDidMount(): Promise<void> {
		const index = await dataService.artistIndex(AlbumType.album);
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList index={this.state.index} title="Artists"/>
		);
	}
}
