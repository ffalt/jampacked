import React from 'react';
import {ITheme, withTheme} from '../style/theming';
import PageHeader from './PageHeader';
import Separator from './Separator';
import AtoZList from './AtoZList';
import {Index, IndexEntry} from '../services/data';
import Item from './Item';

class IndexList extends React.PureComponent<{
	index: Index;
	title: string;
	refreshing: boolean;
	theme: ITheme;
	onRefresh: () => void;
}> {

	private renderHeader = (): JSX.Element => <PageHeader title={this.props.title}/>;

	private renderItem = ({item}: { item: IndexEntry }): JSX.Element => <Item item={item}/>;

	private keyExtractor = (item: IndexEntry): string => item.id;

	render(): React.ReactElement {
		return (
			<AtoZList
				data={this.props.index || []}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				refreshing={this.props.refreshing}
				onRefresh={this.props.onRefresh}
				itemHeight={65}
			/>
		);
	}

}

export default withTheme(IndexList);
