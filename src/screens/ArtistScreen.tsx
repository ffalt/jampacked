import React from 'react';
import {SectionList, SectionListData, StyleSheet} from 'react-native';
import ThemedText from '../components/ThemedText';
import {staticTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item from '../components/Item';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {ArtistData, BaseEntry} from '../services/data';
import {snackError} from '../services/snack';

const styles = StyleSheet.create({
	SectionHeader: {
		fontSize: staticTheme.fontSizeLarge,
		padding: staticTheme.padding,
		textTransform: 'capitalize',
		fontWeight: 'bold'
	}
});

export default class ArtistScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.ARTIST>> {
	state: {
		refreshing: boolean;
		data?: ArtistData;
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
		dataService.artist(id, forceRefresh)
			.then(data => {
				this.setState({data, refreshing: false});

			})
			.catch(e => {
				this.setState({refreshing: false});
				snackError(e);
			});
	}

	private renderHeader = (): JSX.Element => (
		<ObjHeader id={this.props.route?.params?.id} title={this.props.route?.params?.name}>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Albums</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.artist.albumCount}</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.data?.artist.trackCount}</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{genreDisplay(this.state.data?.artist.genres)}</ThemedText>
		</ObjHeader>
	);

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
		return (
			<SectionList
				sections={sections}
				ListHeaderComponent={this.renderHeader}
				ItemSeparatorComponent={Separator}
				SectionSeparatorComponent={Separator}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
				refreshing={this.state.refreshing}
				onRefresh={this.reload}
			/>
		);
	}
}
