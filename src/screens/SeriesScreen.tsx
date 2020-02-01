import React from 'react';
import {SectionListData} from 'react-native';
import jam from '../services/jamapi';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList, {Index} from '../components/IndexList';
import {IndexEntry} from '../components/IndexListItem';

class SeriesScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.SERIES>> {
	state: {
		index: Index;
	} = {
		index: {sections: [], all: []}
	};

	async componentDidMount(): Promise<void> {
		const data = await jam.series.index({});
		const sections: Array<SectionListData<IndexEntry>> = data.groups.map(group => ({
			key: group.name,
			title: group.name,
			data: group.entries.map(entry => ({
				id: entry.seriesID,
				desc: `Episodes: ${entry.albumCount}`,
				title: entry.name,
				letter: group.name,
				click: (): void => {
					this.props.navigation.navigate(HomeRoute.SERIESITEM, {id: entry.seriesID, name: entry.name});
				}
			}))
		}));
		const index: Index = {
			sections,
			all: sections.reduce<Array<IndexEntry>>((accumulator, section) => accumulator.concat(section.data), [])
		};
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList title="Series" index={this.state.index} theme={this.props.theme}/>
		);
	}
}

export default withTheme(SeriesScreen);
