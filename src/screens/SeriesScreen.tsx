import React from 'react';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';

class SeriesScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.SERIES>> {
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
		dataService.seriesIndex(forceRefresh)
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
				title="Series"
				index={this.state.index}
				refreshing={this.state.refreshing}
				onRefresh={this.reload}
			/>
		);
	}
}

export default withTheme(SeriesScreen);
