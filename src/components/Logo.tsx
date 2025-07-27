import React from 'react';
import { DimensionValue, Image, ImageStyle, StyleProp } from 'react-native';
import { IMAGE_LOGO } from '../style/images';

export const Logo: React.FC<{ size: number; style?: StyleProp<ImageStyle> }> = ({ size, style }) =>
	(<Image style={[style, { height: size, width: size as DimensionValue }]} source={IMAGE_LOGO} />);
