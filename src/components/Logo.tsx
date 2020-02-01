import React from 'react';
import FastImage from 'react-native-fast-image';
import {Image, ImageStyle, StyleProp} from 'react-native';
import {IMAGE_LOGO} from '../style/images';

export default class Logo extends React.PureComponent<{ size: number, style?: StyleProp<ImageStyle> }> {
	render(): JSX.Element {
		return (
			<Image
				style={[this.props.style, {height: this.props.size, width: this.props.size}]}
				source={IMAGE_LOGO}
				resizeMode={FastImage.resizeMode.contain}
			/>
		);
	}
}
