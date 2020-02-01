import React, {PureComponent} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ThemedText from './ThemedText';
import {staticTheme} from '../style/theming';
import JamImage from './JamImage';
import {ItemData} from '../services/data';
import NavigationService from '../services/navigation';

const styles = StyleSheet.create({
	item: {
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

export default class Item extends PureComponent<{ item: ItemData<any> }> {

	private click = (): void => {
		NavigationService.navigateLink(this.props.item.link);
	};

	render(): JSX.Element {
		return (
			<TouchableOpacity onPress={this.click} style={styles.item}>
				<JamImage id={this.props.item.id} size={46}/>
				<View style={styles.itemContent}>
					<ThemedText style={styles.itemText}>{this.props.item.title}</ThemedText>
					<ThemedText style={styles.itemFooter}>{this.props.item.desc}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	}
}
