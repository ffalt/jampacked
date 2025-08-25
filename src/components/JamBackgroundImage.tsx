import React, { PropsWithChildren } from 'react';
import { FlexStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
import { useAuth } from '../services/auth';

export const FastImageBackground: React.FC<PropsWithChildren<{ id: string; style?: StyleProp<ViewStyle> & FlexStyle; imageStyle?: Partial<ImageStyle> }>> = ({ id, children, style, imageStyle }) => {
	const auth = useAuth();

	const source = React.useMemo(() => auth.imgSource(id, 300), [auth, id]);

	const imgStyle = React.useMemo(() => [
		StyleSheet.absoluteFill,
		{
			width: style?.width,
			height: Number(style?.height ?? 1) - 1
		},
		imageStyle
	], [imageStyle, style]);

	const backgroundImage = (id && source?.uri) && (
		<FastImage style={imgStyle} source={source} />
	);

	return (
		<View style={style}>
			{backgroundImage}
			{children}
		</View>
	);
};
