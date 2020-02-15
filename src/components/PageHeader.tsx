import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from './ThemedText';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import ThemedIcon from './ThemedIcon';
import BackgroundIcon from './BackgroundIcon';

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

class PageHeader extends PureComponent<{
	title: string;
	titleIcon: string;
	theme: ITheme;
	tiles: boolean;
	toggleView: () => void;
}> {

	private toggleView = (): void => {
		const {toggleView} = this.props;
		if (toggleView) {
			toggleView();
		}
	};

	render(): React.ReactElement {
		const {tiles, title, titleIcon} = this.props;
		const iconName = tiles ? 'view-details' : 'view-tiles';
		return (
			<BackgroundIcon name={titleIcon} style={styles.ListHeaderBackground}>
				<View style={styles.ListHeader}>
					<View style={styles.ListHeaderTitleContainer}>
						<ThemedText style={styles.ListHeaderTitle}>{title}</ThemedText>
					</View>
					<TouchableOpacity style={styles.button} onPress={this.toggleView}>
						<ThemedIcon name={iconName} style={styles.buttonIcon}/>
					</TouchableOpacity>
				</View>
			</BackgroundIcon>
		);
	}
}

export default withTheme(PageHeader);
