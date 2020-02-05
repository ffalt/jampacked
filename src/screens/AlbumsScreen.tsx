import React from 'react';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import {getUrlTypeByID} from '../services/jam-lists';
import dataService, {Index} from '../services/data';
import {snackError} from '../services/snack';

class AlbumsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUMS>> {
	state: {
		index: Index;
		refreshing: boolean;
		title: string;
	} = {
		index: [],
		refreshing: false,
		title: ''
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { albumTypeID?: string } } }): void {
		if (prevProps.route?.params?.albumTypeID !== this.props.route?.params?.albumTypeID) {
			this.setState({title: '', index: []});
			this.load();
		}
	}

	private load(forceRefresh: boolean = false): void {
		const albumTypeID = this.props.route?.params?.albumTypeID;
		const type = getUrlTypeByID(albumTypeID);
		if (!type || !type.albumType) {
			return;
		}
		this.setState({title: type?.text, refreshing: true});
		dataService.albumIndex(type.albumType, forceRefresh)
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
				title={this.state.title}
				refreshing={this.state.refreshing}
				onRefresh={this.reload}
			/>
		);
	}
}

export default withTheme(AlbumsScreen);
