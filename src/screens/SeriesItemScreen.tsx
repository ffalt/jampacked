import React from 'react';
import {RefreshControl, SectionList, SectionListData, StyleSheet} from 'react-native';
import ThemedText from '../components/ThemedText';
import {staticTheme, withTheme} from '../style/theming';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import Item from '../components/Item';
import ObjHeader, {HeaderDetail} from '../components/ObjHeader';
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
		details: Array<HeaderDetail>;
		data?: SeriesData;
	} = {
		details: this.buildDetails(),
		refreshing: false,
		data: undefined
	};

	componentDidMount(): void {
		this.load();
	}

	componentDidUpdate(prevProps: { route: { params: { id?: string } } }): void {
		const newProps = this.props;
		if (prevProps.route?.params?.id !== newProps.route?.params?.id) {
			this.setState({data: undefined, details: this.buildDetails()});
			this.load();
		}
	}

	private buildDetails(artist?: string, tracks?: number, genre?: string): Array<HeaderDetail> {
		return [
			{title: 'Artist', value: `${artist || ''}`, click: artist ? this.toArtist : undefined},
			{title: 'Tracks', value: `${tracks || ''}`},
			{title: 'Genre', value: genre || ''}
		];
	}

	private load(forceRefresh: boolean = false): void {
		const {route} = this.props;
		const {id} = route?.params;
		if (!id) {
			return;
		}
		this.setState({refreshing: true});
		dataService.series(id, forceRefresh)
			.then(data => {
				const details = this.buildDetails(data.series.artist, data.series.trackCount, 'Audio Series');
				this.setState({data, details, refreshing: false});
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
		const {data} = this.state;
		if (data?.series?.artistID) {
			const {navigation} = this.props;
			navigation.navigate(HomeRoute.ARTIST,
				{id: data.series.artistID, name: data.series.artist || ''});
		}
	};

	private renderHeader = (): JSX.Element => {
		const {details} = this.state;
		const {route} = this.props;
		const {id, name} = route?.params;
		return (
			<ObjHeader
				id={id}
				title={name}
				typeName="Series"
				details={details}
			/>
		);
	};

	private renderSection = ({section}: { section: SectionListData<BaseEntry> }): JSX.Element => {
		const {theme} = this.props;
		return (
			<ThemedText style={[styles.SectionHeader, {borderBottomColor: theme.separator}]}>{section.title}</ThemedText>
		);
	};

	private renderItem = ({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>);

	private keyExtractor = (item: BaseEntry): string => item.id;

	render(): React.ReactElement {
		const {data, refreshing} = this.state;
		const sections = data?.albums || [];
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
						refreshing={refreshing}
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
