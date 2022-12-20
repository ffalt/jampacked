import React, {MutableRefObject, useCallback, useState} from 'react';
import {DefaultFlatList} from './DefFlatList';
import {TrackEntry} from '../services/types';
import {TrackDisplayFunction, TrackItem} from './TrackItem';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import {ActionSheetTrack} from './ActionSheetTrack';
import {useTheme} from '../style/theming';
import {ErrorView} from './ErrorView';
import {FloatingAction} from 'react-native-floating-action';
import {JamPlayer} from '../services/player';
import {ThemedIcon} from './ThemedIcon';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	playButton: {
		color: '#ffffff'
	}
});

const actions = [
	{
		text: 'Add to Queue',
		icon: <ThemedIcon name={'list-add'} color={styles.playButton.color}/>,
		name: 'bt_queue',
		position: 1
	},
	{
		text: 'Play',
		icon: <ThemedIcon name={'play'} color={styles.playButton.color}/>,
		name: 'bt_play',
		position: 2
	}
];

const menuIcon = <ThemedIcon name={'menu'} color={styles.playButton.color}/>;

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
		const actionSheetRef: MutableRefObject<ActionSheetRef | null> = React.useRef<ActionSheetRef>(null);
		const floatingActionRef: MutableRefObject<FloatingAction | null> = React.useRef<FloatingAction>(null);
		const theme = useTheme();
		const [currentTrack, setCurrentTrack] = useState<TrackEntry | undefined>();
		const [selection, setSelection] = useState<Array<TrackEntry>>([]);

		const showMenu = useCallback((item: TrackEntry): void => {
			setCurrentTrack(item);
			if (actionSheetRef.current) {
				actionSheetRef.current.setModalVisible(true);
			}
		}, [actionSheetRef]);

		const setSelected = useCallback((item: TrackEntry): void => {
			if (selection.includes(item)) {
				setSelection(selection.filter(t => t !== item));
			} else {
				setSelection(selection.concat([item]));
			}
		}, [selection, setSelection]);

		const pressFloatingAction = useCallback((name?: string): void => {
			if (selection.length > 0) {
				if (name === 'bt_play') {
					JamPlayer.playTracks(selection)
						.then(() => {
							setSelection([]);
						})
						.catch(e => console.error(e));
				} else if (name === 'bt_queue') {
					JamPlayer.addTracksToQueue(selection)
						.then(() => {
							setSelection([]);
						})
						.catch(e => console.error(e));
				}
			}
		}, [selection, setSelection]);

		const closeMenu = useCallback((): void => {
			if (actionSheetRef.current) {
				actionSheetRef.current.setModalVisible(false);
			}
		}, [actionSheetRef]);

		const renderItemRow = useCallback(({item}: { item: TrackEntry }): JSX.Element => {
			return (<TrackItem track={item} showMenu={showMenu} isSelected={selection.includes(item)} setSelected={setSelected} displayFunc={displayFunc}/>);
		}, [displayFunc, showMenu, selection, setSelected]);


		if (error) {
			return (<ErrorView error={error} onRetry={onRefresh}/>);
		}
		return (
			<>
				<ActionSheet
					ref={actionSheetRef}
					animated={false}
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
				<FloatingAction
					ref={floatingActionRef}
					visible={selection.length > 0}
					showBackground={false}
					floatingIcon={menuIcon}
					actions={actions}
					onPressItem={pressFloatingAction}
				/>
			</>);
	};
