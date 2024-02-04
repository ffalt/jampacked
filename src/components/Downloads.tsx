import React, {useCallback} from 'react';
import {PageHeader} from './PageHeader';
import {ActiveDownloadItem} from './ActiveDownloadItem';
import {DefaultFlatList} from './DefFlatList';
import {View} from 'react-native';
import {ClickLabelIcon} from './ClickLabelIcon';
import {sharedStyles} from '../style/shared';
import {Download, pauseDownloads, resumeDownloads, useTrackPlayerDownloadsPaused} from '../services/downloader-api';

export const DownloadsPage: React.FC<{ downloads?: Array<Download>, title: string }> = ({downloads, title}) => {
	const paused = useTrackPlayerDownloadsPaused();
	const renderItem = useCallback(({item}: { item: Download }): React.JSX.Element => (<ActiveDownloadItem item={item}/>), []);

	const handlePauseToggle = useCallback((): void => {
		if (paused) {
			resumeDownloads().catch(console.error);
		} else {
			pauseDownloads().catch(console.error);
		}
	}, [paused]);

	const ListHeaderComponent = (
		<>
			<PageHeader title={title} subtitle="Pinned Media"/>
			<View style={sharedStyles.barButtons}>
				<ClickLabelIcon
					iconName={paused ? 'play' : 'pause'}
					onPress={handlePauseToggle}
					label={paused ? 'Resume Downloads' : 'Pause Downloads'}
					style={sharedStyles.barButton}
					labelStyle={sharedStyles.barButtonText}
				/>
			</View>
		</>
	);
	const reload = useCallback(() => {
		//TODO reload active download list
	}, []);
	return (
		<DefaultFlatList
			items={downloads}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			loading={false}
			reload={reload}
		/>
	);
};
