import React from 'react';
import {JamObjectType} from '../services/jam';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from './ThemedText';
import dataService, {BaseEntry, SearchResultData} from '../services/data';
import {snackError} from '../services/snack';
import {commonItemLayout} from './AtoZList';
import Separator from './Separator';
import Item from './Item';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import ThemedIcon from './ThemedIcon';

const styles = StyleSheet.create({
	section: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	sectionText: {
		flex: 1,
		fontSize: staticTheme.fontSizeLarge,
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: staticTheme.padding
	},
	sectionIcon: {
		padding: staticTheme.padding,
		fontSize: staticTheme.fontSizeLarge
	}
});

interface SearchProps {
	objType?: JamObjectType;
	query?: string;
	backToAll?: () => void;
	theme: ITheme;
}

class Search extends React.PureComponent<SearchProps> {
	state: {
		result?: SearchResultData;
		loading: boolean;
		amount: number;
	} = {
		result: undefined,
		loading: false,
		amount: 50
	};

	componentDidMount(): void {
		this.execute();
	}

	componentDidUpdate(prevProps: SearchProps): void {
		const newProps = this.props;
		if (prevProps.query !== newProps.query || prevProps.objType !== newProps.objType) {
			this.execute();
		}
	}

	private backPress = (): void => {
		const {backToAll} = this.props;
		if (backToAll) {
			backToAll();
		}
	};

	private handleLoadMore = (): void => {
		const {query, objType} = this.props;
		const {result, amount, loading} = this.state;
		if (loading) {
			return;
		}
		if (query && query.length && objType && result) {
			const offset = (result?.offset || 0) + amount;
			this.setState({loading: true});
			dataService.search(query, objType, offset, amount)
				.then(data => {
					this.setState({loading: false});
					if (query === this.props.query) {
						this.setState({
							result: {
								total: data.total,
								offset,
								entries: result.entries.concat(data.entries)
							}
						});
					}
				})
				.catch(e => {
					this.setState({loading: false});
					snackError(e);
				});
		}
	};

	private reload = (): void => {
		this.execute();
	};

	private execute = (): void => {
		const {query, objType} = this.props;
		const {amount, loading} = this.state;
		if (loading) {
			return;
		}
		if (query && query.length && objType) {
			this.setState({loading: true});
			dataService.search(query, objType, 0, amount)
				.then(result => {
					this.setState({loading: false});
					if (query === this.props.query) {
						this.setState({result});
					}
				})
				.catch(e => {
					this.setState({loading: false});
					snackError(e);
				});

		} else {
			this.setState({result: undefined});
		}
	};
	private getItemLayout = commonItemLayout(65);
	private keyExtractor = (item: BaseEntry): string => item.id;
	private renderItem = ({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>);

	render(): React.ReactElement {
		const {result, loading} = this.state;
		const {theme, objType} = this.props;
		return (
			<View>
				<TouchableOpacity style={styles.section} onPress={this.backPress}>
					<ThemedIcon style={styles.sectionIcon} name="left-open"/>
					<ThemedText style={styles.sectionText}>{objType}</ThemedText>
				</TouchableOpacity>
				<FlatList
					data={result?.entries}
					renderItem={this.renderItem}
					keyExtractor={this.keyExtractor}
					ItemSeparatorComponent={Separator}
					getItemLayout={this.getItemLayout}
					onEndReachedThreshold={0.4}
					onEndReached={this.handleLoadMore}

					refreshControl={(
						<RefreshControl
							refreshing={loading}
							onRefresh={this.reload}
							progressViewOffset={80}
							progressBackgroundColor={theme.refreshCtrlBackground}
							colors={theme.refreshCtrlColors}
						/>
					)}
				/>
			</View>
		);
	}
}

export default withTheme(Search)
