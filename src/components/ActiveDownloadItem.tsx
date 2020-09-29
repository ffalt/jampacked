import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {DownloadTask} from 'react-native-background-downloader';
import {ThemedText} from '../components/ThemedText';
import {formatDuration} from '../utils/duration.utils';
import {ThemedIcon} from '../components/ThemedIcon';
import {CircularProgress} from '../components/CircularProgress';
import {useDownloadStatus} from '../services/pin-hooks';
import {sharedStyles} from '../style/shared';

export const ActiveDownloadItem: React.FC<{ item: DownloadTask }> = React.memo(({item}) => {
	const [state, setState] = useState<{ indeterminate: boolean, text: string, state: string, duration: string, icon: string, percent: number }>({
		text: '',
		state: '',
		duration: '',
		icon: 'download',
		percent: 0,
		indeterminate: false
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
		const indeterminate = progress?.task.state !== 'PAUSED' || progress?.task.percent === -1;
		const percent = Math.max(progress?.task.percent || 0, 0);
		const etaInMilliSeconds = progress?.task.etaInMilliSeconds || 0;
		const duration = etaInMilliSeconds <= 0 ?
			'' :
			'ETA: ' + formatDuration((progress?.task.etaInMilliSeconds || 0));
		setState({
			indeterminate, percent,
			duration: duration,
			text: progress?.task.tag || progress?.task.id || '',
			icon: progress?.task.state === 'DOWNLOADING' ? 'pause' : 'download',
			state: (progress?.task.state || '') + (percent > 0 ? ` (${(percent * 100).toFixed(0)}%)` : '')
		});
	}, [progress]);

	return (
		<View style={sharedStyles.item}>
			<View style={sharedStyles.itemSectionLeft}>
				<CircularProgress
					indeterminate={state.indeterminate}
					size={26}
					strokeWidth={2}
					progress={state.percent}
				/>
			</View>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={1}>{state.text}</ThemedText>
				<View style={sharedStyles.itemFooter}>
					<ThemedText style={sharedStyles.itemFooterText}>{state.state}</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>{state.duration}</ThemedText>
				</View>
			</View>
			<TouchableOpacity onPress={handlePress} style={sharedStyles.itemSectionRight}>
				<ThemedIcon name={state.icon}/>
			</TouchableOpacity>
		</View>
	);
});
