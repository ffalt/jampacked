import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ThemedText} from './ThemedText';
import {CircularProgress} from './CircularProgress';
import {useDownloadStatus} from '../services/pin-hooks';
import {sharedStyles} from '../style/shared';
import {Download} from 'react-native-track-player';
import {DownloadState} from '../services/player-api';


const downloadStateToString = (mode: DownloadState): string => {
	switch (mode) {
		case DownloadState.Completed:
			return 'Completed';
		case DownloadState.Downloading:
			return 'Downloading';
		case DownloadState.Failed:
			return 'Failed';
		case DownloadState.Queued:
			return 'Queued';
		case DownloadState.Removing:
			return 'Removing';
		case DownloadState.Restarting:
			return 'Restarting';
		case DownloadState.Stopped:
			return 'Stopped';
		default:
			return 'Unknown';
	}
};

export const ActiveDownloadItem: React.FC<{ item: Download }> = React.memo(({item}) => {
	const [state, setState] = useState<{
		indeterminate: boolean, text: string, state: string, bytes: string,
		// icon: string,
		percent: number
	}>({
		text: '',
		state: '',
		bytes: '',
		// icon: 'download',
		percent: 0,
		indeterminate: false
	});
	const download = useDownloadStatus(item.id);

	// const handlePress = useCallback((): void => {
	// NavigationService.navigateObj(JamObjectType.track, item.id, item.id);
	// }, [download]);

	useEffect(() => {
		const o = download ? download : item;
		const indeterminate = false; // progress?.task.state !== 'PAUSED' || progress?.task.percent === -1;
		const percent = Math.max(o.percentDownloaded || 0, 0);
		// const etaInMilliSeconds = progress?.task.etaInMilliSeconds || 0;
		// const duration = etaInMilliSeconds <= 0 ?
		// 	'' :
		// 	'ETA: ' + formatDuration((progress?.task.etaInMilliSeconds || 0));
		setState({
			indeterminate,
			percent,
			bytes: `${o.bytesDownloaded}`,
			text: o.id || '',
			// icon: download?.state === DownloadState. 'DOWNLOADING' ? 'pause' : 'download',
			state: downloadStateToString(o.state)
		});
	}, [download, item]);

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
					<ThemedText style={sharedStyles.itemFooterText}>{state.bytes}</ThemedText>
				</View>
			</View>
			{/*<TouchableOpacity onPress={handlePress} style={sharedStyles.itemSectionRight}>*/}
			{/*	<ThemedIcon name={state.icon}/>*/}
			{/*</TouchableOpacity>*/}
		</View>
	);
});
