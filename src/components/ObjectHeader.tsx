import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { staticTheme, useTheme } from '../style/theming';
import { JamImage } from './JamImage';
import { FastImageBackground } from './JamBackgroundImage';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const objectHeaderStyles = StyleSheet.create({
	// eslint-disable-next-line react-native/no-unused-styles
	button: {
		paddingHorizontal: staticTheme.paddingSmall,
		marginHorizontal: staticTheme.marginLarge
	},
	// eslint-disable-next-line react-native/no-unused-styles
	buttonIcon: {
		fontSize: 26
	},
	// eslint-disable-next-line react-native/no-unused-styles
	panel: {
		paddingHorizontal: staticTheme.paddingSmall,
		marginHorizontal: staticTheme.marginLarge
	}
});

const styles = StyleSheet.create({
	header: {
		flexDirection: 'column',
		// paddingTop: staticTheme.statusBarOffset + staticTheme.padding,
		height: 320
	},
	headerTitleType: {
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeTiny,
		fontWeight: 'bold'
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: staticTheme.padding
	},
	headerTitleCmdsExtra: {
		flexDirection: 'row',
		paddingTop: staticTheme.padding
	},
	headerTitleCmds: {
		paddingTop: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 40,
		borderRadius: 6
	},
	headerTitleContainer: {
		flex: 1,
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	headerTitle: {
		fontSize: staticTheme.fontSizeBig,
		textAlign: 'center'
	},
	headerExtraContainer: {
		alignSelf: 'center'
	},
	headerExtra: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	ListHeaderRow: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	ListHeaderTitle: {
		width: 90,
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold',
		textAlign: 'right',
		paddingRight: staticTheme.padding
	},
	ListHeaderValue: {
		minWidth: 90,
		maxWidth: '75%',
		fontSize: staticTheme.fontSize
	}
});

export interface HeaderDetail {
	title: string;
	value: string;
	click?: () => void;
}

export const ObjectHeader: React.FC<{
	id: string;
	title: string;
	typeName?: string;
	details?: Array<HeaderDetail>;
	headerTitleCmds?: ReactNode | Array<ReactNode>;
	headerTitleCmdsExtras?: ReactNode | Array<ReactNode>;
	customDetails?: ReactNode | Array<ReactNode>;
}> = ({ id, typeName, title, headerTitleCmds, headerTitleCmdsExtras, details, customDetails }) => {
	const theme = useTheme();
	const statusBarHeight = getStatusBarHeight() + staticTheme.padding;

	const renderDetails = (): React.JSX.Element | undefined => {
		if (customDetails) {
			return (
				<View style={styles.headerExtra}>
					<View style={styles.headerExtraContainer}>
						{customDetails}
					</View>
				</View>
			);
		}
		const result: Array<React.JSX.Element> = [];
		for (const detail of (details || [])) {
			if (detail.click) {
				const onClick = (): void => {
					if (detail.click) {
						detail.click();
					}
				};
				result.push((
					<TouchableOpacity key={detail.title} style={styles.ListHeaderRow} onPress={onClick}>
						<ThemedText style={[styles.ListHeaderTitle, { color: theme.muted }]}>{detail.title}</ThemedText>
						<ThemedText style={styles.ListHeaderValue}>{detail.value}</ThemedText>
					</TouchableOpacity>
				));
			} else {
				result.push((
					<View key={detail.title} style={styles.ListHeaderRow}>
						<ThemedText style={[styles.ListHeaderTitle, { color: theme.muted }]}>{detail.title}</ThemedText>
						<ThemedText style={styles.ListHeaderValue}>{detail.value}</ThemedText>
					</View>
				));
			}
		}
		if (result.length > 0) {
			return (
				<View style={styles.headerExtra}>
					<View style={styles.headerExtraContainer}>
						{result}
					</View>
				</View>
			);
		}
	};

	return (
		<FastImageBackground id={id} style={[styles.header, { paddingTop: statusBarHeight }]}>
			<View style={styles.headerTop}>
				<JamImage id={id} size={173} requestSize={staticTheme.cover} />
				<View style={styles.headerTitleContainer}>
					<ThemedText style={[styles.headerTitleType, { color: theme.muted }]}>{typeName}</ThemedText>
					<ThemedText numberOfLines={2} style={styles.headerTitle}>{title}</ThemedText>
					<View style={styles.headerTitleCmds}>{headerTitleCmds}</View>
					<View style={styles.headerTitleCmdsExtra}>{headerTitleCmdsExtras}</View>
				</View>
			</View>
			{renderDetails()}
		</FastImageBackground>
	);
};
