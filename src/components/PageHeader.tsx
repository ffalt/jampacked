import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ThemedText from './ThemedText';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import ThemedIcon from './ThemedIcon';

const styles = StyleSheet.create({
	ListHeaderTitle: {
		paddingLeft: staticTheme.padding,
		fontSize: staticTheme.fontSizeHuge
	},
	ListHeaderTitleContainer: {
		paddingLeft: staticTheme.padding,
		alignItems: 'center',
		flexDirection: 'row'
	},
	ListHeader: {
		paddingTop: staticTheme.statusBarOffset,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 140
	},
	button: {
		marginRight: staticTheme.marginLarge + 10,
		borderRadius: 4,
		padding: staticTheme.padding
	},
	buttonIcon: {
		fontSize: 18
	},
	icon: {
		fontSize: 50
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
		const {tiles, theme, title, titleIcon} = this.props;
		const iconName = tiles ? 'view-details' : 'view-tiles';
		return (
			<LinearGradient
				colors={theme.gradient}
				start={{x: 0, y: 0}}
				end={{x: 0, y: 1}}
				style={styles.ListHeader}
			>
				<View style={styles.ListHeaderTitleContainer}>
					<ThemedIcon name={titleIcon} style={styles.icon}/>
					<ThemedText style={styles.ListHeaderTitle}>{title}</ThemedText>
				</View>
				<TouchableOpacity style={styles.button} onPress={this.toggleView}>
					<ThemedIcon name={iconName} style={styles.buttonIcon}/>
				</TouchableOpacity>
			</LinearGradient>
		);
	}
}

export default withTheme(PageHeader);
