import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import debounce from 'lodash.debounce';
import {BottomTabRoute, BottomTabWithThemeProps} from '../navigators/Routing';
import {staticTheme, withTheme} from '../style/theming';
import ThemedIcon from '../components/ThemedIcon';
import {JamObjectType} from '../services/jam';
import SearchQuick from '../components/SearchQuick';
import Search from '../components/Search';

const styles = StyleSheet.create({
	container: {
		paddingTop: staticTheme.paddingLarge,
		paddingBottom: staticTheme.padding,
		paddingHorizontal: staticTheme.padding,
		flex: 1
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
	disabled: {
		opacity: 0.3
	}
});

class SearchScreen extends React.PureComponent<BottomTabWithThemeProps<BottomTabRoute.SEARCH>> {
	state: {
		search?: string;
		objType?: JamObjectType;
	} = {
		search: undefined,
		objType: undefined
	};

	private handleInput = (search?: string): void => {
		this.setState({search});
	};

	private handleInputThrottled = debounce(this.handleInput, 1000);

	private handleChangeText = (search: string): void => {
		this.handleInputThrottled(search);
	};

	private search = (): void => {
		const {search} = this.state;
		this.handleInput(search);
	};

	private clear = (): void => {
		this.setState({search: undefined});
	};

	private setObjectTypeSearch = (objType?: JamObjectType): void => {
		this.setState({objType});
	};

	private backToAll = (): void => {
		this.setState({objType: undefined});
	};

	render(): React.ReactElement {
		const {theme} = this.props;
		const {search, objType} = this.state;
		const isEmpty = (!search || search.length === 0);
		const cancel = !isEmpty
			? (
				<TouchableOpacity onPress={this.clear}>
					<ThemedIcon name="cancel" style={styles.inputCancelIcon}/>
				</TouchableOpacity>
			)
			: <></>;
		const content = !objType
			? (<SearchQuick query={search} setObjType={this.setObjectTypeSearch}/>)
			: (<Search query={search} objType={objType} backToAll={this.backToAll}/>);
		return (
			<View style={styles.container}>
				<View style={[styles.inputGroup, {borderColor: theme.textColor}]}>
					<TouchableOpacity onPress={this.search}>
						<ThemedIcon name="search" style={[styles.inputIcon, isEmpty && styles.disabled]}/>
					</TouchableOpacity>
					<TextInput
						style={[styles.input, {color: theme.textColor}]}
						placeholderTextColor={theme.muted}
						placeholder="Search"
						value={search}
						onChangeText={this.handleChangeText}
						returnKeyType="search"
						autoCapitalize="none"
					/>
					{cancel}
				</View>
				{content}
			</View>
		);
	}
}

export default withTheme(SearchScreen);
