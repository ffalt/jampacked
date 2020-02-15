import React from 'react';
import {Dimensions, RefreshControl, StyleSheet} from 'react-native';
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
	titleIcon: string;
	refreshing: boolean;
	theme: ITheme;
	onRefresh: () => void;
}> {
	state: {
		tiles: boolean;
	} = {
		tiles: false
	};
	numColumns = 3;
	width = Dimensions.get('window').width;
	tileSize = this.width / (this.numColumns || 1);

	private toggleView = (): void => {
		const {tiles} = this.state;
		this.setState({tiles: !tiles});
	};

	private renderHeader = (): JSX.Element => {
		const {tiles} = this.state;
		const {title, titleIcon} = this.props;
		return (<PageHeader title={title} titleIcon={titleIcon} tiles={tiles} toggleView={this.toggleView}/>);
	};

	private renderItemRow = ({item}: { item: IndexEntry }): JSX.Element => <Item item={item}/>;
	private renderItemTile = ({item}: { item: IndexEntry }): JSX.Element => (<ImageItem item={item} size={this.tileSize}/>);
	private keyExtractor = (item: IndexEntry): string => item.id;

	render(): React.ReactElement {
		const {theme} = this.props;
		const {tiles} = this.state;
		if (tiles) {
			return (
				<AtoZList
					data={this.props.index || []}
					key="tiles"
					renderItem={this.renderItemTile}
					keyExtractor={this.keyExtractor}
					numColumns={this.numColumns}
					ListHeaderComponent={this.renderHeader}
					columnWrapperStyle={style.row}
					itemHeight={this.tileSize}
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
				key="rows"
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
