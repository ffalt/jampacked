import React from 'react';
import {SectionList, SectionListData, StyleSheet} from 'react-native';
import ThemedText from '../components/ThemedText';
import {Jam} from '../services/jam';
import jam from '../services/jamapi';
import {staticTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item, {ItemData} from '../components/Item';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';

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
		artist?: Jam.Artist;
		sections: Array<SectionListData<ItemData<Jam.Album>>>;
	} = {
		artist: undefined,
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
		const artist = await jam.artist.id({id, artistAlbums: true});
		const sections: Array<SectionListData<ItemData<Jam.Album>>> = [];
		(artist.albums || []).forEach(album => {
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
				desc: `${album.year}`,
				click: (): void => {
					this.props.navigation.navigate(HomeRoute.ALBUM, {id: album.id, name: album.name});
				}
			}]);
		});
		this.setState({artist, sections});
	}

	private renderHeader = (): JSX.Element => (
		<ObjHeader id={this.props.route?.params?.id} title={this.props.route?.params?.name}>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Albums</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.artist?.albumCount}</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Tracks</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{this.state.artist?.trackCount}</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperLabel}>Genre</ThemedText>
			<ThemedText style={objHeaderStyles.ListHeaderUpperTitle}>{genreDisplay(this.state.artist?.genres)}</ThemedText>
		</ObjHeader>
	);

	private renderSection = ({section}: { section: SectionListData<ItemData<Jam.Album>> }): JSX.Element => (
		<ThemedText style={styles.SectionHeader}>{section.title}</ThemedText>
	);

	private renderItem = ({item}: { item: ItemData<Jam.Album> }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: ItemData<Jam.Album>): string => item.id;

	render(): JSX.Element {
		return (
			<SectionList
				sections={this.state.sections}
				ListHeaderComponent={this.renderHeader}
				ItemSeparatorComponent={Separator}
				SectionSeparatorComponent={Separator}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
			/>
		);
	}
}
