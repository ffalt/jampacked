import React from 'react';
import {SectionList, SectionListData, StyleSheet, TouchableOpacity} from 'react-native';
import ThemedText from '../components/ThemedText';
import {Jam} from '../services/jam';
import jam from '../services/jamapi';
import {staticTheme, withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item, {ItemData} from '../components/Item';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';

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
		series?: Jam.Series,
		sections: Array<SectionListData<ItemData<Jam.Album>>>;
	} = {
		series: undefined,
		sections: []
	};

	componentDidMount(): void {
		this.load(this.props.route.params.id)
			.catch(e => console.error(e));
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		if (prevProps.route.params?.id !== this.props.route.params?.id) {
			this.load(this.props.route.params.id)
				.catch(e => console.error(e));
		}
	}

	private async load(id: string): Promise<void> {
		if (!id) {
			return;
		}
		const series = await jam.series.id({id, seriesAlbums: true});
		const sections: Array<SectionListData<ItemData<Jam.Album>>> = [];
		(series.albums || []).forEach(album => {
			let section = sections.find(s => s.key === album.albumType);
			if (!section) {
				section = {
					key: album.albumType,
					title: album.albumType,
					data: []
				};
				sections.push(section);
			}
			section.data = section.data.concat([{
				obj: album,
				id: album.id,
				title: album.name,
				desc: `Episode ${album.seriesNr}`,
				click: (): void => {
					this.props.navigation.navigate(HomeRoute.ALBUM, {id: album.id, name: album.name});
				}
			}]);
		});
		this.setState({series, sections});
	}

	private toArtist = (): void => {
		if (this.state.series && this.state.series.artistID) {
			this.props.navigation.navigate(HomeRoute.ARTIST, {id: this.state.series.artistID, name: this.state.series.artist || ''});
		}
	};

	private renderHeader = (): JSX.Element => (
		<ObjHeader id={this.props.route?.params?.id} title={this.props.route?.params?.name}>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Artist</ThemedText>
			<TouchableOpacity onPress={this.toArtist}>
				<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.series?.artist}</ThemedText>
			</TouchableOpacity>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.series?.trackCount}</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>Audio Series</ThemedText>
		</ObjHeader>
	);

	private renderSection = ({section}: { section: SectionListData<ItemData<Jam.Album>> }): JSX.Element => (
		<ThemedText style={[styles.SectionHeader, {borderBottomColor: this.props.theme.separator}]}>{section.title}</ThemedText>
	);

	private renderItem = ({item}: { item: ItemData<Jam.Album> }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: ItemData<Jam.Album>): string => item.id;

	render(): JSX.Element {
		return (
			<SectionList
				sections={this.state.sections}
				ListHeaderComponent={this.renderHeader}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
			/>
		);
	}
}


export default withTheme(SeriesItemScreen);
