import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../services/auth';
import {useTheme} from '../style/theming';

const styles = StyleSheet.create({
	linearGradient: {
		backgroundColor: 'transparent',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
});

export const FastImageBackground: React.FC<{ id: string, style?: any, imageStyle?: any }> = ({id, children, style, imageStyle}) => {
	const auth = useAuth();
	const theme = useTheme();

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
		<FastImage style={imgStyle} source={source}>
			<LinearGradient
				colors={theme.overlayGradient}
				start={{x: 0, y: 0}}
				end={{x: 0, y: 1}}
				style={styles.linearGradient}
			/>
		</FastImage>
	);

	return (
		<View style={style}>
			{backgroundImage}
			{children}
		</View>
	);
};
