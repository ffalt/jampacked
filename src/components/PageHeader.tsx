import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {BackgroundIcon} from './BackgroundIcon';
import {getStatusBarHeight} from 'react-native-status-bar-height';

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
		paddingLeft: 55,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column'
	},
	ListHeaderBackground: {
		height: staticTheme.iconHeaderHeight
	},
	ListHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1
	},
	button: {
		marginRight: staticTheme.marginLarge * 2,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		padding: staticTheme.padding
	},
	buttonIcon: {
		fontSize: 18
	},
	icon: {
		fontSize: 48
	}
});

export const PageHeader: React.FC<{
	title: string;
	subtitle?: string;
	titleIcon: string;
	tiles?: boolean;
	toggleView?: () => void;
}> = ({tiles, title, titleIcon, toggleView, subtitle}) => {

	const handleToggleView = (): void => {
		if (toggleView) {
			toggleView();
		}
	};

	const iconName = tiles ? 'view-details' : 'view-tiles';
	const toggleViewButton = toggleView
		? (
			<TouchableOpacity style={styles.button} onPress={handleToggleView}>
				<ThemedIcon name={iconName} size={styles.buttonIcon.fontSize}/>
			</TouchableOpacity>
		)
		: undefined;
	const subtitleView = subtitle ?
		(<ThemedText style={styles.ListHeaderSubtitle}>{subtitle}</ThemedText>) :
		undefined;

	const paddingRight = toggleView ? 0 : 75;
	const statusBarHeight = getStatusBarHeight();

	return (
		<BackgroundIcon name={titleIcon} style={[styles.ListHeaderBackground, {marginTop: statusBarHeight}]}>
			<View style={styles.ListHeader}>
				<View style={[styles.ListHeaderTitleContainer, {paddingRight}]}>
					{subtitleView}
					<ThemedText style={styles.ListHeaderTitle}>{title}</ThemedText>
				</View>
				{toggleViewButton}
			</View>
		</BackgroundIcon>
	);
};
