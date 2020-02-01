import React from 'react';
import {SectionList, SectionListData, StyleSheet, TouchableOpacity} from 'react-native';
import ThemedText from '../components/ThemedText';
import {Jam} from '../services/jam';
import {staticTheme, withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item from '../components/Item';
import ObjHeader, {objHeaderStyles} from '../components/ObjHeader';
import dataService, {ItemData, SeriesData} from '../services/data';

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
		data?: SeriesData;
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
		const data = await dataService.series(id);
		this.setState({data});
	}

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

	private renderSection = ({section}: { section: SectionListData<ItemData<Jam.Album>> }): JSX.Element => (
		<ThemedText style={[styles.SectionHeader, {borderBottomColor: this.props.theme.separator}]}>{section.title}</ThemedText>
	);

	private renderItem = ({item}: { item: ItemData<Jam.Album> }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: ItemData<Jam.Album>): string => item.id;

	render(): JSX.Element {
		const sections = this.state.data?.sections || [];
		return (
			<SectionList
				sections={sections}
				ListHeaderComponent={this.renderHeader}
				keyExtractor={this.keyExtractor}
				renderSectionHeader={this.renderSection}
				renderItem={this.renderItem}
			/>
		);
	}
}


export default withTheme(SeriesItemScreen);
