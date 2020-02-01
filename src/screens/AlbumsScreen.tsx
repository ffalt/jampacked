import React from 'react';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import {getUrlTypeByID} from '../services/jam-lists';
import dataService, {Index} from '../services/data';

class AlbumsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUMS>> {
	state: {
		index: Index;
		title: string;
	} = {
		index: [],
		title: ''
	};

	componentDidMount(): void {
		this.load(this.props.route?.params?.albumTypeID)
			.catch(e => console.error(e));
	}

	componentDidUpdate(prevProps: { route: { params: { albumTypeID?: string } } }): void {
		if (prevProps.route?.params?.albumTypeID !== this.props.route?.params?.albumTypeID) {
			this.load(this.props.route?.params?.albumTypeID)
				.catch(e => console.error(e));
		}
	}

	async load(albumTypeID?: string): Promise<void> {
		this.setState({title: '', index: []});
		const type = getUrlTypeByID(albumTypeID);
		if (!type || !type.albumType) {
			return;
		}
		this.setState({title: type?.text});
		const index = await dataService.albumIndex(type.albumType);
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList index={this.state.index} title={this.state.title} theme={this.props.theme}/>
		);
	}
}

export default withTheme(AlbumsScreen);
