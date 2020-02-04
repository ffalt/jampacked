import React from 'react';
import {SectionList, SectionListData, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import debounce from 'lodash.debounce';
import ThemedText from '../components/ThemedText';
import {BottomTabRoute, BottomTabWithThemeProps} from '../navigators/Routing';
import {staticTheme, withTheme} from '../style/theming';
import ThemedIcon from '../components/ThemedIcon';
import Separator from '../components/Separator';
import JamImage from '../components/JamImage';
import dataService, {AutoCompleteData, AutoCompleteEntryData} from '../services/data';
import NavigationService from '../services/navigation';

const styles = StyleSheet.create({
	container: {
		paddingTop: staticTheme.paddingLarge,
		paddingBottom: staticTheme.padding,
		paddingHorizontal: staticTheme.padding,
		flex: 1
	},
	list: {
		flex: 1
	},
	section: {
		fontSize: staticTheme.fontSizeLarge,
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: staticTheme.padding
	},
	input: {
		flex: 1,
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 0,
		marginTop: 10
	},
	inputGroup: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
	},
	inputIcon: {
		fontSize: 22,
		paddingRight: staticTheme.padding,
		paddingTop: 10
	},
	inputCancelIcon: {
		fontSize: 22,
		paddingLeft: staticTheme.padding,
		paddingRight: staticTheme.paddingLarge,
		paddingTop: 10
	},
	item: {
		padding: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemContent: {
		alignSelf: 'stretch',
		paddingLeft: staticTheme.padding,
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	itemText: {
		fontSize: staticTheme.fontSize
	},
	disabled: {
		opacity: 0.3
	}
});


function AutoCompleteResult({result}: { result: AutoCompleteData | undefined }): JSX.Element {

	const renderSection = ({section}: { section: SectionListData<AutoCompleteEntryData> }): JSX.Element => <ThemedText style={styles.section}>{section.key}</ThemedText>;

	const renderItem = ({item}: { item: AutoCompleteEntryData }): JSX.Element => {

		const click = (): void => {
			NavigationService.navigate(item.route, {id: item.id, name: item.name});
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

	const keyExtractor = (item: AutoCompleteEntryData): string => item.id;

	return (
		<SectionList
			style={styles.list}
			sections={result || []}
			ItemSeparatorComponent={Separator}
			SectionSeparatorComponent={Separator}
			keyExtractor={keyExtractor}
			renderSectionHeader={renderSection}
			renderItem={renderItem}
		/>
	);
}

class SearchScreen extends React.PureComponent<BottomTabWithThemeProps<BottomTabRoute.SEARCH>> {
	state: {
		search: string | undefined;
		result: AutoCompleteData| undefined;
	} = {
		search: undefined,
		result: undefined
	};

	private handleInput = (query?: string): void => {
		if (query && query.length) {
			dataService.autocomplete(query)
				.then(result => {
					if (this.state.search === query) {
						this.setState({result});
					}
				})
				.catch(e => console.error(e));
		} else {
			this.setState({result: undefined});
		}
	};

	private handleInputThrottled = debounce(this.handleInput, 1000);

	private handleChangeText = (search: string): void => {
		this.setState({search});
		this.handleInputThrottled(search);
	};

	private search = (): void => {
		this.handleInput(this.state.search);
	};

	private clear = (): void => {
		this.setState({search: undefined});
	};

	render(): React.ReactElement {
		const isEmpty = (!this.state.search || this.state.search.length === 0);
		const cancel = !isEmpty
			? (
				<TouchableOpacity onPress={this.clear}>
					<ThemedIcon name="cancel" style={styles.inputCancelIcon}/>
				</TouchableOpacity>
			)
			: <></>;
		return (
			<View style={styles.container}>
				<View style={[styles.inputGroup, {borderColor: this.props.theme.textColor}]}>
					<TouchableOpacity onPress={this.search}>
						<ThemedIcon name="search" style={[styles.inputIcon, isEmpty && styles.disabled]}/>
					</TouchableOpacity>
					<TextInput
						style={[styles.input, {color: this.props.theme.textColor}]}
						placeholderTextColor={this.props.theme.muted}
						placeholder="Search"
						value={this.state.search}
						onChangeText={this.handleChangeText}
						returnKeyType="search"
						autoCapitalize="none"
					/>
					{cancel}
				</View>
				<AutoCompleteResult result={this.state.result}/>
			</View>
		);
	}
}

export default withTheme(SearchScreen);
