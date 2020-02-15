import React from 'react';
import {HomeRoute, HomeStackWithThemeProps} from '../navigators/Routing';
import PageHeader from '../components/PageHeader';
import {FlatList, RefreshControl} from 'react-native';
import Separator from '../components/Separator';
import {TrackEntry} from '../services/data';
import TrackItem, {trackEntryHeight} from '../components/TrackItem';
import {withTheme} from '../style/theming';
import {commonItemLayout} from '../components/AtoZList';

class TracksScreen extends React.PureComponent<HomeStackWithThemeProps<HomeRoute.TRACKS>> {

	private reload = (): void => {

	};

	private keyExtractor = (item: TrackEntry): string => item.id;

	private renderItem = ({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item}/>);

	private renderHeader = (): JSX.Element => <PageHeader title="Tracks" titleIcon="track"/>;

	private getItemLayout = commonItemLayout(trackEntryHeight);

	render(): React.ReactElement {
		const {theme} = this.props;
		const tracks: Array<TrackEntry> = [];
		const refreshing = false;
		return (
			<FlatList
				data={tracks}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={this.renderHeader}
				getItemLayout={this.getItemLayout}
				refreshControl={(
					<RefreshControl
						refreshing={refreshing}
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

export default withTheme(TracksScreen);
