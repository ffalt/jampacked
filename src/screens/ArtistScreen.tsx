import React from 'react';
import {SectionList, SectionListData, StyleSheet} from 'react-native';
import ThemedText from '../components/ThemedText';
import {Jam} from '../services/jam';
import {staticTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item from '../components/Item';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import {genreDisplay} from '../utils/genre.utils';
import Separator from '../components/Separator';
import dataService, {ArtistData, ItemData} from '../services/data';

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
		data?: ArtistData;
	} = {
		data: undefined
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
		this.setState({data: undefined});
		if (!id) {
			return;
		}
		const data = await dataService.artist(id);
		this.setState({data});
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

	private renderSection = ({section}: { section: SectionListData<ItemData<Jam.Album>> }): JSX.Element => (
		<ThemedText style={styles.SectionHeader}>{section.title}</ThemedText>
	);

	private renderItem = ({item}: { item: ItemData<Jam.Album> }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: ItemData<Jam.Album>): string => item.id;

	render(): JSX.Element {
		const sections = this.state.data?.sections || [];
		return (
			<SectionList
				sections={sections}
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
