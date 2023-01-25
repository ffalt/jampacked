import {StyleSheet} from 'react-native';
import {staticTheme} from './theming';

export const sharedStyles = StyleSheet.create({
	flex: {
		flex: 1
	},
	item: {
		paddingHorizontal: staticTheme.padding,
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		height: 60,
		maxHeight: 60,
		minHeight: 60
	},
	itemButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		padding: staticTheme.padding
	},
	itemButtonIcon: {
		fontSize: 22
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
	itemFooterTextRight: {
		textAlign: 'right'
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
		paddingHorizontal: staticTheme.padding,
		paddingVertical: staticTheme.paddingLarge,
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
	},
	barButtons: {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	barButton: {
		flex: 1,
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 32
	},
	barButtonText: {
		paddingHorizontal: staticTheme.paddingSmall
	}
});
