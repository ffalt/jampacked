import React from 'react';
import {SectionList, SectionListData, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import debounce from 'lodash.debounce';
import ThemedText from '../components/ThemedText';
import {BottomTabRoute, BottomTabWithThemeProps, HomeRoute} from '../navigators/Routing';
import {staticTheme, withTheme} from '../style/theming';
import ThemedIcon from '../components/ThemedIcon';
import {Jam} from '../services/jam';
import jam from '../services/jamapi';
import Separator from '../components/Separator';
import JamImage from '../components/JamImage';

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

interface AutoCompleteEntryData extends Jam.AutoCompleteEntry {
	click: () => void;
}

function AutoCompleteResult({result, navigation}: { result: Jam.AutoComplete | undefined, navigation: any /* TODO: type */ }): JSX.Element {
	const sections: Array<SectionListData<AutoCompleteEntryData>> = [];
	if (result) {
		if (result.albums && result.albums.length > 0) {
			sections.push({
				key: 'Albums',
				data: result.albums.map(entry => ({
					...entry,
					click: (): void => {
						navigation.navigate(HomeRoute.ALBUM, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
		if (result.artists && result.artists.length > 0) {
			sections.push({
				key: 'Artists',
				data: result.artists.map(entry => ({
					...entry,
					click: (): void => {
						navigation.navigate(HomeRoute.ARTIST, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
		if (result.tracks && result.tracks.length > 0) {
			sections.push({
				key: 'Tracks',
				data: result.tracks.map(entry => ({
					...entry,
					click: (): void => {
						// navigation.navigate(HomeRoute.TRACK, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
		if (result.folders && result.folders.length > 0) {
			sections.push({
				key: 'Folders',
				data: result.folders.map(entry => ({
					...entry,
					click: (): void => {
						// navigation.navigate(HomeRoute.FOLDER, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
		if (result.podcasts && result.podcasts.length > 0) {
			sections.push({
				key: 'Podcasts',
				data: result.podcasts.map(entry => ({
					...entry,
					click: (): void => {
						// navigation.navigate(HomeRoute.PODCAST, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
		if (result.episodes && result.episodes.length > 0) {
			sections.push({
				key: 'Podcast Episodes',
				data: result.episodes.map(entry => ({
					...entry,
					click: (): void => {
						// navigation.navigate(HomeRoute.EPISODE, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
		if (result.playlists && result.playlists.length > 0) {
			sections.push({
				key: 'Playlists',
				data: result.playlists.map(entry => ({
					...entry,
					click: (): void => {
						// navigation.navigate(HomeRoute.PLAYLIST, {id: entry.id, name: entry.name});
					}
				}))
			});
		}
	}

	const renderSection = ({section}: { section: SectionListData<AutoCompleteEntryData> }): JSX.Element => <ThemedText style={styles.section}>{section.key}</ThemedText>;

	const renderItem = ({item}: { item: AutoCompleteEntryData }): JSX.Element => {

		const click = (): void => {
			item.click();
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

	const keyExtractor = (item: { id: string; name: string; }): string => item.id;

	return (
		<SectionList
			style={styles.list}
			sections={sections}
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
		result: Jam.AutoComplete | undefined;
	} = {
		search: undefined,
		result: undefined
	};

	private handleInput = (query?: string): void => {
		if (query && query.length) {
			jam.various.autocomplete({query, album: 5, artist: 5, playlist: 5, podcast: 5, track: 5, episode: 5})
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

	render(): JSX.Element {
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
				<AutoCompleteResult result={this.state.result} navigation={this.props.navigation}/>
			</View>
		);
	}
}

export default withTheme(SearchScreen);
