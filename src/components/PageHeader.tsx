import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ThemedText from './ThemedText';
import {ITheme, staticTheme, withTheme} from '../style/theming';

const styles = StyleSheet.create({
	ListHeaderTitle: {
		fontSize: staticTheme.fontSizeHuge
	},
	ListHeader: {
		paddingTop: staticTheme.statusBarOffset,
		alignItems: 'center',
		justifyContent: 'center',
		height: 140
	}
});

class PageHeader extends PureComponent<{
	title: string;
	theme: ITheme;
}> {
	render(): JSX.Element {
		return (
			<LinearGradient
				colors={this.props.theme.gradient}
				start={{x: 0, y: 0}}
				end={{x: 0, y: 1}}
				style={styles.ListHeader}
			>
				<ThemedText style={styles.ListHeaderTitle}>{this.props.title}</ThemedText>
			</LinearGradient>
		);
	}
}

export default withTheme(PageHeader);
