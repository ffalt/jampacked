import React, {useEffect, useState} from 'react';
import {DimensionValue, StyleSheet, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {sharedStyles} from '../style/shared';
import {Download, downloadStateToString} from '../services/player-api';
import {usePinnedMediaDownload} from '../services/pin-hooks';
import {humanFileSize} from '../utils/filesize.utils';
import {useTheme} from '../style/theming.ts';

const styles = StyleSheet.create({
	miniProgress: {
		height: 2
	},
	footer: {
		marginBottom: 5
	}
});

export const ActiveDownloadItem: React.FC<{ item: Download }> = React.memo(({item}) => {
	const theme = useTheme();
	const [state, setState] = useState<{
		text: string, state: string, bytes: string,
		percent: number
	}>({
		text: '',
		state: '',
		bytes: '',
		percent: 0
	});
	const {download, track} = usePinnedMediaDownload(item.id);

	useEffect(() => {
		const o = download ? download : item;
		const percent = Math.max(o.percentDownloaded || 0, 0);
		setState({
			percent,
			bytes: `${humanFileSize(o.bytesDownloaded)}`,
			text: !track ? 'Loading' : ([track.album, track.title].join('-')),
			state: downloadStateToString(o.state)
		});
	}, [download, item, track]);

	const width: DimensionValue = `${state.percent}%`;
	return (
		<View style={sharedStyles.item}>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={1}>{state.text}</ThemedText>
				<View style={[sharedStyles.itemFooter, styles.footer]}>
					<ThemedText style={sharedStyles.itemFooterText}>{state.state}</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>{state.percent.toFixed(2)}%</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>{state.bytes}</ThemedText>
				</View>
				<View style={[styles.miniProgress, {backgroundColor: theme.separator}]}>
					<View style={[styles.miniProgress, {width, backgroundColor: theme.progress}]}/>
				</View>
			</View>
		</View>
	);
});
