import React from 'react';
import {SectionListData} from 'react-native';
import {ITheme} from '../style/theming';
import PageHeader from './PageHeader';
import Separator from './Separator';
import AtoZList from './AtoZList';
import {IndexEntry, IndexListItem} from './IndexListItem';

export interface Index {
	sections: Array<SectionListData<IndexEntry>>;
	all: Array<IndexEntry>;
}

export default class IndexList extends React.PureComponent<{ index: Index; title: string; theme: ITheme }> {

	private renderHeader = (): JSX.Element => <PageHeader title={this.props.title}/>;

	private renderItem = ({item}: { item: IndexEntry }): JSX.Element => <IndexListItem item={item}/>;

	private keyExtractor = (item: IndexEntry): string => item.id;

	render(): JSX.Element {
		return (
			<AtoZList
				data={this.props.index.all}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				itemHeight={65}
			/>
		);
	}

}
