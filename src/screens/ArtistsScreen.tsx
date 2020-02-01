import React from 'react';
import {SectionListData} from 'react-native';
import {AlbumType} from '../services/jam';
import jam from '../services/jamapi';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList, {Index} from '../components/IndexList';
import {IndexEntry} from '../components/IndexListItem';

class ArtistsScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ARTISTS>> {
	state: {
		index: Index
	} = {
		index: {sections: [], all: []}
	};

	async componentDidMount(): Promise<void> {
		const data = await jam.artist.index({albumType: AlbumType.album});
		const sections: Array<SectionListData<IndexEntry>> = data.groups.map(group => ({
			key: group.name,
			title: group.name,
			data: group.entries.map(entry => ({
				id: entry.artistID,
				desc: `Albums: ${entry.albumCount}`,
				title: entry.name,
				letter: group.name,
				click: (): void => {
					this.props.navigation.navigate(HomeRoute.ARTIST, {id: entry.artistID, name: entry.name});
				}
			}))
		}));
		const index: Index = {sections, all: sections.reduce<Array<IndexEntry>>((accumulator, section) => accumulator.concat(section.data), [])};
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList index={this.state.index} title="Artists" theme={this.props.theme}/>
		);
	}
}

export default withTheme(ArtistsScreen);
