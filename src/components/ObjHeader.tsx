import React, {PureComponent, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import ThemedText from './ThemedText';
import {ITheme, staticTheme, withTheme} from '../style/theming';
import JamImage from './JamImage';
import FastImageBackground from './JamBackgroundImage';

export const objHeaderStyles = StyleSheet.create({
	ListHeaderUpperTitle: {
		fontSize: staticTheme.fontSize,
		marginBottom: staticTheme.marginSmall
	},
	ListHeaderUpperLabel: {
		fontSize: staticTheme.fontSizeSmall
	}
});

const styles = StyleSheet.create({
	header: {
		paddingTop: 35,
		height: 250
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: staticTheme.padding
	},
	headerBottom: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: staticTheme.padding
	},
	headerBottomCmds: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: staticTheme.margin,
		justifyContent: 'space-around',
		height: 40,
		width: '100%',
		borderRadius: 6,
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
	headerTitle: {
		flex: 1,
		paddingLeft: staticTheme.padding,
		fontSize: staticTheme.fontSizeBig
	},
	headerExtra: {
		flex: 1,
		alignItems: 'flex-end'
	}
});

class ObjHeader extends PureComponent<{
	id: string;
	title: string;
	theme: ITheme;
	children?: ReactNode | Array<ReactNode>;
	headerTitleCmds?: ReactNode | Array<ReactNode>;
}> {
	render(): React.ReactElement {
		return (
			<FastImageBackground id={this.props.id} style={styles.header}>
				<View style={styles.headerTop}>
					<JamImage id={this.props.id} size={160} requestSize={300}/>
					<View style={styles.headerExtra}>
						{this.props.children}
						<View style={styles.headerBottomCmds}>
							{this.props.headerTitleCmds}
						</View>
					</View>
				</View>
				<View style={styles.headerBottom}>
					<ThemedText numberOfLines={1} style={styles.headerTitle}>{this.props.title}</ThemedText>
				</View>
			</FastImageBackground>
		);
	}
}

export default withTheme(ObjHeader);
