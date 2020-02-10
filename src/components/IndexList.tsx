import React from 'react';
import {RefreshControl, StyleSheet} from 'react-native';
import {ITheme, withTheme} from '../style/theming';
import PageHeader from './PageHeader';
import Separator from './Separator';
import AtoZList from './AtoZList';
import {Index, IndexEntry} from '../services/data';
import Item from './Item';
import ImageItem from './ImageItem';

const style = StyleSheet.create({
	row: {
		flex: 1,
		justifyContent: 'flex-start'
	}
});

class IndexList extends React.PureComponent<{
	index: Index;
	title: string;
	refreshing: boolean;
	theme: ITheme;
	onRefresh: () => void;
}> {
	state: {
		numColumns: number
	} = {
		numColumns: 1
	};
	private renderHeader = (): JSX.Element => <PageHeader title={this.props.title}/>;

	private renderItemRow = ({item}: { item: IndexEntry }): JSX.Element => <Item item={item}/>;
	private renderItemTile = ({item}: { item: IndexEntry }): JSX.Element => {
		const {numColumns} = this.state;
		return (<ImageItem item={item} numColumns={numColumns}/>);
	};
	private keyExtractor = (item: IndexEntry): string => item.id;

	render(): React.ReactElement {
		const {theme} = this.props;
		const {numColumns} = this.state;
		if (numColumns > 1) {
			return (
				<AtoZList
					data={this.props.index || []}
					renderItem={this.renderItemTile}
					keyExtractor={this.keyExtractor}
					numColumns={numColumns}
					ListHeaderComponent={this.renderHeader}
					columnWrapperStyle={style.row}
					refreshControl={(
						<RefreshControl
							refreshing={this.props.refreshing}
							onRefresh={this.props.onRefresh}
							progressViewOffset={90}
							progressBackgroundColor={theme.refreshCtrlBackground}
							colors={theme.refreshCtrlColors}
						/>
					)}
				/>
			);
		}
		return (
			<AtoZList
				data={this.props.index || []}
				renderItem={this.renderItemRow}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				refreshControl={(
					<RefreshControl
						refreshing={this.props.refreshing}
						onRefresh={this.props.onRefresh}
						progressViewOffset={90}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
				itemHeight={65}
			/>
		);
	}

}

export default withTheme(IndexList);
