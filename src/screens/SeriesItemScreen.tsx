import React from 'react';
import {RefreshControl, SectionList, SectionListData, StyleSheet, TouchableOpacity} from 'react-native';
import ThemedText from '../components/ThemedText';
import {staticTheme, withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item from '../components/Item';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import dataService, {BaseEntry, SeriesData} from '../services/data';
import {snackError} from '../services/snack';

const styles = StyleSheet.create({
	ListHeaderTitle: {
		fontSize: staticTheme.fontSizeLarge,
		textAlign: 'center',
		marginLeft: 20,
		marginRight: 20
	},
	ListHeader: {
		paddingTop: 25,
		alignItems: 'center',
		justifyContent: 'center',
		height: 300
	},
	SectionHeader: {
		fontSize: staticTheme.fontSizeLarge,
		padding: 5,
		textTransform: 'capitalize',
		fontWeight: 'bold',
		borderBottomWidth: 1
	}
});

class SeriesItemScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.SERIESITEM>> {
	state: {
		refreshing: boolean;
		data?: SeriesData;
	} = {
		refreshing: false,
		data: undefined
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.setState({data: undefined});
			this.load();
		}
	}

	private load(forceRefresh: boolean = false): void {
		const {id} = this.props.route.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.series(id, forceRefresh)
			.then(data => {
				this.setState({data, refreshing: false});
			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private reload = (): void => {
		this.load(true);
	};

	private toArtist = (): void => {
		if (this.state.data?.series && this.state.data?.series.artistID) {
			this.props.navigation.navigate(HomeRoute.ARTIST,
				{id: this.state.data.series.artistID, name: this.state.data.series.artist || ''});
		}
	};

	private renderHeader = (): JSX.Element => (
		<ObjHeader id={this.props.route?.params?.id} title={this.props.route?.params?.name}>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Artist</ThemedText>
			<TouchableOpacity onPress={this.toArtist}>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.series.artist}</ThemedText>
			</TouchableOpacity>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.series.trackCount}</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>Audio Series</ThemedText>
		</ObjHeader>
	);

	private renderSection = ({section}: { section: SectionListData<BaseEntry> }): JSX.Element => (
		<ThemedText style={[styles.SectionHeader, {borderBottomColor: this.props.theme.separator}]}>{section.title}</ThemedText>
	);

	private renderItem = ({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: BaseEntry): string => item.id;

	render(): React.ReactElement {
		const sections = this.state.data?.albums || [];
		const {theme} = this.props;
		return (
			<SectionList
				sections={sections}
				ListHeaderComponent={this.renderHeader}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
				refreshControl={(
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this.reload}
						progressViewOffset={90}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		);
	}
}


export default withTheme(SeriesItemScreen);
