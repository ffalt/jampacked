import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {DownloadTask} from 'react-native-background-downloader';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from '../components/ThemedText';
import {formatDuration} from '../utils/duration.utils';
import {ThemedIcon} from '../components/ThemedIcon';
import {CircularProgress} from '../components/CircularProgress';
import {useDownloadStatus} from '../services/cache-hooks';
import {PinMedia} from '../services/data';
import {JamImage} from './JamImage';

const styles = StyleSheet.create({
	item: {
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'row',
		flex: 1,
		height: 45,
		marginRight: 5,
		alignItems: 'center'
	},
	itemContent: {
		flex: 1,
		flexDirection: 'column',
		marginHorizontal: 10
	},
	itemFooterText: {
		fontSize: staticTheme.fontSizeTiny
	},
	itemFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	itemText: {
		fontSize: staticTheme.fontSizeSmall
	},
});

export const PinnedMediaItem: React.FC<{ item: PinMedia }> = React.memo(({item}) => {
	const theme = useTheme();
	// const [state, setState] = useState<{ indeterminate: boolean, text: string, state: string, duration: string, icon: string, percent: number }>({
	// 	text: '',
	// 	state: '',
	// 	duration: '',
	// 	icon: 'download',
	// 	percent: 0,
	// 	indeterminate: false
	// });
	// const progress = useDownloadStatus(item.id);

	const handlePress = useCallback((): void => {
		// if (progress) {
		// 	if (progress.task.state !== 'PAUSED') {
		// 		progress.task.pause();
		// 	} else {
		// 		progress.task.resume();
		// 	}
		// }
		// NavigationService.navigateObj(JamObjectType.track, item.id, item.id);
	}, []);

	useEffect(() => {
		// const indeterminate = progress?.task.state !== 'PAUSED' || progress?.task.percent === -1;
		// const percent = Math.max(progress?.task.percent || 0, 0);
		// const etaInMilliSeconds = progress?.task.etaInMilliSeconds || 0;
		// const duration = etaInMilliSeconds <= 0 ?
		// 	'' :
		// 	'ETA: ' + formatDuration((progress?.task.etaInMilliSeconds || 0));
		// setState({
		// 	indeterminate, percent,
		// 	duration: duration,
		// 	text: progress?.task.tag || progress?.task.id || '',
		// 	icon: progress?.task.state === 'DOWNLOADING' ? 'pause' : 'download',
		// 	state: (progress?.task.state || '') + (percent > 0 ? ` (${(percent * 100).toFixed(0)}%)` : '')
		// });
	}, []);

	return (
		<View style={[styles.item, {backgroundColor: theme.background}]}>
			<JamImage id={item.id} size={staticTheme.thumb}/>
			<View style={styles.itemContent}>
				<ThemedText style={styles.itemText}>{item.name}</ThemedText>
				<View style={styles.itemFooter}>
					<ThemedText style={styles.itemFooterText}>{item.objType}</ThemedText>
					<ThemedText style={styles.itemFooterText}>Tracks: {item.tracks.length}</ThemedText>
				</View>
			</View>
			<TouchableOpacity onPress={handlePress}>
				<ThemedIcon name="pin"/>
			</TouchableOpacity>
		</View>
	);
});
