import React from 'react';
import {JamObjectType} from '../services/jam';
import {RefreshControl, SectionList, SectionListData, StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from './ThemedText';
import dataService, {AutoCompleteData, AutoCompleteDataSection, AutoCompleteEntryData} from '../services/data';
import ThemedIcon from './ThemedIcon';
import NavigationService from '../services/navigation';
import JamImage from './JamImage';
import Separator from './Separator';
import {snackError} from '../services/snack';
import {ITheme, staticTheme, withTheme} from '../style/theming';

const styles = StyleSheet.create({
	item: {
		padding: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	list: {
		flex: 1
	},
	itemText: {
		fontSize: staticTheme.fontSize
	},
	itemContent: {
		alignSelf: 'stretch',
		paddingLeft: staticTheme.padding,
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
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

interface SearchQuickProps {
	query?: string;
	setObjType?: (objType: JamObjectType) => void;
	theme: ITheme;
}

class SearchQuick extends React.PureComponent<SearchQuickProps> {
	state: {
		result?: AutoCompleteData;
		refreshing: boolean;
	} = {
		refreshing: false,
		result: undefined
	};

	componentDidMount(): void {
		this.reload();
	}

	componentDidUpdate(prevProps: { query?: string }): void {
		const newProps = this.props;
		if (prevProps.query !== newProps.query) {
			this.autocomplete(newProps.query);
		}
	}

	private reload = (): void => {
		const {query} = this.props;
		this.autocomplete(query);
	};

	private autocomplete = (search?: string): void => {
		if (search && search.length) {
			this.setState({refreshing: true});
			dataService.autocomplete(search)
				.then(result => {
					const {query} = this.props;
					if (query === search) {
						this.setState({result, refreshing: false});
					}
				})
				.catch(e => {
					this.setState({refreshing: false});
					snackError(e);
				});
		} else {
			this.setState({result: undefined});
		}
	};

	private renderSection = ({section}: { section: SectionListData<AutoCompleteEntryData> }): JSX.Element => {
		const {setObjType} = this.props;
		const setType = (): void => {
			if (setObjType) {
				const {objType} = section as AutoCompleteDataSection;
				setObjType(objType);
			}
		};
		const icon = (section.data.length >= 5) && <ThemedIcon style={styles.sectionIcon} name="right-open"/>;
		return (
			<View>
				<TouchableOpacity style={styles.section} onPress={setType}>
					<ThemedText style={styles.sectionText}>{section.key}</ThemedText>
					{icon}
				</TouchableOpacity>
			</View>
		);
	};

	private renderItem = ({item}: { item: AutoCompleteEntryData }): JSX.Element => {

		const click = (): void => {
			const route = NavigationService.routeByObjType(item.objType);
			if (route) {
				NavigationService.navigate(route, {id: item.id, name: item.name});
			}
		};

		return (
			<TouchableOpacity onPress={click} style={styles.item}>
				<JamImage id={item.id} size={28}/>
				<View style={styles.itemContent}>
					<ThemedText style={styles.itemText}>{item.name}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	};

	private keyExtractor = (item: AutoCompleteEntryData): string => item.id;

	render(): React.ReactElement {
		const {result, refreshing} = this.state;
		const {theme} = this.props;
		return (
			<SectionList
				style={styles.list}
				sections={result || []}
				ItemSeparatorComponent={Separator}
				SectionSeparatorComponent={Separator}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
				refreshControl={(
					<RefreshControl
						refreshing={refreshing}
						onRefresh={this.reload}
						progressViewOffset={80}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		);
	}
}

export default withTheme(SearchQuick);
