import React, {MutableRefObject, useCallback, useState} from 'react';
import {DefaultFlatList} from './DefFlatList';
import {TrackEntry} from '../services/types';
import {TrackDisplayFunction, TrackItem} from './TrackItem';
import {ErrorView} from './ErrorView';
import {FloatingAction} from 'react-native-floating-action';
import {executeTrackMenuAction, trackMenuIcon, trackMenuMultiSelectActions, trackMenuSingleSelectActions} from './ActionMenuTrack';

export const Tracks: React.FC<{
	tracks?: Array<TrackEntry>;
	ListHeaderComponent: React.ComponentType<any> | React.ReactElement | null;
	error?: Error;
	refreshing: boolean;
	displayFunc?: TrackDisplayFunction;
	onRefresh: () => void;
	onLoadMore?: () => void;
}> = ({tracks, refreshing, displayFunc, onRefresh, onLoadMore, error, ListHeaderComponent}) => {
	const selectActionRef: MutableRefObject<FloatingAction | null> = React.useRef<FloatingAction>(null);
	const [selection, setSelection] = useState<Array<TrackEntry>>([]);

	const setSelected = useCallback((item: TrackEntry): void => {
		if (selection.includes(item)) {
			setSelection(selection.filter(t => t !== item));
		} else {
			setSelection(selection.concat([item]));
		}
	}, [selection, setSelection]);

	const pressFloatingAction = useCallback((name?: string): void => {
		executeTrackMenuAction(selection, name).then(result => {
			if (result) {
				setSelection([]);
			}
		});
	}, [selection, setSelection]);

	const renderItemRow = useCallback(({item}: { item: TrackEntry }): JSX.Element => {
		return (<TrackItem track={item} isSelected={selection.includes(item)} setSelected={setSelected} displayFunc={displayFunc}/>);
	}, [displayFunc, selection, setSelected]);


	if (error) {
		return (<ErrorView error={error} onRetry={onRefresh}/>);
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
				ref={selectActionRef}
				visible={selection.length > 0}
				animated={false}
				showBackground={false}
				floatingIcon={trackMenuIcon}
				actions={selection.length === 1 ? trackMenuSingleSelectActions : trackMenuMultiSelectActions}
				onPressItem={pressFloatingAction}
			/>
		</>);
};
