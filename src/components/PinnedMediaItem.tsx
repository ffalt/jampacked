import React, {useCallback, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from '../components/ThemedText';
import {ThemedIcon} from '../components/ThemedIcon';
import {JamImage} from './JamImage';
import {PinMedia} from '../services/types';
import {sharedStyles} from '../style/shared';
import {titleCase} from '../utils/format.utils';

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
		<View style={[sharedStyles.item, {backgroundColor: theme.background}]}>
			<JamImage id={item.id} size={staticTheme.thumb} style={sharedStyles.itemSectionLeft}/>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText}>{item.name}</ThemedText>
				<View style={sharedStyles.itemFooter}>
					<ThemedText style={sharedStyles.itemFooterText}>{titleCase(item.objType)}</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>Tracks: {item.tracks.length}</ThemedText>
				</View>
			</View>
			{/*<TouchableOpacity onPress={handlePress} style={sharedStyles.itemImageRight}>*/}
			{/*	<ThemedIcon name="pin" size={26}/>*/}
			{/*</TouchableOpacity>*/}
		</View>
	);
});
