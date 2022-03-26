import React, {MutableRefObject, useCallback, useState} from 'react';
import {DefaultFlatList} from './DefFlatList';
import {TrackEntry} from '../services/types';
import {TrackDisplayFunction, TrackItem} from './TrackItem';
import ActionSheet from 'react-native-actions-sheet';
import {ActionSheetTrack} from './ActionSheetTrack';
import {useTheme} from '../style/theming';
import {ErrorView} from './ErrorView';

export const Tracks: React.FC<{
	tracks?: Array<TrackEntry>;
	ListHeaderComponent: React.ComponentType<any> | React.ReactElement | null;
	error?: Error;
	refreshing: boolean;
	displayFunc?: TrackDisplayFunction;
	onRefresh: () => void;
	onLoadMore?: () => void;
}> =
	({tracks, refreshing, displayFunc, onRefresh, onLoadMore, error, ListHeaderComponent}) => {
		const actionSheetRef: MutableRefObject<ActionSheet | null> = React.useRef<ActionSheet>(null);
		const theme = useTheme();
		const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
		const showMenu = useCallback((item: TrackEntry): void => {
			setCurrentTrack(item);
			if (actionSheetRef.current) {
				actionSheetRef.current.setModalVisible(true);
			}
		}, [actionSheetRef]);

		const closeMenu = useCallback((): void => {
			if (actionSheetRef.current) {
				actionSheetRef.current.setModalVisible(false);
			}
		}, [actionSheetRef]);
		const renderItemRow = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item} showMenu={showMenu} displayFunc={displayFunc}/>),
			[displayFunc, showMenu]);
		if (error) {
			return (<ErrorView error={error} onRetry={onRefresh}/>);
		}
		return (
			<>
				<ActionSheet
					initialOffsetFromBottom={1}
					ref={actionSheetRef}
					bounceOnOpen={true}
					bounciness={8}
					gestureEnabled={true}
					containerStyle={{backgroundColor: theme.background}}
					defaultOverlayOpacity={0.3}>
					<ActionSheetTrack item={currentTrack} close={closeMenu}/>
				</ActionSheet>
				<DefaultFlatList
					id="rows"
					items={tracks}
					renderItem={renderItemRow}
					error={error}
					ListHeaderComponent={ListHeaderComponent}
					onEndReachedThreshold={0.4}
					onEndReached={onLoadMore}
					loading={refreshing}
					reload={onRefresh}
				/>
			</>);
	};
