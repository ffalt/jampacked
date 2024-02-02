import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedIcon} from './ThemedIcon';
import {CircularProgress} from './CircularProgress';
import {useDownloadStatus} from '../services/pin-hooks';
import {sharedStyles} from '../style/shared';
import {DownloadTask} from '../services/media-cache.ts';

export const ActiveDownloadItem: React.FC<{ item: DownloadTask }> = React.memo(({item}) => {
	const [state, setState] = useState<{
		text: string, state: string, icon: string, percent: number }>({
		text: '',
		state: '',
		icon: 'download',
		percent: 0
	});
	const progress = useDownloadStatus(item.id);

	const handlePress = useCallback((): void => {
		if (progress) {
			if (progress.task.state !== 'PAUSED') {
				progress.task.pause();
			} else {
				progress.task.resume();
			}
		}
		// NavigationService.navigateObj(JamObjectType.track, item.id, item.id);
	}, [progress]);

	useEffect(() => {
		if (!progress) {
			return;
		}
		let percent = progress.task.bytesDownloaded / progress.task.bytesTotal;
		percent = Math.max(percent || 0, 0);
		setState({
			percent,
			text: progress.task.id || '',
			icon: progress.task.state === 'DOWNLOADING' ? 'pause' : 'download',
			state: (progress.task.state || '') + (percent > 0 ? ` (${(percent * 100).toFixed(0)}%)` : '')
		});
	}, [progress]);

	return (
		<View style={sharedStyles.item}>
			<View style={sharedStyles.itemSectionLeft}>
				<CircularProgress
					size={26}
					strokeWidth={2}
					progress={state.percent}
				/>
			</View>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={1}>{state.text}</ThemedText>
				<View style={sharedStyles.itemFooter}>
					<ThemedText style={sharedStyles.itemFooterText}>{state.state}</ThemedText>
				</View>
			</View>
			<TouchableOpacity onPress={handlePress} style={sharedStyles.itemSectionRight}>
				<ThemedIcon name={state.icon}/>
			</TouchableOpacity>
		</View>
	);
});
