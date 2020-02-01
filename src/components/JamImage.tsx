import React from 'react';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {StyleProp} from 'react-native';
import jam from '../services/jamapi';

export default class JamImage extends React.PureComponent<{ id: string, size: number, requestSize?: number, style?: StyleProp<ImageStyle> }> {
	render(): JSX.Element {
		const headers = jam.auth.auth?.token ? {Authorization: `Bearer ${jam.auth.auth.token}`} : undefined;
		const source = {
			uri: jam.image.url(this.props.id, this.props.requestSize || 80, undefined, !headers),
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
