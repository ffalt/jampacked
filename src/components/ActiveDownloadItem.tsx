import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ThemedText} from './ThemedText';
import {CircularProgress} from './CircularProgress';
import {sharedStyles} from '../style/shared';
import {usePinnedMediaDownload} from '../services/pin-hooks';
import {humanFileSize} from '../utils/filesize.utils';
import {Download, downloadStateToString} from '../services/downloader-api.ts';

export const ActiveDownloadItem: React.FC<{ item: Download }> = React.memo(({item}) => {
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
					<ThemedText style={sharedStyles.itemFooterText}>{state.bytes}</ThemedText>
				</View>
			</View>
			{/*<TouchableOpacity onPress={handlePress} style={sharedStyles.itemSectionRight}>*/}
			{/*	<ThemedIcon name={state.icon}/> */}
			{/*</TouchableOpacity>*/}
		</View>
	);
});
