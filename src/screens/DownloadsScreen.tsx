import React, {useCallback, useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Separator} from '../components/Separator';
import {commonItemLayout} from '../components/AtoZList';
import {DownloadTask} from 'react-native-background-downloader';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedText} from '../components/ThemedText';
import {formatDuration} from '../utils/duration.utils';
import {ThemedIcon} from '../components/ThemedIcon';
import {PageHeader} from '../components/PageHeader';
import {CircularProgress} from '../components/CircularProgress';
import {useDownloads, useDownloadStatus} from '../services/cache-hooks';

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
	buttonText: {
		fontSize: staticTheme.fontSizeHuge
	}
});

export const DownloadItem: React.FC<{ item: DownloadTask }> = React.memo(({item}) => {
	const theme = useTheme();
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
		<View style={[styles.item, {backgroundColor: theme.background}]}>
			<CircularProgress
				indeterminate={state.indeterminate}
				size={26}
				strokeWidth={2}
				progress={state.percent}
			/>
			<View style={styles.itemContent}>
				<ThemedText style={styles.itemText}>{state.text}</ThemedText>
				<View style={styles.itemFooter}>
					<ThemedText style={styles.itemFooterText}>{state.state}</ThemedText>
					<ThemedText style={styles.itemFooterText}>{state.duration}</ThemedText>
				</View>
			</View>
			<TouchableOpacity onPress={handlePress}>
				<ThemedIcon name={state.icon}/>
			</TouchableOpacity>
		</View>
	);
});

export const DownloadsScreen: React.FC<HomeStackProps<HomeRoute.DOWNLOADS>> = () => {
	const downloads = useDownloads();
	const getItemLayout = React.useMemo(() => commonItemLayout(65), []);
	const keyExtractor = (item: DownloadTask): string => item.id;
	const renderItem = useCallback(({item}: { item: DownloadTask }): JSX.Element => (<DownloadItem item={item}/>), []);
	const ListHeaderComponent = (<PageHeader title="Downloads" subtitle="Pinned Media" titleIcon="download"/>);
	return (
		<FlatList
			data={downloads}
			key="downloads"
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			ListHeaderComponent={ListHeaderComponent}
			ItemSeparatorComponent={Separator}
			getItemLayout={getItemLayout}
		/>
	);
};
