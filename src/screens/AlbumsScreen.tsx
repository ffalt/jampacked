import React from 'react';
import {SectionListData} from 'react-native';
import jam from '../services/jamapi';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList, {Index} from '../components/IndexList';
import {getUrlTypeByID} from '../services/jam-lists';
import {IndexEntry} from '../components/IndexListItem';

class AlbumsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ALBUMS>> {
	state: {
		index: Index;
		title: string;
	} = {
		index: {all: [], sections: []},
		title: ''
	};

	async componentDidMount(): Promise<void> {
		const type = getUrlTypeByID(this.props.route?.params?.albumTypeID);
		this.setState({title: type?.text});
		const data = await jam.album.index({albumType: type?.albumType});
		const sections: Array<SectionListData<IndexEntry>> = data.groups.map(group => ({
			key: group.name,
			title: group.name,
			data: group.entries.map(entry => ({
				id: entry.id,
				desc: entry.artist,
				// desc: `Tracks: ${entry.trackCount}`,
				title: entry.name,
				letter: group.name,
				click: (): void => {
					this.props.navigation.navigate(HomeRoute.ALBUM, {id: entry.id, name: entry.name});
				}
			}))
		}));
		const index: Index = {sections, all: sections.reduce<Array<IndexEntry>>((accumulator, section) => accumulator.concat(section.data), [])};
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList index={this.state.index} title={this.state.title} theme={this.props.theme}/>
		);
	}
}

export default withTheme(AlbumsScreen);
