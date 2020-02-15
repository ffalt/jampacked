import React from 'react';
import {RefreshControl, SectionList, SectionListData, StyleSheet} from 'react-native';
import ThemedText from '../components/ThemedText';
import {staticTheme, withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item from '../components/Item';
import ObjHeader, {HeaderDetail, objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {ArtistData, BaseEntry} from '../services/data';
import {snackError} from '../services/snack';
import FavIcon from '../components/FavIcon';
import {JamObjectType} from '../services/jam';

const styles = StyleSheet.create({
	SectionHeader: {
		fontSize: staticTheme.fontSizeLarge,
		padding: staticTheme.padding,
		textTransform: 'capitalize',
		fontWeight: 'bold'
	}
});

class ArtistScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ARTIST>> {
	state: {
		refreshing: boolean;
		data?: ArtistData;
		details: Array<HeaderDetail>;
	} = {
		details: this.buildDetails(),
		refreshing: false,
		data: undefined
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.setState({data: undefined, details: this.buildDetails()});
			this.load();
		}
	}

	private buildDetails(albums?: number, tracks?: number, genre?: string): Array<HeaderDetail> {
		return [
			{title: 'Albums', value: `${albums || ''}`},
			{title: 'Tracks', value: `${tracks || ''}`},
			{title: 'Genre', value: genre || ''}
		];
	}

	private load(forceRefresh: boolean = false): void {
		const {id} = this.props.route.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.artist(id, forceRefresh)
			.then(data => {
				const details = this.buildDetails(data.artist.albumCount, data.artist.trackCount, genreDisplay(data.artist.genres));
				this.setState({data, details, refreshing: false});

			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private renderHeader = (): JSX.Element => {
		const headerTitleCmds = (
			<>
				<FavIcon style={objHeaderStyles.button} objType={JamObjectType.artist} id={this.props.route.params?.id}/>
			</>
		);
		return (
			<ObjHeader
				id={this.props.route?.params?.id}
				title={this.props.route?.params?.name}
				details={this.state.details}
				typeName="Artist"
				headerTitleCmds={headerTitleCmds}
			/>
		);
	};

	private renderSection = ({section}: { section: SectionListData<BaseEntry> }): JSX.Element => (
		<ThemedText style={styles.SectionHeader}>{section.title}</ThemedText>
	);

	private renderItem = ({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: BaseEntry): string => item.id;

	private reload = (): void => {
		this.load(true);
	};

	render(): React.ReactElement {
		const sections = this.state.data?.albums || [];
		const {theme} = this.props;
		return (
			<SectionList
				sections={sections}
				ListHeaderComponent={this.renderHeader}
				ItemSeparatorComponent={Separator}
				SectionSeparatorComponent={Separator}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
				refreshControl={(
					<RefreshControl
						refreshing={this.state.refreshing}
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

export default withTheme(ArtistScreen);
