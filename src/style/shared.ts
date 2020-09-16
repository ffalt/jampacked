import {StyleSheet} from 'react-native';
import {staticTheme} from './theming';

export const sharedStyles = StyleSheet.create({
	item: {
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		height: 60,
		backgroundColor: 'red'
	},
	itemSectionLeft: {
		marginRight: staticTheme.margin
	},
	itemSectionRight: {
		marginLeft: staticTheme.margin
	},
	itemContent: {
		alignSelf: 'stretch',
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	itemFooterText: {
		fontSize: staticTheme.fontSizeSmall,
		opacity: 0.8
	},
	itemFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	itemText: {
		fontSize: staticTheme.fontSize
	},
	sectionHeader: {
		marginTop: staticTheme.margin,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	sectionHeaderText: {
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold'
	},
	sectionHeaderIcon: {
		fontSize: staticTheme.fontSizeSmall
	}

});
