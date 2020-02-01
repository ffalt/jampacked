import React from 'react';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';

export default class FoldersScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.FOLDERS>> {
	state: {
		index: Index
	} = {
		index: []
	};

	async componentDidMount(): Promise<void> {
		const index = await dataService.folderIndex();
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList index={this.state.index} title="Folders"/>
		);
	}
}
