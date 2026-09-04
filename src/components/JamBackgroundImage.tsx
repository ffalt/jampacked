import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
import { useAuth } from '../services/jam.auth.ts';
import { useTheme } from '../style/theming';

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
});

export const FastImageBackground: React.FC<PropsWithChildren<{ id: string; style?: StyleProp<ViewStyle>; imageStyle?: Partial<ImageStyle> }>> = ({ id, children, style, imageStyle }) => {
	const auth = useAuth();
	const theme = useTheme();

	const source = React.useMemo(() => auth.imgSource(id, 300), [auth, id]);

	const imgStyle = React.useMemo(() => {
		const layout = StyleSheet.flatten(style);
		return [
			StyleSheet.absoluteFill,
			{
				width: layout?.width,
				height: Number(layout?.height ?? 1) - 1
			},
			imageStyle
		];
	}, [imageStyle, style]);

	const overlayStyle = React.useMemo((): StyleProp<ViewStyle> => [
		styles.overlay,
		{
			backgroundImage: [{
				type: 'linear-gradient',
				direction: 'to bottom',
				colorStops: theme.overlayGradient.map(color => ({ color }))
			}]
		}
	], [theme.overlayGradient]);

	const backgroundImage = (id && source?.uri) && (
		<FastImage style={imgStyle} source={source}>
			<View style={overlayStyle} />
		</FastImage>
	);

	return (
		<View style={style}>
			{backgroundImage}
			{children}
		</View>
	);
};
