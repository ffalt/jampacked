import {ImageBackground, ImageSourcePropType, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../style/theming';
import {FontelloIcon} from './FontelloIcon';

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain'
	},
	gradient: {
		width: '100%',
		height: '100%'
	}
});

export const BackgroundIcon: React.FC<{ name: string; style?: StyleProp<ViewStyle>; }> = (
	{name, children, style}
) => {
	const [iconSource, setIconSource] = useState<ImageSourcePropType>(0);
	const theme = useTheme();

	useEffect(() => {
		let isSubscribed = true;
		FontelloIcon.getImageSource(name, 50, theme.separator)
			.then((src: ImageSourcePropType) => {
				if (isSubscribed) {
					setIconSource(src);
				}
			});
		return (): void => {
			isSubscribed = false;
		};
	}, [name, theme]);

	return (
		<ImageBackground style={style} imageStyle={styles.image} source={iconSource}>
			<LinearGradient colors={theme.overlayGradient} start={{x: 0, y: 0}} end={{x: 0, y: 1}} style={styles.gradient}>
				{children}
			</LinearGradient>
		</ImageBackground>
	);
};
