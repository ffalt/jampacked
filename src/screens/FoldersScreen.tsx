import React from 'react';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';
import {snackError} from '../services/snack';

export default class FoldersScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.FOLDERS>> {
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
		dataService.folderIndex(forceRefresh)
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
		return (
			<IndexList
				index={this.state.index}
				title="Folders"
				titleIcon="folder"
				refreshing={this.state.refreshing}
				onRefresh={this.reload}
			/>
		);
	}
}
