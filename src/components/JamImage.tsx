import React from 'react';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {StyleProp} from 'react-native';
import dataService from '../services/data';

export default class JamImage extends React.PureComponent<{ id: string, size: number, requestSize?: number, style?: StyleProp<ImageStyle> }> {
	render(): React.ReactElement {
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		const {id, requestSize, size, style} = this.props;
		const source = {
			uri: dataService.jam.image.url(id, requestSize || 80, undefined, !headers),
			headers,
			priority: FastImage.priority.normal
		};
		return (
			<FastImage
				style={[{height: size, width: size}, style]}
				source={source}
				resizeMode={FastImage.resizeMode.contain}
			/>
		);
	}
}
