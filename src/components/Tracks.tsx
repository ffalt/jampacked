import React, { RefObject, useCallback, useState } from 'react';
import { DefaultFlatList } from './DefaultFlatList.tsx';
import { TrackDisplayFunction, TrackItem } from './TrackItem';
import { ErrorView } from './ErrorView';
import { FloatingAction } from 'react-native-floating-action';
import { ActionMenuItem, executeTrackMenuAction, trackMenuIcon, trackMenuMultiSelectActions, trackMenuSingleSelectActions } from './ActionMenuTrack';
import { JamPlayer } from '../services/player.service.ts';
import { useTheme } from '../style/theming';
import { TrackEntry } from '../types/track.ts';

export const Tracks: React.FC<{
	tracks?: Array<TrackEntry>;
	ListHeaderComponent: React.ComponentType<any> | React.ReactElement | null;
	error?: Error;
	refreshing: boolean;
	displayFunc?: TrackDisplayFunction;
	onRefresh: () => void;
	onLoadMore?: () => void;
}> = ({ tracks, refreshing, displayFunc, onRefresh, onLoadMore, error, ListHeaderComponent }) => {
	const theme = useTheme();
	const selectActionReference: RefObject<FloatingAction | null> = React.useRef<FloatingAction>(null);
	const [showCheck, setShowCheck] = useState<boolean>(false);
	const [selection, setSelection] = useState<Array<TrackEntry>>([]);
	const [actions, setActions] = useState<Array<ActionMenuItem>>([]);
	const buttonIcon = React.useMemo(() => trackMenuIcon(theme.floating.color), [theme]);
	const singleSelectActions = React.useMemo(() => trackMenuSingleSelectActions(theme.floating.background, theme.floating.color), [theme]);
	const multiSelectActions = React.useMemo(() => trackMenuMultiSelectActions(theme.floating.background, theme.floating.color), [theme]);

	const applySelection = useCallback((list: Array<TrackEntry>): void => {
		setActions(list.length === 1 ? singleSelectActions : multiSelectActions);
		setShowCheck(list.length > 0);
		setSelection(list);
	}, [setActions, setSelection, singleSelectActions, multiSelectActions]);

	const setSelected = useCallback((item: TrackEntry): void => {
		if (selection.includes(item)) {
			applySelection(selection.filter(t => t !== item));
		} else {
			applySelection([...selection, item]);
		}
	}, [selection, applySelection]);

	const doubleTab = useCallback((track: TrackEntry): void => {
		JamPlayer.playTrack(track)
			.catch(console.error);
		applySelection([]);
	}, [applySelection]);

	const pressFloatingAction = useCallback((name?: string): void => {
		executeTrackMenuAction(selection, name)
			.then(result => {
				if (result) {
					applySelection([]);
				}
			})
			.catch(console.error);
	}, [selection, applySelection]);

	const renderItemRow = useCallback(({ item }: { item: TrackEntry }): React.JSX.Element => (
		<TrackItem
			track={item}
			showCheck={showCheck}
			isSelected={selection.includes(item)}
			setSelected={setSelected}
			doubleTab={doubleTab}
			displayFunc={displayFunc}
		/>
	), [displayFunc, selection, setSelected, showCheck, doubleTab]);

	if (error) {
		return (<ErrorView error={error} onRetry={onRefresh} />);
	}
	return (
		<>
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
				ref={selectActionReference}
				visible={selection.length > 0}
				animated={false}
				showBackground={false}
				color={theme.floating.background}
				floatingIcon={buttonIcon}
				actions={actions}
				onPressItem={pressFloatingAction}
			/>
		</>
	);
};
