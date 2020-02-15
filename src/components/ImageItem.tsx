import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ITheme, withTheme} from '../style/theming';
import dataService, {BaseEntry} from '../services/data';
import NavigationService from '../services/navigation';

const styles = StyleSheet.create({
	item: {}
});

class ImageItem extends PureComponent<{ item: BaseEntry; theme: ITheme; size: number; }> {

	private click = (): void => {
		const {id, title, objType} = this.props.item;
		NavigationService.navigateObj(objType, id, title);
	};

	render(): React.ReactElement {
		const {item, theme, size} = this.props;
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		const source = {
			uri: dataService.jam.image.url(item.id, 300, undefined, !headers),
			headers,
			priority: FastImage.priority.normal
		};
		return (
			<TouchableOpacity
				onPress={this.click}
				style={[styles.item, {
					height: size,
					width: size,
					backgroundColor: theme.background
				}]}
			>
				<FastImage
					style={{flex: 1}}
					source={source}
					resizeMode={FastImage.resizeMode.contain}
				/>
			</TouchableOpacity>
		);
	}
}

export default withTheme(ImageItem);
