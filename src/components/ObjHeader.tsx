import React, {PureComponent, ReactNode} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
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
	},
	ListHeaderCmdButton: {
		paddingHorizontal: staticTheme.padding
	}
});

const styles = StyleSheet.create({
	header: {
		flexDirection: 'column',
		paddingTop: 35,
		height: 350
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
	headerBottom: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: staticTheme.padding
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
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	headerTitle: {
		paddingLeft: staticTheme.padding,
		fontSize: staticTheme.fontSizeBig,
		textAlign: 'center'
	},
	headerExtra: {
		paddingTop: staticTheme.paddingLarge,
		flexDirection: 'column'
	},
	ListHeaderRow: {
		flexDirection: 'row'
	},
	ListHeaderTitle: {
		flex: 1,
		letterSpacing: 2,
		textTransform: 'uppercase',
		paddingTop: 2,
		fontSize: staticTheme.fontSizeTiny,
		fontWeight: 'bold',
		textAlign: 'right',
		paddingRight: staticTheme.padding
	},
	ListHeaderValue: {
		flex: 1
	}
});


export interface HeaderDetail {
	title: string;
	value: string;
	click?: () => void;
}

class ObjHeader extends PureComponent<{
	id: string;
	title: string;
	typeName?: string;
	theme: ITheme;
	details?: Array<HeaderDetail>;
	headerTitleCmds?: ReactNode | Array<ReactNode>;
}> {

	renderDetails(): JSX.Element | undefined {
		const {details, theme} = this.props;
		const result: Array<JSX.Element> = [];
		(details || []).forEach(detail => {
			if (detail.click) {
				const onClick = (): void => {
					if (detail.click) {
						detail.click();
					}
				};
				result.push((
					<TouchableOpacity style={styles.ListHeaderRow} onPress={onClick}>
						<ThemedText style={[styles.ListHeaderTitle, {color: theme.muted}]}>{detail.title}</ThemedText>
						<ThemedText style={styles.ListHeaderValue}>{detail.value}</ThemedText>
					</TouchableOpacity>
				));
			} else {
				result.push((
					<View style={styles.ListHeaderRow}>
						<ThemedText style={[styles.ListHeaderTitle, {color: theme.muted}]}>{detail.title}</ThemedText>
						<ThemedText style={styles.ListHeaderValue}>{detail.value}</ThemedText>
					</View>
				));
			}
		});
		if (result.length) {
			return (<View style={styles.headerExtra}>{result}</View>);
		}
	}

	render(): React.ReactElement {
		const {id, typeName, title, headerTitleCmds, theme} = this.props;
		return (
			<FastImageBackground id={this.props.id} style={styles.header}>
				<View style={styles.headerTop}>
					<JamImage id={id} size={173} requestSize={300}/>
					<View style={styles.headerTitleContainer}>
						<ThemedText style={[styles.headerTitleType, {color: theme.muted}]}>{typeName}</ThemedText>
						<ThemedText numberOfLines={3} style={styles.headerTitle}>{title}</ThemedText>
						<View style={styles.headerTitleCmds}>{headerTitleCmds}</View>
					</View>
				</View>
				{this.renderDetails()}
			</FastImageBackground>
		);
	}
}

export default withTheme(ObjHeader);
