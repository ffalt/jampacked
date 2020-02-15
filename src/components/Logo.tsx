import React from 'react';
import {Image, ImageStyle, StyleProp} from 'react-native';
import {IMAGE_LOGO} from '../style/images';

export default class Logo extends React.PureComponent<{ size: number, style?: StyleProp<ImageStyle> }> {
	render(): React.ReactElement {
		const {size, style} = this.props;
		return (
			<Image
				style={[style, {height: size, width: size}]}
				source={IMAGE_LOGO}
			/>
		);
	}
}
