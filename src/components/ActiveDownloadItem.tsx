import React from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { sharedStyles } from '../style/shared';
import { downloadStateToString } from '../services/player.api.ts';
import { usePinnedMediaDownload } from '../services/pin.hooks.ts';
import { humanFileSize } from '../utils/filesize.utils';
import { useTheme } from '../style/theming.ts';
import { Download } from 'react-native-track-player';

const styles = StyleSheet.create({
	miniProgress: {
		height: 2
	},
	footer: {
		marginBottom: 5
	}
});

export const ActiveDownloadItem: React.FC<{ item: Download }> = React.memo(({ item }) => {
	const theme = useTheme();
	const { download, track } = usePinnedMediaDownload(item.id);
	const o = download ?? item;
	const percent = Math.max(o.percentDownloaded || 0, 0);
	const bytes = `${humanFileSize(o.bytesDownloaded)}`;
	const text = track ? ([track.album, track.title].join('-')) : 'Loading';
	const stateString = downloadStateToString(o.state);

	const width: DimensionValue = `${percent}%`;
	return (
		<View style={sharedStyles.item}>
			<View style={sharedStyles.itemContent}>
				<ThemedText style={sharedStyles.itemText} numberOfLines={1}>{text}</ThemedText>
				<View style={[sharedStyles.itemFooter, styles.footer]}>
					<ThemedText style={sharedStyles.itemFooterText}>{stateString}</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>
						{percent.toFixed(2)}
						%
					</ThemedText>
					<ThemedText style={sharedStyles.itemFooterText}>{bytes}</ThemedText>
				</View>
				<View style={[styles.miniProgress, { backgroundColor: theme.separator }]}>
					<View style={[styles.miniProgress, { width, backgroundColor: theme.progress }]} />
				</View>
			</View>
		</View>
	);
});
