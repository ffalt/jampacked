import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {BackgroundIcon} from './BackgroundIcon';

const styles = StyleSheet.create({
	ListHeaderTitle: {
		paddingLeft: staticTheme.padding,
		fontSize: staticTheme.fontSizeHuge
	},
	ListHeaderTitleContainer: {
		flex: 1,
		paddingLeft: 55,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
	},
	ListHeaderBackground: {
		height: 180
	},
	ListHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1
	},
	button: {
		marginRight: staticTheme.marginLarge + 15,
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
	titleIcon: string;
	tiles?: boolean;
	toggleView?: () => void;
}> = ({tiles, title, titleIcon, toggleView}) => {

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
		: <></>;
	const paddingRight = toggleView ? 0 : 75;

	return (
		<BackgroundIcon name={titleIcon} style={styles.ListHeaderBackground}>
			<View style={styles.ListHeader}>
				<View style={[styles.ListHeaderTitleContainer, {paddingRight}]}>
					<ThemedText style={styles.ListHeaderTitle}>{title}</ThemedText>
				</View>
				{toggleViewButton}
			</View>
		</BackgroundIcon>
	);
};
