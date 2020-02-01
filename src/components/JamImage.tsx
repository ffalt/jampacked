import React from 'react';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {StyleProp} from 'react-native';
import dataService from '../services/data';

export default class JamImage extends React.PureComponent<{ id: string, size: number, requestSize?: number, style?: StyleProp<ImageStyle> }> {
	render(): JSX.Element {
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		const source = {
			uri: dataService.jam.image.url(this.props.id, this.props.requestSize || 80, undefined, !headers),
			headers,
			priority: FastImage.priority.normal
		};
		return (
			<FastImage
				style={[{height: this.props.size, width: this.props.size}, this.props.style]}
				source={source}
				resizeMode={FastImage.resizeMode.contain}
			/>
		);
	}
}
