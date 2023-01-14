import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useAuth} from '../services/auth';

export const FastImageBackground: React.FC<PropsWithChildren<{ id: string, style?: any, imageStyle?: any }>> = ({id, children, style, imageStyle}) => {
	const auth = useAuth();

	const source = React.useMemo(() => auth.imgSource(id, 300), [auth, id]);

	const imgStyle = React.useMemo(() => [
		StyleSheet.absoluteFill,
		{
			width: style?.width,
			height: (style?.height || 1) - 1
		},
		imageStyle
	], [imageStyle, style]);

	const backgroundImage = (id && source && source.uri) && (
		<FastImage style={imgStyle} source={source}></FastImage>
	);

	return (
		<View style={style}>
			{backgroundImage}
			{children}
		</View>
	);
};
