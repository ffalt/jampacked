import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import JamImage from './JamImage';
import ThemedText from './ThemedText';
import {staticTheme} from '../style/theming';
import {IndexEntry} from '../services/data';
import NavigationService from '../services/navigation';

const styles = StyleSheet.create({
	SectionHeader: {
		fontSize: staticTheme.fontSizeLarge,
		padding: staticTheme.padding,
		fontWeight: 'bold',
		height: 64,
		minHeight: 64,
		maxHeight: 64
	},
	item: {
		height: 64,
		minHeight: 64,
		maxHeight: 64,
		padding: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemContent: {
		alignSelf: 'stretch',
		paddingLeft: staticTheme.padding,
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	itemFooter: {
		fontSize: staticTheme.fontSizeSmall
	},
	itemText: {
		fontSize: staticTheme.fontSize
	}
});

export class IndexListItem extends React.PureComponent<{ item: IndexEntry }> {

	private click = (): void => {
		NavigationService.navigateLink(this.props.item.link);
	};

	render(): JSX.Element {
		return (
			<TouchableOpacity style={styles.item} onPress={this.click}>
				<JamImage id={this.props.item.id} size={46}/>
				<View style={styles.itemContent}>
					<ThemedText style={styles.itemText}>{this.props.item.title}</ThemedText>
					<ThemedText style={styles.itemFooter}>{this.props.item.desc}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	}
}
