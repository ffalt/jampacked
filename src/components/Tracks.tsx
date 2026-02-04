import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { DefaultFlatList } from './DefaultFlatList.tsx';
import { TrackDisplayFunction, TrackItem } from './TrackItem';
import { ErrorView } from './ErrorView';
import { executeTrackMenuAction } from './ActionMenuTrack';
import { JamPlayer } from '../services/player.service.ts';
import { staticTheme, useTheme } from '../style/theming';
import { TrackEntry } from '../types/track.ts';
import { ThemedText } from './ThemedText';
import { ThemedIcon } from './ThemedIcon';
import { formatDuration } from '../utils/duration.utils';

interface SelectionAction {
	name: string;
	icon: string;
	label: string;
}

const multiSelectActions: Array<SelectionAction> = [
	{ name: 'bt_m_play', icon: 'play', label: 'Play selected tracks' },
	{ name: 'bt_m_queue', icon: 'list-add', label: 'Add to queue' },
	{ name: 'bt_clear', icon: 'minus', label: 'Clear selection' }
];

const singleSelectActions: Array<SelectionAction> = [
	{ name: 'bt_s_play', icon: 'play', label: 'Play track' },
	{ name: 'bt_s_queue', icon: 'list-add', label: 'Add to queue' },
	{ name: 'bt_s_open', icon: 'track', label: 'Open track details' }
];

const styles = StyleSheet.create({
	selectionContainer: {
		position: 'absolute',
		bottom: staticTheme.paddingLarge,
		right: staticTheme.padding,
		alignItems: 'flex-end',
		gap: staticTheme.paddingSmall
	},
	selectionInfo: {
		paddingHorizontal: staticTheme.paddingLarge,
		paddingVertical: staticTheme.padding,
		borderRadius: 20,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4
	},
	selectionText: {
		fontSize: staticTheme.fontSize,
		fontWeight: '500'
	},
	actionsRow: {
		flexDirection: 'row',
		borderRadius: 25,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		overflow: 'hidden'
	},
	actionButton: {
		paddingHorizontal: staticTheme.paddingLarge + 5,
		paddingVertical: staticTheme.paddingLarge,
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 56
	},
	actionIcon: {
		fontSize: 26
	},
	tooltip: {
		paddingHorizontal: staticTheme.padding,
		paddingVertical: staticTheme.paddingSmall,
		borderRadius: 8,
		marginBottom: staticTheme.paddingSmall
	},
	tooltipText: {
		fontSize: staticTheme.fontSizeSmall
	}
});

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
	const [showCheck, setShowCheck] = useState<boolean>(false);
	const [selection, setSelection] = useState<Array<TrackEntry>>([]);
	const [tooltip, setTooltip] = useState<string | null>(null);
	const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showTooltip = useCallback((label: string): void => {
		if (tooltipTimeout.current) {
			clearTimeout(tooltipTimeout.current);
		}
		setTooltip(label);
		tooltipTimeout.current = setTimeout(() => {
			setTooltip(null);
		}, 1500);
	}, []);

	useEffect(() => (): void => {
		if (tooltipTimeout.current) {
			clearTimeout(tooltipTimeout.current);
		}
	}, []);

	const selectionInfo = useMemo(() => {
		if (selection.length === 0) {
			return null;
		}
		const totalDuration = selection.reduce((sum, track) => sum + track.durationMS, 0);
		return {
			count: selection.length,
			duration: formatDuration(totalDuration)
		};
	}, [selection]);

	const actions = useMemo((): Array<SelectionAction> => {
		if (selection.length === 0) {
			return [];
		}
		return selection.length === 1 ? singleSelectActions : multiSelectActions;
	}, [selection]);

	const applySelection = useCallback((list: Array<TrackEntry>): void => {
		setShowCheck(list.length > 0);
		setSelection(list);
	}, []);

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

	const pressAction = useCallback((name: string): void => {
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
			{selectionInfo && (
				<View style={styles.selectionContainer}>
					<View style={[styles.selectionInfo, { backgroundColor: theme.floating.background }]}>
						<ThemedText style={[styles.selectionText, { color: theme.floating.color }]}>
							{`${selectionInfo.count} ${selectionInfo.count === 1 ? 'track' : 'tracks'} · ${selectionInfo.duration}`}
						</ThemedText>
					</View>
					{tooltip && (
						<View style={[styles.tooltip, { backgroundColor: theme.floating.background }]}>
							<ThemedText style={[styles.tooltipText, { color: theme.floating.color }]}>
								{tooltip}
							</ThemedText>
						</View>
					)}
					<View style={[styles.actionsRow, { backgroundColor: theme.floating.background }]}>
						{actions.map(action => (
							<Pressable
								key={action.name}
								style={styles.actionButton}
								onPress={(): void => pressAction(action.name)}
								onLongPress={(): void => showTooltip(action.label)}
							>
								<ThemedIcon name={action.icon} color={theme.floating.color} style={styles.actionIcon} />
							</Pressable>
						))}
					</View>
				</View>
			)}
		</>
	);
};
