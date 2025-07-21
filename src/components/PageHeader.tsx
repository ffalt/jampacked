import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { staticTheme } from '../style/theming';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { RouteLink } from '../navigators/Routes';
import { NavigationService } from '../navigators/navigation';
import { ClickIcon } from './ClickIcon';

const styles = StyleSheet.create({
	ListHeaderTitle: {
		paddingLeft: staticTheme.padding,
		fontSize: staticTheme.fontSizeHuge
	},
	ListHeaderSubtitle: {
		paddingLeft: staticTheme.padding,
		fontSize: staticTheme.fontSize
	},
	ListHeaderTitleContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	ListHeader: {
		height: staticTheme.pageHeaderHeight,
		alignItems: 'center',
		flexDirection: 'row'
	},
	buttonWrapper: {
		width: 40
	},
	// eslint-disable-next-line react-native/no-unused-styles
	buttonIcon: {
		fontSize: staticTheme.fontSizeSmall
	}
});

export const PageHeader: React.FC<{
	title: string;
	subtitle?: string;
	goLeft?: RouteLink;
	goRight?: RouteLink;
}> = ({ title, goLeft, goRight, subtitle }) => {
	const goLeftButton = goLeft !== undefined ?
			(<ClickIcon iconName="left-open" fontSize={styles.buttonIcon.fontSize} muted={true} onPress={(): void => NavigationService.navigateTo(goLeft.navig)}/>) :
		undefined;
	const goRightButton = goRight !== undefined ?
			(<ClickIcon iconName="right-open" fontSize={styles.buttonIcon.fontSize} muted={true} onPress={(): void => NavigationService.navigateTo(goRight.navig)}/>) :
		undefined;
	const subtitleView = subtitle ?
			(<ThemedText style={styles.ListHeaderSubtitle}>{subtitle}</ThemedText>) :
		undefined;

	const statusBarHeight = getStatusBarHeight();

	return (
		<View style={[styles.ListHeader, { marginTop: statusBarHeight }]}>
			<View style={styles.buttonWrapper}>
				{goLeftButton}
			</View>
			<View style={styles.ListHeaderTitleContainer}>
				{subtitleView}
				<ThemedText style={styles.ListHeaderTitle}>{title}</ThemedText>
			</View>
			<View style={styles.buttonWrapper}>
				{goRightButton}
			</View>
		</View>
	);
};
