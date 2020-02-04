import React from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import {IMAGE_LOGO} from '../style/images';

export default class Logo extends React.PureComponent<{ size: number, style?: StyleProp<ImageStyle> }> {
	render(): React.ReactElement {
		return (
			<Image
				style={[this.props.style, {height: this.props.size, width: this.props.size}]}
				source={IMAGE_LOGO}
			/>
		);
	}
}
