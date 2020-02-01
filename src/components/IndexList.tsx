import React from 'react';
import {ITheme, withTheme} from '../style/theming';
import PageHeader from './PageHeader';
import Separator from './Separator';
import AtoZList from './AtoZList';
import {IndexListItem} from './IndexListItem';
import {Index, IndexEntry} from '../services/data';

class IndexList extends React.PureComponent<{ index: Index; title: string; theme: ITheme }> {

	private renderHeader = (): JSX.Element => <PageHeader title={this.props.title}/>;

	private renderItem = ({item}: { item: IndexEntry }): JSX.Element => <IndexListItem item={item}/>;

	private keyExtractor = (item: IndexEntry): string => item.id;

	render(): JSX.Element {
		return (
			<AtoZList
				data={this.props.index || []}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				itemHeight={65}
			/>
		);
	}

}

export default withTheme(IndexList);
