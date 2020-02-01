import React from 'react';
import {withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import IndexList from '../components/IndexList';
import dataService, {Index} from '../services/data';

class SeriesScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.SERIES>> {
	state: {
		index: Index;
	} = {
		index: []
	};

	async componentDidMount(): Promise<void> {
		const index = await dataService.seriesIndex();
		this.setState({index});
	}

	render(): JSX.Element {
		return (
			<IndexList title="Series" index={this.state.index} theme={this.props.theme}/>
		);
	}
}

export default withTheme(SeriesScreen);
